import { Link } from 'expo-router';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

export default function MiddleSchoolCalculator() {
  return (
    <View style={{ flex: 1, padding: 12, alignItems: 'center' }}>
    
      <Card style={styles.card}>
        <Link href="/middle/Module" asChild>
          <TouchableOpacity style={styles.button}>
            <CardHeader style={styles.cardHeader}>
              <Image
                style={styles.image}
                source={require('../../assets/images/about_img_1.png')}
              />
              <View style={styles.textContainer}>
                <CardTitle style={styles.text}>معدل المادة</CardTitle>
                <CardDescription style={styles.text}>
                 حساب المعدل المادة
                </CardDescription>
              </View>
            </CardHeader>
          </TouchableOpacity>
        </Link>


      </Card>
      <Card style={styles.card}>
        <Link href="/middle/Stream" asChild>
          <TouchableOpacity style={styles.button}>
            <CardHeader style={styles.cardHeader}>
              <Image
                style={styles.image}
                source={require('../../assets/images/about_img_1.png')}
              />
              <View style={styles.textContainer}>
                <CardTitle style={styles.text}>المعدل الفصلي</CardTitle>
                <CardDescription style={styles.text}>
                  حساب المعدل الفصلي
                </CardDescription>
              </View>
            </CardHeader>
          </TouchableOpacity>
        </Link>
      </Card>
      
      <Card style={styles.card}>
        <Link href="/middle/BemCalc" asChild>
          <TouchableOpacity style={styles.button}>
            <CardHeader style={styles.cardHeader}>
              <Image
                style={styles.image}
                source={require('../../assets/images/about_img_1.png')}
              />
              <View style={styles.textContainer}>
                <CardTitle style={styles.text}>معدل البيام</CardTitle>
                <CardDescription style={styles.text}>
                  حساب معدل البيام
                </CardDescription>
              </View>
            </CardHeader>
          </TouchableOpacity>
        </Link>
      </Card>
    </View>
  );
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
  image: {
    width: 60, 
    height: 60,
    borderRadius: 8,
    marginRight: 10, 
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
