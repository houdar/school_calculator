import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Switch, I18nManager, Alert, ScrollView, SafeAreaView } from 'react-native';

// Force RTL layout direction
I18nManager.forceRTL(true);

const Module = () => {
  const [continuousAssessment, setContinuousAssessment] = useState('');
  const [testMark1, setTestMark1] = useState('');
  const [testMark2, setTestMark2] = useState('');
  const [useSecondTest, setUseSecondTest] = useState(false);
  const [examMark, setExamMark] = useState('');
  const [finalResult, setFinalResult] = useState('00.00');
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const validateInput = (value, setter) => {
    // Allow empty values
    if (value === '') {
      setter('');
      return;
    }
    
    // Check if it's a valid number with up to one decimal point
    const regex = /^\d{1,2}(\.\d{0,1})?$/;
    if (regex.test(value)) {
      const numValue = parseFloat(value);
      if (numValue >= 0 && numValue <= 20) {
        setter(value);
      } else {
        Alert.alert('خطأ', 'يجب أن تكون العلامة بين 0 و 20');
      }
    } else {
      // Don't update the state if invalid
      Alert.alert('خطأ', 'يرجى إدخال قيمة صحيحة (مثال: 15 أو 15.5)');
    }
  };

  const calculateFinalResult = () => {
    const ca = parseFloat(continuousAssessment || '0');
    const tm1 = parseFloat(testMark1 || '0');
    const tm2 = useSecondTest ? parseFloat(testMark2 || '0') : 0;
    const em = parseFloat(examMark || '0');
    
    // Validate all required inputs are provided
    if (continuousAssessment === '' || testMark1 === '' || examMark === '' || 
        (useSecondTest && testMark2 === '')) {
      setError('يرجى ملء جميع العلامات المطلوبة');
      setModalVisible(true);
      return;
    }
    
    let result1;
    
    // Calculate based on whether there's a second test or not
    if (useSecondTest) {
      // If using two tests: (CA + Test1 + Test2) / 3
      result1 = (ca + tm1 + tm2) / 3;
    } else {
      // If using one test: (CA + Test1) / 2
      result1 = (ca + tm1) / 2;
    }
    
    // Exam is weighted double
    const result2 = em * 2;
    
    // Final calculation: (result1 + result2) / 3
    const final = (result1 + result2) / 3;
    setFinalResult(final.toFixed(2));
  };

  const resetResult = () => {
    setContinuousAssessment('');
    setTestMark1('');
    setTestMark2('');
    setExamMark('');
    setFinalResult('00.00');
  };

  const toggleSecondTest = () => {
    setUseSecondTest(!useSecondTest);
    if (!useSecondTest) {
      setTestMark2('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>حساب معدل المواد</Text>
        
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>التقويم المستمر (/20)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={continuousAssessment}
              onChangeText={(text) => validateInput(text, setContinuousAssessment)}
              placeholder="أدخل علامة من 0 إلى 20"
              textAlign="right"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>علامة الفرض 1 (/20)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={testMark1}
              onChangeText={(text) => validateInput(text, setTestMark1)}
              placeholder="أدخل علامة من 0 إلى 20"
              textAlign="right"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.rowBetween}>
              <Text style={styles.label}>علامة الفرض 2 (/20)</Text>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>{useSecondTest ? 'مفعل' : 'غير مفعل'}</Text>
                <Switch
                  value={useSecondTest}
                  onValueChange={toggleSecondTest}
                  trackColor={{ false: '#ccc', true: '#8e44ad' }}
                  thumbColor={useSecondTest ? '#660094' : '#f4f3f4'}
                />
              </View>
            </View>
            <TextInput
              style={[
                styles.input, 
                { opacity: useSecondTest ? 1 : 0.5 }
              ]}
              keyboardType="numeric"
              value={testMark2}
              onChangeText={(text) => useSecondTest && validateInput(text, setTestMark2)}
              editable={useSecondTest}
              placeholder={useSecondTest ? "أدخل علامة من 0 إلى 20" : "غير مفعل"}
              textAlign="right"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>علامة الاختبار (/20)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={examMark}
              onChangeText={(text) => validateInput(text, setExamMark)}
              placeholder="أدخل علامة من 0 إلى 20"
              textAlign="right"
            />
          </View>

          <TouchableOpacity style={styles.calculateButton} onPress={calculateFinalResult}>
            <Text style={styles.buttonText}>حساب المعدل</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>المعدل النهائي</Text>
          </View>
          <View style={styles.resultBody}>
            <Text style={styles.resultValue}>{finalResult}</Text>
            <Text style={styles.resultFormula}>
              {useSecondTest 
                ? "(تقويم مستمر + فرض1 + فرض2) ÷ 3 + (اختبار×2) ÷ 3"
                : "(تقويم مستمر + فرض1) ÷ 2 + (اختبار×2) ÷ 3"}
            </Text>
          </View>
          <TouchableOpacity style={styles.resetButton} onPress={resetResult}>
            <Text style={styles.resetButtonText}>مسح جميع القيم</Text>
          </TouchableOpacity>
        </View>
        
        {/* Add some padding at the bottom for better scrolling experience */}
        <View style={styles.bottomPadding}></View>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>تنبيه</Text>
            <Text style={styles.modalText}>{error}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>حسنا</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#660094',
    textAlign: 'center',
    marginVertical: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
    textAlign: 'right',
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    marginRight: 8,
    fontSize: 14,
    color: '#666',
  },
  calculateButton: {
    backgroundColor: '#660094',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  resultHeader: {
    backgroundColor: '#660094',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  resultBody: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  resultValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#660094',
    marginBottom: 8,
  },
  resultFormula: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: '#F3F3F3',
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  resetButtonText: {
    color: '#E53935',
    fontWeight: '600',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#660094',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  modalButton: {
    backgroundColor: '#660094',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  modalButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bottomPadding: {
    height: 20, // Extra padding at the bottom
  }
};

export default Module;