import React from "react";
import { View, Text, StyleSheet } from "react-native";

function Login({ navigation }) {
  return (
    // Title
    <View style={styles.container}>
        <Text style={{fontWeight: 'bold', fontSize: 64, color: '#FFFFFF',}}>MATE</Text> 
      </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});