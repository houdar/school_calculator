import { Link } from 'expo-router';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { firstStream, secondStream, thirdStream, fourthStream } from '../middle/data/middleData'

const streams = [
  { ...firstStream, id: 1 },
  { ...secondStream, id: 2 },
  { ...thirdStream, id: 3 },
  { ...fourthStream, id: 4 },
];

const Stream = () => {
  return (
    <View style={{ flex: 1, padding: 12, alignItems: 'center' }}>
      {streams.map((stream) => (
        <Card key={stream.id} style={styles.card}>
          <Link href={{ pathname: '/middle/StreamCalc', params: { id: stream.id } }} asChild>
            <TouchableOpacity style={styles.button}>
              <CardHeader style={styles.cardHeader}>
                <View style={styles.textContainer}>
                  <CardTitle style={styles.text}>{stream.name}</CardTitle>
                  <CardDescription style={styles.text}>
                    حساب معدل {stream.name}
                  </CardDescription>
                </View>
              </CardHeader>
            </TouchableOpacity>
          </Link>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
    marginTop: 16,
    width: '100%',
    padding: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  text: {
    textAlign: 'right',
  },
  button: {
    width: '100%',
  },
});

export default Stream;
