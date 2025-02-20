import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
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

  // Update grade for a subject
  const handleGradeChange = (subjectName, value) => {
    setGrades(prev => ({ ...prev, [subjectName]: value }));
  };

  // Toggle whether an optional subject is counted
  const handleToggleOptional = (subjectName, value) => {
    setOptionalSelected(prev => ({ ...prev, [subjectName]: value }));
    if (!value) {
      // When unchecked, clear its grade.
      setGrades(prev => ({ ...prev, [subjectName]: '' }));
    }
  };

  const subjects = bemStream.subjects;
  
  // Render each subject row. Last three are optional.
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
            onChangeText={(value) => handleGradeChange(item.name, value)}
            editable={enabled}
          />
          <Text style={styles.multiplier}>x{item.multiplier}</Text>
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
    </View>
  );
}

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
});
