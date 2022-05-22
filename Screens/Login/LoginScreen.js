import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Input, Button } from 'react-native-elements';
import { db } from '../../Database/DatabaseConfig/firebase';
import { doc, getDoc, getDocFromCache } from 'firebase/firestore';
import { UserInfo } from '../../Database/Data/User/userInfo';


const LoginScreen = ({navigation}) => {
    const [ studentNumber, SetStudentNumber ] = useState(''); 
    const [ studentName, SetStudentName ] = useState(''); 

    const DriverProfile = UserInfo.Driver[0];
    const PesingerProfile = UserInfo.Pesinger[0];

    const Driver_login = UserInfo.Driver_login;
    const Pesinger_login = UserInfo.Pesinger_login; 
    
    async function  Read() {
     
      const myDoc = doc(db, 'CollectionNameCarpoolTicket', 'UserInfo'); 

      const docSnap =  await getDoc(myDoc);

      
      if (docSnap.exists()) {
        readDoc = docSnap.data();
        
        
        for (let i = 0; i < readDoc.DriverInfo.length; i++) {
          Driver_login.push(readDoc.DriverInfo[i]);
        }
      
        for (let i = 0; i < readDoc.PesingerInfo.length; i++) {
          Pesinger_login.push(readDoc.PesingerInfo[i]);
        }
      }
    }
    
    
    
    useEffect (() => {
      Read();
    },[]);

    
   
    const SignIn = () => {

      let signIn = false;

      for (let i = 0; i < UserInfo.Driver_login.length; i++) {
        
        if (UserInfo.Driver_login[i].student_number === studentNumber && UserInfo.Driver_login[i].nickname === studentName) {
          
         
          DriverProfile.nickname = UserInfo.Driver_login[i].nickname;
          DriverProfile.student_number = UserInfo.Driver_login[i].student_number;
          DriverProfile.department = UserInfo.Driver_login[i].department;
          DriverProfile.auth = UserInfo.Driver_login[i].auth;
          DriverProfile.kakao_id = UserInfo.Driver_login[i].kakao_id;
          DriverProfile.status_message = UserInfo.Driver_login[i].status_message;

          signIn = true;

          if (signIn === true) {
            navigation.navigate("Main");
          }
        }
      }
      for (let i = 0; i < UserInfo.Pesinger_login.length; i++) {
        
        if (UserInfo.Pesinger_login[i].student_number === studentNumber && UserInfo.Pesinger_login[i].nickname === studentName) {
          
          
          PesingerProfile.nickname = UserInfo.Pesinger_login[i].nickname;
          PesingerProfile.student_number = UserInfo.Pesinger_login[i].student_number;
          PesingerProfile.department = UserInfo.Pesinger_login[i].department;
          PesingerProfile.auth = UserInfo.Pesinger_login[i].auth;
          PesingerProfile.kakao_id = UserInfo.Pesinger_login[i].kakao_id;
          PesingerProfile.status_message = UserInfo.Pesinger_login[i].status_message;

          signIn = true;

          if (signIn === true) {
            navigation.navigate("Main");
          }
        }
      }
      if (signIn === false) {
        alert("학번 또는 비밀번호 잘못 입력 했습니다.");
      }
    };

    return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "heigh"}
      style={styles.container}
    >
      <TouchableWithoutFeedback 
        onPress={Keyboard.dismiss}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={{fontWeight: 'bold', fontSize: 64, color: '#FFFFFF',}}>MATE</Text> 
          </View>
          <View style={styles.input_container}>
            <Input
              placeholder='학번'
              leftIcon={{ type: 'material'}} 
              value={studentNumber}
              containerStyle={{width: '85%', marginRight: 10}}
              onChangeText={Text => SetStudentNumber(Text)}
              keyboardType="number-pad"
            />
            <Input
              placeholder='성명'
              leftIcon={{ type: 'material'}}   
              value={studentName}
              containerStyle={{width: '85%', marginRight: 10}}
              onChangeText={Text => SetStudentName(Text)}
            />
          </View>
          <View style={styles.button_container}>
            <TouchableOpacity  
              style={styles.button} 
              onPress={
                () => {
                  
                  SignIn();
                  SetStudentNumber("");
                  SetStudentName("");
                }
              }
            >
              <Text style={styles.text}>로그인</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.button}
              onPress={() => navigation.navigate("SignUpScreen")} 
            >
              <Text style={styles.text}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
      
    </KeyboardAvoidingView>  
  )
}

export default LoginScreen;

const styles = StyleSheet.create({
    button_container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '15%',
    },

    button: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 300,
      height: 52,
      marginBottom: 10,
      backgroundColor: '#315EFF',
      borderRadius: 14,
    },

    text: {
      color: '#FFFFFF',
      fontSize: 17
    },

    container: {
        flex:1,
    },

    header: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#315EFF',
      borderBottomLeftRadius: 32
    },

    input_container: {
      flex: 0.3,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '20%'
    }
});