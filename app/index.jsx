import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { BookOpenIcon, GraduationCapIcon } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <View style={[styles.container]}>
      {/* Title */}
      <Text style={[styles.title]}>
        welcome toti 
      </Text>

      {/* Buttons */}
      <Link href="/middle" asChild>
        <TouchableOpacity style={styles.button}>
          <BookOpenIcon size={24} color="#660094" />
          <Text style={styles.buttonText}>حساب معدل المتوسط</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/high" asChild>
        <TouchableOpacity style={styles.button}>
          <GraduationCapIcon size={24} color="#660094" />
          <Text style={styles.buttonText}>حساب معدل الثانوي</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color:'#660094'
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 20,
    width: 250,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#660094',
  },
});
