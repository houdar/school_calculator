import { View, Text, TextInput, Alert, StyleSheet } from "react-native";
import { useState, useEffect } from "react";

export default function Year() {
  const [stream1, setStream1] = useState("");
  const [stream2, setStream2] = useState("");
  const [stream3, setStream3] = useState("");
  const [average, setAverage] = useState(0);
  const [lastCalculated, setLastCalculated] = useState(false);

  // Handle input validation (0-20)
  const handleInputChange = (value, setter) => {
    if (value === "") {
      setter("");
      return;
    }

    const num = parseFloat(value);
    if (isNaN(num)) {
      Alert.alert("Invalid Input", "Please enter a valid number.");
      setter(""); // Clear input
      return;
    }

    // If value is outside range, set to valid range and show alert
    if (num < 0 || num > 20) {
      Alert.alert("خطأ", "الرجاء ادخال قيمة بين 0 و 20 ");
      
      // Set to boundary value instead of clearing
      if (num < 0) setter("0");
      else if (num > 20) setter("20");
      return;
    }

    setter(value);
  };

  // Calculate average
  useEffect(() => {
    const num1 = parseFloat(stream1) || 0;
    const num2 = parseFloat(stream2) || 0;
    const num3 = parseFloat(stream3) || 0;
    
    // Only calculate if at least one input has been entered
    if (stream1 !== "" || stream2 !== "" || stream3 !== "") {
      const avg = (num1 + num2 + num3) / 3;
      setAverage(avg);
      
      // Only show result alert if this is a new calculation with all fields filled
      if (!lastCalculated && (stream1 !== "" && stream2 !== "" && stream3 !== "")) {
        setLastCalculated(true);
        
        // Show appropriate message based on average
        let message = "";
       
     
      }
    } else {
      setAverage(0);
      setLastCalculated(false);
    }
  }, [stream1, stream2, stream3]);

  // Determine result style based on average
  const getResultStyle = () => {
    if (average < 10) return { borderColor: "red", message: "حاول أكثر 💔" };
    if (average < 15) return { borderColor: "orange", message: "جيد👍" };
    return { borderColor: "green", message: "ممتاز🎉" };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>حساب المعدل السنوي</Text>

      <TextInput
        style={styles.input}
        placeholder="معدل الفصل الاول"
        keyboardType="numeric"
        value={stream1}
        onChangeText={(text) => handleInputChange(text, setStream1)}
      />
      <TextInput
        style={styles.input}
        placeholder="معدل الفصل الثاني"
        keyboardType="numeric"
        value={stream2}
        onChangeText={(text) => handleInputChange(text, setStream2)}
      />
      <TextInput
        style={styles.input}
        placeholder="معدل الفصل الثالث "
        keyboardType="numeric"
        value={stream3}
        onChangeText={(text) => handleInputChange(text, setStream3)}
      />

      <View style={[styles.resultBox, { borderColor: getResultStyle().borderColor }]}>
        <Text style={styles.resultText}>النتيجة: {average.toFixed(2)}</Text>
        {average > 0 && (
          <Text style={[styles.messageText, { color: getResultStyle().borderColor }]}>
            {getResultStyle().message}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#660094",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    height: 50,
    borderWidth: 1,
    borderColor: "#660094",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  resultBox: {
    marginTop: 20,
    width: "90%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 2,
    alignItems: "center",
    shadowColor: "#660094",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#660094",
  },
  messageText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
});