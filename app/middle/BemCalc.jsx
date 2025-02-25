import React, { useReducer, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet, 
  TouchableOpacity,
  Alert,
  ScrollView,
  ToastAndroid,
  Platform,
  ActivityIndicator,
  Modal,
  Share
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bemStream } from './data/bemStreams';

// Enhanced Checkbox component
const Checkbox = ({ value, onValueChange, disabled = false }) => {
  return (
    <TouchableOpacity 
      onPress={() => !disabled && onValueChange(!value)} 
      style={[styles.checkbox, disabled && styles.disabledCheckbox, value && styles.checkedCheckbox]}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
    >
      {value && <Text style={styles.checkboxMark}>✓</Text>}
    </TouchableOpacity>
  );
};

// Initial state setup
const initialState = {
  grades: {},
  optionalSelected: {},
  bemAverage: '0.00',
  subjectMultipliers: Object.fromEntries(
    bemStream.subjects.map((subject) => [subject.name, subject.multiplier])
  ),
  isLoading: false,
  saveModalVisible: false,
  savedResults: [],
};

// Reducer for centralized state management
function bemReducer(state, action) {
  switch (action.type) {
    case 'SET_GRADE':
      return {
        ...state,
        grades: { ...state.grades, [action.subject]: action.value }
      };
    case 'SET_MULTIPLIER':
      return {
        ...state,
        subjectMultipliers: { ...state.subjectMultipliers, [action.subject]: action.value }
      };
    case 'TOGGLE_OPTIONAL':
      const newOptionalSelected = { 
        ...state.optionalSelected, 
        [action.subject]: action.value 
      };
      
      // Clear grade if deselected
      const newGrades = { ...state.grades };
      if (!action.value) {
        newGrades[action.subject] = '';
      }
      
      return {
        ...state,
        optionalSelected: newOptionalSelected,
        grades: newGrades
      };
    case 'SET_AVERAGE':
      return {
        ...state,
        bemAverage: action.value
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.value
      };
    case 'SET_SAVED_RESULTS':
      return {
        ...state,
        savedResults: action.value
      };
    case 'TOGGLE_SAVE_MODAL':
      return {
        ...state,
        saveModalVisible: action.value
      };
    case 'LOAD_STATE':
      return {
        ...state,
        ...action.state
      };
    case 'RESET_ALL':
      return {
        ...initialState,
        savedResults: state.savedResults
      };
    default:
      return state;
  }
}

export default function BemCalcScreen() {
  const [state, dispatch] = useReducer(bemReducer, initialState);
  const { 
    grades, 
    optionalSelected, 
    bemAverage, 
    subjectMultipliers, 
    isLoading,
    saveModalVisible,
    savedResults
  } = state;

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', value: true });
        const savedData = await AsyncStorage.getItem('bemCalcData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          dispatch({ type: 'LOAD_STATE', state: parsedData });
        }
        
        const savedResults = await AsyncStorage.getItem('bemSavedResults');
        if (savedResults) {
          dispatch({ type: 'SET_SAVED_RESULTS', value: JSON.parse(savedResults) });
        }
      } catch (error) {
        console.error('Error loading data', error);
        showToast('خطأ في تحميل البيانات المحفوظة');
      } finally {
        dispatch({ type: 'SET_LOADING', value: false });
      }
    };
    
    loadSavedData();
  }, []);

  // Show toast message
  const showToast = useCallback((message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('', message);
    }
  }, []);

  // Save current state
  const saveData = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', value: true });
      const dataToSave = {
        grades,
        optionalSelected,
        bemAverage,
        subjectMultipliers
      };
      
      await AsyncStorage.setItem('bemCalcData', JSON.stringify(dataToSave));
      showToast('تم حفظ البيانات بنجاح');
    } catch (error) {
      console.error('Error saving data', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء حفظ البيانات');
    } finally {
      dispatch({ type: 'SET_LOADING', value: false });
    }
  }, [grades, optionalSelected, bemAverage, subjectMultipliers, showToast]);

  // Save result with a name
  const saveResult = useCallback(async (name) => {
    try {
      const newResult = {
        id: Date.now().toString(),
        name,
        date: new Date().toLocaleDateString('ar-DZ'),
        average: bemAverage,
        grades: { ...grades }
      };
      
      const newResults = [...savedResults, newResult];
      await AsyncStorage.setItem('bemSavedResults', JSON.stringify(newResults));
      
      dispatch({ type: 'SET_SAVED_RESULTS', value: newResults });
      dispatch({ type: 'TOGGLE_SAVE_MODAL', value: false });
      
      showToast(`تم حفظ النتيجة باسم "${name}"`);
    } catch (error) {
      console.error('Error saving result', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء حفظ النتيجة');
    }
  }, [bemAverage, grades, savedResults, showToast]);

  // Share results
  const shareResults = useCallback(async () => {
    try {
      let message = `معدل البكالوريا: ${bemAverage}\n\n`;
      message += 'درجات المواد:\n';
      
      bemStream.subjects.forEach(subject => {
        const isOptional = bemStream.subjects.indexOf(subject) >= bemStream.subjects.length - 3;
        const enabled = isOptional ? optionalSelected[subject.name] : true;
        
        if (enabled && grades[subject.name]) {
          message += `${subject.name}: ${grades[subject.name]}/20 (معامل: ${subjectMultipliers[subject.name]})\n`;
        }
      });
      
      await Share.share({
        message,
        title: 'نتائج حساب معدل البكالوريا'
      });
    } catch (error) {
      console.error('Error sharing results', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء مشاركة النتائج');
    }
  }, [bemAverage, grades, optionalSelected, subjectMultipliers]);

  // Validate and update grade input
  const handleGradeInput = useCallback((subjectName, inputValue) => {
    if (inputValue === '') {
      dispatch({ type: 'SET_GRADE', subject: subjectName, value: '' });
      return;
    }
    
    const numericValue = Number(inputValue);
    if (isNaN(numericValue) || numericValue < 0 || numericValue > 20) {
      Alert.alert('خطأ', 'الرجاء إدخال قيمة بين 0 و 20');
      dispatch({ type: 'SET_GRADE', subject: subjectName, value: '' });
    } else {
      dispatch({ type: 'SET_GRADE', subject: subjectName, value: inputValue });
    }
  }, []);

  // Validate and update multiplier input
  const handleMultiplierInput = useCallback((subjectName, inputValue) => {
    if (inputValue === '') {
      dispatch({ type: 'SET_MULTIPLIER', subject: subjectName, value: '' });
      return;
    }
    
    const numericValue = Number(inputValue);
    if (isNaN(numericValue) || numericValue <= 0) {
      Alert.alert('خطأ', 'الرجاء إدخال معامل صحيح أكبر من 0');
      const defaultMultiplier = bemStream.subjects.find(s => s.name === subjectName)?.multiplier || 1;
      dispatch({ type: 'SET_MULTIPLIER', subject: subjectName, value: defaultMultiplier });
    } else {
      dispatch({ type: 'SET_MULTIPLIER', subject: subjectName, value: numericValue });
    }
  }, []);

  // Toggle whether an optional subject is counted
  const handleToggleOptional = useCallback((subjectName, value) => {
    dispatch({ type: 'TOGGLE_OPTIONAL', subject: subjectName, value });
  }, []);

  // Calculate the BEM final mark
  const handleCalculateBem = useCallback(() => {
    let totalSum = 0;
    let totalMultiplier = 0;
    
    // Loop through all subjects
    bemStream.subjects.forEach((subject, index) => {
      const isOptional = index >= bemStream.subjects.length - 3;
      const enabled = isOptional ? optionalSelected[subject.name] : true;
      
      if (enabled) {
        const gradeValue = Number(grades[subject.name]) || 0;
        const multiplier = Number(subjectMultipliers[subject.name]) || subject.multiplier;
        totalSum += gradeValue * multiplier;
        totalMultiplier += multiplier;
      }
    });
    
    if (totalMultiplier === 0) {
      dispatch({ type: 'SET_AVERAGE', value: '0.00' });
      return;
    }
    
    const average = totalSum / totalMultiplier;
    dispatch({ type: 'SET_AVERAGE', value: average.toFixed(2) });
    
    // Auto-save after calculation
    saveData();
  }, [grades, optionalSelected, subjectMultipliers, saveData]);

  // Reset all inputs
  const handleReset = useCallback(() => {
    Alert.alert(
      'تأكيد',
      'هل أنت متأكد من رغبتك في إعادة ضبط جميع البيانات؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'موافق', 
          onPress: () => {
            dispatch({ type: 'RESET_ALL' });
            showToast('تم إعادة ضبط البيانات');
          } 
        }
      ]
    );
  }, [showToast]);

  // Show save modal
  const handleShowSaveModal = useCallback(() => {
    dispatch({ type: 'TOGGLE_SAVE_MODAL', value: true });
  }, []);

  // Close save modal
  const handleCloseSaveModal = useCallback(() => {
    dispatch({ type: 'TOGGLE_SAVE_MODAL', value: false });
  }, []);

  // Handle save with name
  const handleSaveWithName = useCallback(() => {
    Alert.prompt(
      'حفظ النتيجة',
      'أدخل اسمًا لهذه النتيجة:',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حفظ',
          onPress: (name) => {
            if (name && name.trim()) {
              saveResult(name.trim());
            } else {
              showToast('الرجاء إدخال اسم صالح');
            }
          }
        }
      ],
      'plain-text',
      ''
    );
  }, [saveResult, showToast]);

  // Get grade color based on value
  const getGradeColor = useCallback((grade) => {
    const numGrade = Number(grade);
    if (isNaN(numGrade)) return '#333';
    if (numGrade >= 16) return '#4CAF50'; // Excellent - Green
    if (numGrade >= 14) return '#8BC34A'; // Very Good - Light Green
    if (numGrade >= 12) return '#FFC107'; // Good - Yellow
    if (numGrade >= 10) return '#FF9800'; // Pass - Orange
    return '#F44336'; // Fail - Red
  }, []);

  // Get average result details
  const averageDetails = useMemo(() => {
    const numAverage = Number(bemAverage);
    
    if (numAverage >= 16) {
      return { 
        color: '#4CAF50', 
        message: 'ممتاز! تهانينا!',
        background: 'rgba(76, 175, 80, 0.1)',
        icon: '🏆'
      };
    } else if (numAverage >= 14) {
      return { 
        color: '#8BC34A', 
        message: 'جيد جدا!',
        background: 'rgba(139, 195, 74, 0.1)',
        icon: '🌟'
      };
    } else if (numAverage >= 12) {
      return { 
        color: '#FFC107', 
        message: 'جيد',
        background: 'rgba(255, 193, 7, 0.1)',
        icon: '👍'
      };
    } else if (numAverage >= 10) {
      return { 
        color: '#FF9800', 
        message: 'مقبول',
        background: 'rgba(255, 152, 0, 0.1)',
        icon: '✓'
      };
    } else {
      return { 
        color: '#F44336', 
        message: 'تحتاج الى مزيد من الجهد',
        background: 'rgba(244, 67, 54, 0.1)',
        icon: '📚'
      };
    }
  }, [bemAverage]);

  // Group subjects by mandatory and optional
  const groupedSubjects = useMemo(() => {
    const mandatorySubjects = bemStream.subjects.slice(0, -3);
    const optionalSubjects = bemStream.subjects.slice(-3);
    
    return { mandatorySubjects, optionalSubjects };
  }, []);

  // Render a subject group header
  const renderSectionHeader = useCallback((title) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  ), []);

  // Render a subject row
  const renderSubject = useCallback(({ item, index, isOptional = false }) => {
    const enabled = isOptional ? optionalSelected[item.name] : true;
    const gradeValue = grades[item.name] || '';
    const gradeColor = getGradeColor(gradeValue);
    const multiplier = subjectMultipliers[item.name] || item.multiplier;
    
    return (
      <View style={[
        styles.card, 
        isOptional && !enabled && styles.disabledCard
      ]}>
        {isOptional && (
          <View style={styles.optionalCheckboxContainer}>
            <Checkbox
              value={!!optionalSelected[item.name]}
              onValueChange={(value) => handleToggleOptional(item.name, value)}
            />
            <Text style={styles.optionalText}>اختياري</Text>
          </View>
        )}
        
        <View style={styles.rowContainer}>
          <Text style={[
            styles.subjectName, 
            isOptional && !enabled && styles.disabledText
          ]}>
            {item.name}
          </Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input, 
                isOptional && !enabled && styles.disabledInput,
                gradeValue && { color: gradeColor, fontWeight: 'bold' }
              ]}
              placeholder="الدرجة (0-20)"
              placeholderTextColor="#AAA"
              keyboardType="numeric"
              value={gradeValue}
              onChangeText={(value) => handleGradeInput(item.name, value)}
              editable={enabled}
              accessibilityLabel={`درجة ${item.name}`}
              maxLength={5}
            />
            {gradeValue && (
              <View style={[styles.gradeBadge, { backgroundColor: gradeColor }]}>
                <Text style={styles.gradeBadgeText}>
                  {Number(gradeValue) >= 10 ? '✓' : '✗'}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.multiplierContainer}>
            <Text style={styles.multiplierLabel}>المعامل</Text>
            <View style={styles.multiplierInputWrapper}>
              <TextInput
                style={[
                  styles.multiplierInput, 
                  isOptional && !enabled && styles.disabledInput
                ]}
                keyboardType="numeric"
                value={String(multiplier)}
                onChangeText={(value) => handleMultiplierInput(item.name, value)}
                accessibilityLabel={`معامل ${item.name}`}
                maxLength={2}
              />
              <Text style={styles.editHint}>تعديل</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }, [
    optionalSelected, 
    grades, 
    subjectMultipliers, 
    handleGradeInput, 
    handleMultiplierInput, 
    handleToggleOptional,
    getGradeColor
  ]);

  // Render mandatory subjects
  const renderMandatorySubjects = useCallback(() => (
    <>
      {renderSectionHeader('المواد الإجبارية')}
      {groupedSubjects.mandatorySubjects.map((subject, index) => (
        <View key={subject.name}>
          {renderSubject({ item: subject, index, isOptional: false })}
        </View>
      ))}
    </>
  ), [groupedSubjects.mandatorySubjects, renderSubject, renderSectionHeader]);

  // Render optional subjects
  const renderOptionalSubjects = useCallback(() => (
    <>
      {renderSectionHeader('المواد الاختيارية (اختر ما تريد)')}
      {groupedSubjects.optionalSubjects.map((subject, index) => (
        <View key={subject.name}>
          {renderSubject({ 
            item: subject, 
            index: groupedSubjects.mandatorySubjects.length + index, 
            isOptional: true 
          })}
        </View>
      ))}
    </>
  ), [groupedSubjects, renderSubject, renderSectionHeader]);

  // Render save modal
  const renderSaveModal = useCallback(() => (
    <Modal
      visible={saveModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCloseSaveModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>حفظ النتائج</Text>
          
          <TouchableOpacity 
            style={styles.modalOption}
            onPress={() => {
              handleCloseSaveModal();
              saveData();
            }}
          >
            <Text style={styles.modalOptionText}>حفظ البيانات الحالية</Text>
            <Text style={styles.modalOptionIcon}>💾</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.modalOption}
            onPress={() => {
              handleCloseSaveModal();
              handleSaveWithName();
            }}
          >
            <Text style={styles.modalOptionText}>حفظ كنتيجة جديدة</Text>
            <Text style={styles.modalOptionIcon}>➕</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.modalOption}
            onPress={() => {
              handleCloseSaveModal();
              shareResults();
            }}
          >
            <Text style={styles.modalOptionText}>مشاركة النتائج</Text>
            <Text style={styles.modalOptionIcon}>↗️</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.modalCloseButton}
            onPress={handleCloseSaveModal}
          >
            <Text style={styles.modalCloseText}>إغلاق</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  ), [
    saveModalVisible, 
    handleCloseSaveModal, 
    saveData, 
    handleSaveWithName, 
    shareResults
  ]);

  // Footer component with calculation results
  const renderFooter = useCallback(() => (
    <View style={styles.footerContainer}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.calculateButton} 
          onPress={handleCalculateBem}
          accessibilityLabel="حساب معدل البكالوريا"
        >
          <Text style={styles.calculateButtonText}>حساب المعدل</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleShowSaveModal}
          accessibilityLabel="حفظ البيانات"
        >
          <Text style={styles.saveButtonText}>حفظ</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.resetButton} 
          onPress={handleReset}
          accessibilityLabel="إعادة ضبط"
        >
          <Text style={styles.resetButtonText}>مسح</Text>
        </TouchableOpacity>
      </View>
      
      <View style={[
        styles.averageCard, 
        { backgroundColor: averageDetails.background }
      ]}>
        <View style={styles.averageHeader}>
          <Text style={styles.averageTitle}>معدل البكالوريا</Text>
          <Text style={styles.averageIcon}>{averageDetails.icon}</Text>
        </View>
        
        <Text style={[styles.averageValue, { color: averageDetails.color }]}>
          {bemAverage}
        </Text>
        
        <Text style={[styles.averageMessage, { color: averageDetails.color }]}>
          {averageDetails.message}
        </Text>
      </View>
    </View>
  ), [
    bemAverage, 
    handleCalculateBem, 
    handleReset, 
    averageDetails,
    handleShowSaveModal
  ]);

  // Loading overlay
  const renderLoading = useCallback(() => (
    isLoading && (
      <View style={styles.loadingOverlay}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7B1FA2" />
          <Text style={styles.loadingText}>جاري التحميل...</Text>
        </View>
      </View>
    )
  ), [isLoading]);

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>{bemStream.name}</Text>
        <Text style={styles.subtitle}>حاسبة معدل البكالوريا</Text>
        
        {renderMandatorySubjects()}
        {renderOptionalSubjects()}
        {renderFooter()}
      </ScrollView>
      
      {renderSaveModal()}
      {renderLoading()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7B1FA2',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#9C27B0',
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionHeader: {
    backgroundColor: 'rgba(123, 31, 162, 0.1)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#7B1FA2',
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7B1FA2',
    textAlign: 'right',
    paddingRight: 8,
  },
  card: {
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    minHeight: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledCard: {
    opacity: 0.5,
  },
  optionalCheckboxContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionalText: {
    fontSize: 12,
    marginRight: 4,
    color: '#7B1FA2',
    fontWeight: 'bold',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#7B1FA2',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkedCheckbox: {
    backgroundColor: '#7B1FA2',
  },
  disabledCheckbox: {
    borderColor: '#ccc',
  },
  checkboxMark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rowContainer: {
    flexDirection: 'row-reverse', // RTL layout
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  subjectName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
    color: '#333',
    paddingRight: 8,
  },
  disabledText: {
    color: '#999',
  },
  inputContainer: {
    position: 'relative',
    marginHorizontal: 8,
  },
  input: {
    width: 80,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
    paddingHorizontal: 8,
  },
  disabledInput: {
    backgroundColor: '#EEE',
    color: '#999',
    borderColor: '#DDD',
  },
  gradeBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  multiplierContainer: {
    alignItems: 'center',
  },
  multiplierLabel: {
    fontSize: 12,
    color: '#7B1FA2',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  multiplierInputWrapper: {
    position: 'relative',
  },
  multiplierInput: {
    width: 50,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#7B1FA2',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  editHint: {
    position: 'absolute',
    bottom: -16,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#9C27B0',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  calculateButton: {
    backgroundColor: '#7B1FA2',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerContainer: {
    marginTop: 24,
  },
  averageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#7B1FA2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  averageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7B1FA2',
    textAlign: 'center',
    marginBottom: 8,
  },
  averageValue: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  averageMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});