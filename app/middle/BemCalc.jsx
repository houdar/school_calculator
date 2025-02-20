import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
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

  // Update the grade in state
  const handleGradeChange = (subjectName, value) => {
    setGrades((prev) => ({ ...prev, [subjectName]: value }));
  };

  // Validate input and update or reset if invalid
  const handleGradeInput = (subjectName, inputValue) => {
    // Allow clearing the input
    if (inputValue === '') {
      handleGradeChange(subjectName, '');
      return;
    }

    // Convert to number
    const numericValue = Number(inputValue);

    // Check if not a number or out of range
    if (isNaN(numericValue) || numericValue < 0 || numericValue > 20) {
      Alert.alert('خطأ', 'الرجاء إدخال قيمة بين 0 و 20');
      // Reset the input
      handleGradeChange(subjectName, '');
    } else {
      // Valid input
      handleGradeChange(subjectName, inputValue);
    }
  };

  // Toggle whether an optional subject is counted
  const handleToggleOptional = (subjectName, value) => {
    setOptionalSelected((prev) => ({ ...prev, [subjectName]: value }));
    if (!value) {
      // When unchecked, clear its grade.
      setGrades((prev) => ({ ...prev, [subjectName]: '' }));
    }
  };

  // Calculate the BEM final mark
  const handleCalculateBem = () => {
    let totalSum = 0;
    let totalMultiplier = 0;

    // Loop through all subjects
    bemStream.subjects.forEach((subject, index) => {
      // Check if subject is optional
      const isOptional = index >= bemStream.subjects.length - 3;
      // If optional, must be selected to count
      const enabled = isOptional ? optionalSelected[subject.name] : true;

      if (enabled) {
        // Parse grade from state, default to 0 if empty
        const gradeValue = Number(grades[subject.name]) || 0;
        totalSum += gradeValue * subject.multiplier;
        totalMultiplier += subject.multiplier;
      }
    });

    // Avoid division by zero
    if (totalMultiplier === 0) {
      setBemAverage('0.00');
      return;
    }

    const average = totalSum / totalMultiplier;
    // Format to two decimals
    setBemAverage(average.toFixed(2));
  };

  const subjects = bemStream.subjects;

  // Renders each subject row (last three optional)
  const renderSubject = ({ item, index }) => {
    const isOptional = index >= subjects.length - 3;
    const enabled = isOptional ? optionalSelected[item.name] : true;

    return (
      <View style={[styles.card, isOptional && !enabled && styles.disabledCard]}>
        {/* Optional checkbox in top right for optional modules */}
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
          <Text style={styles.multiplier}>x{item.multiplier}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Screen Title */}
      <Text style={styles.title}>{bemStream.name}</Text>

      {/* List of Subjects */}
      <FlatList
        data={subjects}
        keyExtractor={(subject) => subject.name}
        renderItem={renderSubject}
        contentContainerStyle={styles.listContainer}
      />

      {/* Footer: Display & Calculate */}
      <View style={styles.footerContainer}>
        {/* Display the final BEM average */}
        <View style={styles.averageCard}>
          <Text style={styles.averageTitle}>معدل البكالوريا</Text>
          <Text style={styles.averageValue}>{bemAverage}</Text>
        </View>

        {/* Button to trigger calculation */}
        <TouchableOpacity style={styles.calculateButton} onPress={handleCalculateBem}>
          <Text style={styles.calculateButtonText}>حساب معدل البكالوريا</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
});
