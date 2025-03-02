import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

import { firstStream, secondStream, thirdStream, fourthStream } from '../middle/data/middleData'

const streamData = {
  1: firstStream,
  2: secondStream,
  3: thirdStream,
  4: fourthStream,
};

const StreamCalc = () => {
  const { id } = useLocalSearchParams();
  const stream = streamData[id] || firstStream; // Default to firstStream if no match

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{stream.name}</Text>

      {stream.subjects.map((subject, index) => (
        <Card key={index} style={styles.card}>
          <CardHeader>
            <CardTitle style={styles.subjectName}>{subject.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.marksContainer}>
              <View style={styles.markRow}>
                <Text style={styles.markLabel}>التقويم المستمر:</Text>
                <Text style={styles.markValue}>{subject.assessment || '--'}</Text>
              </View>
              <View style={styles.markRow}>
                <Text style={styles.markLabel}>الفرض:</Text>
                <Text style={styles.markValue}>{subject.test || '--'}</Text>
              </View>
              <View style={styles.markRow}>
                <Text style={styles.markLabel}>الاختبار:</Text>
                <Text style={styles.markValue}>{subject.exam || '--'}</Text>
              </View>
            </View>
          </CardContent>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    marginBottom: 12,
    padding: 10,
  },
  subjectName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  marksContainer: {
    marginTop: 8,
  },
  markRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  markLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  markValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StreamCalc;



