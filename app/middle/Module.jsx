import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';

const Module = () => {
  const [continuousAssessment, setContinuousAssessment] = useState('');
  const [testMark, setTestMark] = useState('');
  const [examMark, setExamMark] = useState('');
  const [finalResult, setFinalResult] = useState('00.00');
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const calculateFinalResult = () => {
    const ca = parseFloat(continuousAssessment);
    const tm = parseFloat(testMark);
    const em = parseFloat(examMark);
    
    if (isNaN(ca) || isNaN(tm) || isNaN(em) || ca < 0 || ca > 20 || tm < 0 || tm > 20 || em < 0 || em > 20) {
      setError('يرجى ملأ كل العلامات ');
      setModalVisible(true);
      return;
    }
    
    const result1 = (ca + tm) / 2;
    const result2 = em * 2;
    const final = (result1 + result2) / 3;
    setFinalResult(final.toFixed(2));
  };

  const resetResult = () => {
    setFinalResult('00.00');
  };

  return (
    <View style={{ padding: 20, backgroundColor: '#F5F5F5', flex: 1 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#660094', textAlign: 'center' }}>حساب معدل المواد</Text>
      
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>التقويم المستمر (/20)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={continuousAssessment}
          onChangeText={setContinuousAssessment}
        />

        <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 10 }}>علامة الفرض (/20)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={testMark}
          onChangeText={setTestMark}
        />

        <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 10 }}> علامة الاختبار(/20)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={examMark}
          onChangeText={setExamMark}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={calculateFinalResult}>
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>

      <View style={styles.resultContainer}>
        
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#660094' }}>{finalResult}</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={resetResult}>
          <Text style={styles.buttonText}>مسح</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'red' }}>خطأ</Text>
            <Text style={{ fontSize: 16, textAlign: 'center', marginVertical: 10 }}>{error}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>حسنا</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = {
  input: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#660094',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  resultContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(72, 72, 78, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
};

export default Module;