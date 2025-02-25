import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet, 
  TouchableOpacity,
  Alert,
} from 'react-native';
import { bemStream } from './data/bemStreams'; // Adjust path as needed

// A simple Checkbox component implemented with TouchableOpacity
const Checkbox = ({ value, onValueChange }) => (
  <TouchableOpacity onPress={() => onValueChange(!value)} style={styles.checkbox}>
    {value && <Text style={styles.checkboxMark}>✓</Text>}
  </TouchableOpacity>
);

export default function BemCalcScreen() {
  const [grades, setGrades] = useState({});
  const [optionalSelected, setOptionalSelected] = useState({});
  const [bemAverage, setBemAverage] = useState('0.00');
  const [subjectMultipliers, setSubjectMultipliers] = useState(
    Object.fromEntries(bemStream.subjects.map((subject) => [subject.name, subject.multiplier]))
  );

  // Update the grade in state
  const handleGradeChange = (subjectName, value) => {
    setGrades((prev) => ({ ...prev, [subjectName]: value }));
  };

  // Validate and update grade input
  const handleGradeInput = (subjectName, inputValue) => {
    if (inputValue === '') {
      handleGradeChange(subjectName, '');
      return;
    }

    const numericValue = Number(inputValue);
    if (isNaN(numericValue) || numericValue < 0 || numericValue > 20) {
      Alert.alert('خطأ', 'الرجاء إدخال قيمة بين 0 و 20');
      handleGradeChange(subjectName, '');
    } else {
      handleGradeChange(subjectName, inputValue);
    }
  };

  // Validate and update multiplier input
  const handleMultiplierInput = (subjectName, inputValue) => {
    if (inputValue === '') {
      setSubjectMultipliers((prev) => ({ ...prev, [subjectName]: '' }));
      return;
    }

    const numericValue = Number(inputValue);
    if (isNaN(numericValue) || numericValue <= 0) {
      Alert.alert('خطأ', 'الرجاء إدخال معامل صحيح أكبر من 0');
      setSubjectMultipliers((prev) => ({
        ...prev,
        [subjectName]:
          bemStream.subjects.find((s) => s.name === subjectName)?.multiplier || 1,
      }));
    } else {
      setSubjectMultipliers((prev) => ({ ...prev, [subjectName]: numericValue }));
    }
  };

  // Toggle whether an optional subject is counted
  const handleToggleOptional = (subjectName, value) => {
    setOptionalSelected((prev) => ({ ...prev, [subjectName]: value }));
    if (!value) {
      setGrades((prev) => ({ ...prev, [subjectName]: '' }));
    }
  };

  // Calculate the BEM final mark
  const handleCalculateBem = () => {
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
      setBemAverage('0.00');
      return;
    }

    const average = totalSum / totalMultiplier;
    setBemAverage(average.toFixed(2));
  };

  const subjects = bemStream.subjects;

  // Render each subject row
  const renderSubject = ({ item, index }) => {
    const isOptional = index >= subjects.length - 3;
    const enabled = isOptional ? optionalSelected[item.name] : true;

    return (
      <View style={[styles.card, isOptional && !enabled && styles.disabledCard]}>
        {isOptional && (
          <View style={styles.optionalCheckboxContainer}>
            <Checkbox
              value={enabled}
              onValueChange={(value) => handleToggleOptional(item.name, value)}
            />
          </View>
        )}
        <View style={styles.rowContainer}>
          <Text style={[styles.subjectName, isOptional && !enabled && styles.disabledText]}>
            {item.name}
          </Text>
          <TextInput
            style={[styles.input, isOptional && !enabled && styles.disabledInput]}
            placeholder="0/20"
            placeholderTextColor="#AAA"
            keyboardType="numeric"
            value={grades[item.name] || ''}
            onChangeText={(value) => handleGradeInput(item.name, value)}
            editable={enabled}
          />
          <TextInput
            style={[styles.multiplierInput, isOptional && !enabled && styles.disabledInput]}
            placeholder="معامل"
            placeholderTextColor="#AAA"
            keyboardType="numeric"
            value={String(subjectMultipliers[item.name] || '')}
            onChangeText={(value) => handleMultiplierInput(item.name, value)}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{bemStream.name}</Text>
      <FlatList
        data={subjects}
        keyExtractor={(subject) => subject.name}
        renderItem={renderSubject}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.calculateButton} onPress={handleCalculateBem}>
          <Text style={styles.calculateButtonText}>حساب معدل البكالوريا</Text>
        </TouchableOpacity>
        <View style={styles.averageCard}>
          <Text style={styles.averageTitle}>معدل البكالوريا</Text>
          <Text style={styles.averageValue}>{bemAverage}</Text>
        </View>
      </View>
    </View>
  );
}

// -----------------------------------
// STYLES
// -----------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1E4F3', // Light purple background
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7B1FA2', // Dark purple
    marginBottom: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    minHeight: 80,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 2,
  },
  disabledCard: {
    opacity: 0.5, // Dim card when module is not counted
  },
  optionalCheckboxContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#7B1FA2',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxMark: {
    color: '#7B1FA2',
    fontSize: 12,
    lineHeight: 16,
  },
  rowContainer: {
    flexDirection: 'row-reverse', // RTL: subject name → input → multiplier
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subjectName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
    color: '#333',
  },
  disabledText: {
    color: '#999',
  },
  input: {
    width: 60,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff', // White input background
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    marginRight: 12,
  },
  disabledInput: {
    backgroundColor: '#EEE',
    color: '#999',
  },
  multiplier: {
    backgroundColor: '#7B1FA2', // Dark purple
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    textAlign: 'center',
  },
  // FOOTER
  footerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  averageCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 2,
  },
  averageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7B1FA2',
    textAlign: 'center',
    marginBottom: 8,
  },
  averageValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  calculateButton: {
    flexDirection: 'row-reverse', // If you want RTL icon + text
    backgroundColor: '#7B1FA2',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    margin:16 ,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
});
