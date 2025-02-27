import { Link } from 'expo-router';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

const Stream = () => {
  return (
    <View style={{ flex: 1, padding: 12, alignItems: 'center' }}>

            <Card style={styles.card}>
              <Link href="/middle/FirstStream" asChild>
                <TouchableOpacity style={styles.button}>
                  <CardHeader style={styles.cardHeader}>
                    <View style={styles.textContainer}>
                      <CardTitle style={styles.text}>الفصل الأول</CardTitle>
                      <CardDescription style={styles.text}>
                           حساب معدل الفصل الاول
                      </CardDescription>
                    </View>
                  </CardHeader>
                </TouchableOpacity>
              </Link>
            </Card>

            <Card style={styles.card}>
              <Link href="/middle/SecondStream" asChild>
                <TouchableOpacity style={styles.button}>
                  <CardHeader style={styles.cardHeader}>
                    <View style={styles.textContainer}>
                      <CardTitle style={styles.text}>الفصل الثاني</CardTitle>
                      <CardDescription style={styles.text}>
                         حساب معدل الفصل الثاني
                      </CardDescription>
                    </View>
                  </CardHeader>
                </TouchableOpacity>
              </Link>
            </Card>

            <Card style={styles.card}>
              <Link href="/middle/ThirdStream" asChild>
                <TouchableOpacity style={styles.button}>
                  <CardHeader style={styles.cardHeader}>
                    <View style={styles.textContainer}>
                      <CardTitle style={styles.text}>الفصل الثالث</CardTitle>
                      <CardDescription style={styles.text}>
                       حساب معدل الفصل الثالث 
                      </CardDescription>
                    </View>
                  </CardHeader>
                </TouchableOpacity>
              </Link>
            </Card>
    </View>
  )
}

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


export default Stream