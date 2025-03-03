import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { firstStream, secondStream, thirdStream, fourthStream } from "./data/middleData";
import { MaterialIcons } from '@expo/vector-icons';

const streamData = {
  1: firstStream,
  2: secondStream,
  3: thirdStream,
  4: fourthStream,
};

export default function StreamCalculation() {
  const { id } = useLocalSearchParams();
  const selectedStream = streamData[id] || firstStream;
  
  const [mandatorySubjects, setMandatorySubjects] = useState([]);
  const [optionalSubjects, setOptionalSubjects] = useState([]);
  const [selectedOptionals, setSelectedOptionals] = useState({});
  const [finalGrade, setFinalGrade] = useState(0);
  const [gradeMessage, setGradeMessage] = useState("");

  // Initialize subjects with proper test configuration
  useEffect(() => {
    // Get special subjects for the selected stream
    const specialSubjectNames = selectedStream.specialSubjects.map(subject => subject.name);
    
    // Process all subjects
    const mandatory = [];
    const optional = [];
    
    selectedStream.subjects.forEach(subject => {
      // Determine if this is a special subject (needs two tests by default)
      const isSpecial = specialSubjectNames.includes(subject.name);
      
      // Create a copy with hasTwoTests property set appropriately
      const subjectCopy = {
        ...subject,
        optional: subject.isConsernabl,
        hasTwoTests: isSpecial, // This will control if second test is enabled
        // Initialize test scores
        test1: '',
        test2: '',
        assessment: '',
        exam: ''
      };
      
      if (subject.isConsernabl) {
        optional.push(subjectCopy);
      } else {
        mandatory.push(subjectCopy);
      }
    });
    
    setMandatorySubjects(mandatory);
    setOptionalSubjects(optional);
  }, [id]);

  const handleScoreChange = (index, field, value, subjectType) => {
    if (subjectType === 'mandatory') {
      const newSubjects = [...mandatorySubjects];
      newSubjects[index][field] = value ? parseFloat(value) : '';
      setMandatorySubjects(newSubjects);
    } else {
      const newSubjects = [...optionalSubjects];
      newSubjects[index][field] = value ? parseFloat(value) : '';
      setOptionalSubjects(newSubjects);
    }
  };

  const toggleOptionalSelection = (index) => {
    setSelectedOptionals(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Toggle if subject has two tests
  const toggleSecondTest = (index, subjectType) => {
    if (subjectType === 'mandatory') {
      const newSubjects = [...mandatorySubjects];
      newSubjects[index].hasTwoTests = !newSubjects[index].hasTwoTests;
      // Clear the second test value if disabling
      if (!newSubjects[index].hasTwoTests) {
        newSubjects[index].test2 = '';
      }
      setMandatorySubjects(newSubjects);
    } else {
      const newSubjects = [...optionalSubjects];
      newSubjects[index].hasTwoTests = !newSubjects[index].hasTwoTests;
      // Clear the second test value if disabling
      if (!newSubjects[index].hasTwoTests) {
        newSubjects[index].test2 = '';
      }
      setOptionalSubjects(newSubjects);
    }
  };

  const getScoreColor = (score) => {
    if (!score && score !== 0) return "#000";
    if (score >= 15) return "#4CAF50"; // Green
    if (score >= 10) return "#FFC107";  // Yellow
    return "#F44336";                  // Red
  };

  const getStatusIcon = (score) => {
    if (!score && score !== 0) return null;
    if (score >= 10) {
      return <MaterialIcons name="check-circle" size={20} color="#4CAF50" style={styles.statusIcon} />;
    } else {
      return <MaterialIcons name="cancel" size={20} color="#F44336" style={styles.statusIcon} />;
    }
  };

  const resetForm = () => {
    // Reset with proper default test configuration
    const specialSubjectNames = selectedStream.specialSubjects.map(subject => subject.name);
    
    const resetMandatory = mandatorySubjects.map(subject => {
      const isSpecial = specialSubjectNames.includes(subject.name);
      return {
        ...subject,
        hasTwoTests: isSpecial,
        test1: '',
        test2: '',
        assessment: '',
        exam: ''
      };
    });
    
    const resetOptional = optionalSubjects.map(subject => {
      const isSpecial = specialSubjectNames.includes(subject.name);
      return {
        ...subject,
        hasTwoTests: isSpecial,
        test1: '',
        test2: '',
        assessment: '',
        exam: ''
      };
    });
    
    setMandatorySubjects(resetMandatory);
    setOptionalSubjects(resetOptional);
    setSelectedOptionals({});
    setFinalGrade(0);
    setGradeMessage("");
  };

  // Calculate the final grade - Updated to match the image formula
  const calculateGrade = () => {
    let totalPoints = 0;
    let totalMultipliers = 0;
    
    // Process mandatory subjects
    mandatorySubjects.forEach(subject => {
      const multiplier = subject.multiplier || 0;
      let continuousAssessment = 0;
      
      // Calculate continuous assessment based on whether it has two tests
      if (subject.hasTwoTests) {
        // For subjects with two tests: (assessment + test1 + test2) / 3
        const assessment = subject.assessment || 0;
        const test1 = subject.test1 || 0;
        const test2 = subject.test2 || 0;
        continuousAssessment = (assessment + test1 + test2) / 3;
      } else {
        // For subjects with one test: (assessment + test1) / 2
        const assessment = subject.assessment || 0;
        const test1 = subject.test1 || 0;
        continuousAssessment = (assessment + test1) / 2;
      }
      
      // Calculate subject average: (continuous assessment + (exam × 2)) / 3
      const exam = subject.exam || 0;
      const subjectAverage = (continuousAssessment + (exam * 2)) / 3;
      
      // Add to totals
      totalPoints += subjectAverage * multiplier;
      totalMultipliers += multiplier;
    });
    
    // Process selected optional subjects
    optionalSubjects.forEach((subject, index) => {
      if (selectedOptionals[index]) {
        const multiplier = subject.multiplier || 0;
        let continuousAssessment = 0;
        
        // Calculate continuous assessment based on whether it has two tests
        if (subject.hasTwoTests) {
          // For subjects with two tests: (assessment + test1 + test2) / 3
          const assessment = subject.assessment || 0;
          const test1 = subject.test1 || 0;
          const test2 = subject.test2 || 0;
          continuousAssessment = (assessment + test1 + test2) / 3;
        } else {
          // For subjects with one test: (assessment + test1) / 2
          const assessment = subject.assessment || 0;
          const test1 = subject.test1 || 0;
          continuousAssessment = (assessment + test1) / 2;
        }
        
        // Calculate subject average: (continuous assessment + (exam × 2)) / 3
        const exam = subject.exam || 0;
        const subjectAverage = (continuousAssessment + (exam * 2)) / 3;
        
        // Add to totals
        totalPoints += subjectAverage * multiplier;
        totalMultipliers += multiplier;
      }
    });
    
    // Calculate and set final grade
    const calculatedGrade = totalMultipliers > 0 ? (totalPoints / totalMultipliers).toFixed(2) : 0;
    setFinalGrade(calculatedGrade);
    
    // Set grade message
    if (calculatedGrade >= 15) {
      setGradeMessage("ممتاز! أحسنت");
    } else if (calculatedGrade >= 12) {
      setGradeMessage("جيد جدا");
    } else if (calculatedGrade >= 10) {
      setGradeMessage("ناجح");
    } else {
      setGradeMessage("تحتاج إلى تحسين");
    }
  };

  // Render a subject card with checkbox for the second test
  const renderSubjectCard = (subject, index, subjectType) => {
    const isOptional = subjectType === 'optional';
    const isSelected = isOptional ? selectedOptionals[index] : true;
    
    return (
      <View key={index} style={styles.subjectCard}>
        <View style={styles.subjectHeader}>
          {isOptional && (
            <TouchableOpacity 
              style={[styles.checkbox, isSelected && styles.checkboxChecked]}
              onPress={() => toggleOptionalSelection(index)}
            >
              {isSelected && <MaterialIcons name="check" size={18} color="white" />}
            </TouchableOpacity>
          )}
          <Text style={styles.subjectName}>{subject.name}</Text>
        </View>
        
        <View style={styles.subjectDetails}>
          {/* Multiplier */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>المعامل</Text>
            <TextInput
              style={styles.multiplierInput}
              keyboardType="numeric"
              value={subject.multiplier?.toString() || ''}
              onChangeText={(value) => handleScoreChange(index, 'multiplier', value, subjectType)}
              editable={isSelected}
            />
          </View>
          
           {/* Continuous Assessment */}
           <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>التقويم المستمر</Text>
            <TextInput
              style={[styles.scoreInput, { borderColor: getScoreColor(subject.assessment) }]}
              keyboardType="numeric"
              value={subject.assessment?.toString() || ''}
              onChangeText={(value) => handleScoreChange(index, 'assessment', value, subjectType)}
              editable={isSelected}
            />
            {isSelected && getStatusIcon(subject.assessment)}
          </View>
          
          {/* Second Test with checkbox */}
          <View style={styles.inputGroup}>
            <View style={styles.secondTestLabelContainer}>
              <TouchableOpacity 
                style={[styles.smallCheckbox, subject.hasTwoTests && styles.smallCheckboxChecked]}
                onPress={() => isSelected && toggleSecondTest(index, subjectType)}
                disabled={!isSelected}
              >
                {subject.hasTwoTests && <MaterialIcons name="check" size={12} color="white" />}
              </TouchableOpacity>
              <Text style={[
                styles.inputLabel,
                !subject.hasTwoTests && styles.disabledLabel
              ]}>
                الفرض الثاني
              </Text>
            </View>
            <TextInput
              style={[
                styles.scoreInput, 
                { borderColor: getScoreColor(subject.test2) },
                !subject.hasTwoTests && styles.disabledInput
              ]}
              keyboardType="numeric"
              value={subject.test2?.toString() || ''}
              onChangeText={(value) => handleScoreChange(index, 'test2', value, subjectType)}
              editable={isSelected && subject.hasTwoTests}
            />
            {isSelected && subject.hasTwoTests && getStatusIcon(subject.test2)}
          </View>

           {/* First Test */}
           <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>الفرض الأول</Text>
            <TextInput
              style={[styles.scoreInput, { borderColor: getScoreColor(subject.test1) }]}
              keyboardType="numeric"
              value={subject.test1?.toString() || ''}
              onChangeText={(value) => handleScoreChange(index, 'test1', value, subjectType)}
              editable={isSelected}
            />
            {isSelected && getStatusIcon(subject.test1)}
          </View>
        
          
          {/* Exam */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>الاختبار</Text>
            <TextInput
              style={[styles.scoreInput, { borderColor: getScoreColor(subject.exam) }]}
              keyboardType="numeric"
              value={subject.exam?.toString() || ''}
              onChangeText={(value) => handleScoreChange(index, 'exam', value, subjectType)}
              editable={isSelected}
            />
            {isSelected && getStatusIcon(subject.exam)}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>حساب معدل {selectedStream.name}</Text>
     
      {/* Mandatory Subjects Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>المواد الإجبارية</Text>
        {mandatorySubjects.map((subject, index) => 
          renderSubjectCard(subject, index, 'mandatory')
        )}
      </View>
      
      {/* Optional Subjects Section */}
      {optionalSubjects.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>المواد الاختيارية</Text>
          {optionalSubjects.map((subject, index) => 
            renderSubjectCard(subject, index, 'optional')
          )}
        </View>
      )}
      
      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.calculateButton} onPress={calculateGrade}>
          <Text style={styles.buttonText}>حساب المعدل</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.saveButton} onPress={() => console.log("Saved!")}>
          <Text style={styles.buttonText}>حفظ</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
          <Text style={styles.resetText}>مسح</Text>
        </TouchableOpacity>
      </View>
      
      {/* Final Grade Display */}
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>المعدل الفصلي </Text>
        <Text style={styles.finalGrade}>{finalGrade}</Text>
        <Text style={styles.gradeMessage}>{gradeMessage}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#6A1B9A',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#6A1B9A',
  },
  sectionContainer: {
    marginBottom: 20,
    backgroundColor: '#F3E5F5',
    borderRadius: 10,
    paddingVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#6A1B9A',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    marginRight: 16,
    marginBottom: 10,
    color: '#6A1B9A',
  },
  subjectCard: {
    backgroundColor: 'white',
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 8,
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  subjectDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  inputGroup: {
    width: '48%',
    marginVertical: 6,
  },
  secondTestLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  smallCheckbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#6A1B9A',
    marginLeft: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallCheckboxChecked: {
    backgroundColor: '#6A1B9A',
  },
  inputLabel: {
    fontSize: 12,
    textAlign: 'right',
    color: '#757575',
  },
  disabledLabel: {
    color: '#BBBBBB',
  },
  scoreInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  disabledInput: {
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
    color: '#BBBBBB',
  },
  multiplierInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    textAlign: 'center',
    borderColor: '#BBBBBB',
    fontWeight: 'bold',
  },
  statusIcon: {
    position: 'absolute',
    right: -10,
    top: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#6A1B9A',
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#6A1B9A',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  calculateButton: {
    flex: 3,
    backgroundColor: '#6A1B9A',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButton: {
    marginLeft: 8,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetText: {
    color: '#757575',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    borderWidth: 2,
    borderColor: '#6A1B9A',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginBottom: 30,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6A1B9A',
    marginBottom: 10,
  },
  finalGrade: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginVertical: 10,
  },
  gradeMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  }
});