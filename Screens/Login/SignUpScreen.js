import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Pressable, TextInput} from "react-native";
import SelectDropdown from 'react-native-select-dropdown'; 
import React, { useState, useEffect } from 'react';

import { UserInfo } from '../../Database/Data/User/userInfo';

import { db } from '../../Database/DatabaseConfig/firebase';

import { doc, setDoc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';

import { Ionicons } from '@expo/vector-icons'; 
import { KeyboardAvoidingView } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { Keyboard } from "react-native";


export default function SignUpScreen({navigation}) {
    
    const [ button, setButton ] = useState('pesinger');
    const [ isSelect, setSelect ] = useState([false, true]) 
    const [ studentNumber, SetStudentNumber ] = useState("");
    const [ department, SetDepartment ] = useState("");
    const [ nickname, SetNickname ] = useState(""); 
    const [ kakaoId, setKakaoId ] = useState("");

    const pesingerData = UserInfo.UserInfo[0];
    const driverData = UserInfo.UserInfo[0];
   
    const pesinger = UserInfo.Pesinger;
    const driver = UserInfo.Pesinger;

    
    const Driver_login = UserInfo.Driver_login;
    const Pesinger_login = UserInfo.Pesinger_login; 
    let readDoc = {};
  

    useEffect(() => {
        Read();
    }, []);

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

    const UserInfoCreate = () => {
        if (button === 'driver') {
            driverData.nickname = nickname; 
            driverData.student_number = studentNumber; 
            driverData.department = department; 
            driverData.auth = button; 
            driverData.kakao_id = kakaoId; 
            const myDoc = doc(db, 'CollectionNameCarpoolTicket', 'UserInfo'); 
            if (nickname != "" && studentNumber.length === 9 && department != "") {
                for (let i = 0; i < Driver_login.length; i++) {
                    if ((studentNumber === Driver_login[i].student_number)) {
                        alert('회원가입 하신적 있습니다.');
                        return ;
                    }
                }for (let i = 0; i < Pesinger_login.length; i++) {
                    if ((studentNumber === Pesinger_login[i].student_number)) {
                        alert('회원가입 하신적 있습니다.');
                        return ;
                    }
                }
                setDoc(myDoc, {"DriverInfo": arrayUnion(driverData)}, {merge: true})
                .then(() => {
                    
                    alert("Successed Sign Up");
    
                    driver[0].nickname = nickname;
                    driver[0].student_number = studentNumber;
                    driver[0].department = department;
                    driver[0].auth = button;
                    driver[0].kakao_id = kakaoId;
                    SetStudentNumber(""); 
                    SetDepartment("");
                    SetNickname("");
                
                    Read();
                    navigation.navigate("StudendNumberLoginScreen");
                })
                .catch((error) => alert(error.messeage)); 
            } else {
                alert("입력을 안한 항목이 있거나 혹은 학번 양식 안맞습니다.");
            }
        } else {
            pesingerData.nickname = nickname; 
            pesingerData.student_number = studentNumber; 
            pesingerData.department = department;
            pesingerData.auth = button; 
            pesingerData.kakao_id = kakaoId; 

            const myDoc = doc(db, 'CollectionNameCarpoolTicket', 'UserInfo'); 
            if (nickname != "" && studentNumber.length === 9 && department != "" ) {
                
                for (let i = 0; i < Driver_login.length; i++) {
                    if ((studentNumber === Driver_login[i].student_number)) {
                        alert('회원가입 하신적 있습니다.');
                        return ;
                    }
                }for (let i = 0; i < Pesinger_login.length; i++) {
                    if ((studentNumber === Pesinger_login[i].student_number)) {
                        alert('회원가입 하신적 있습니다.');
                        return ;
                    }
                }
                

                setDoc(myDoc, {"PesingerInfo": arrayUnion(pesingerData)}, {merge: true})
                .then(() => {
                    
                    alert("Successed Sign Up");
    
                    
                    pesinger[0].nickname = nickname;
                    pesinger[0].student_number = studentNumber;
                    pesinger[0].department = department;
                    pesinger[0].auth = button;
                    pesinger[0].kakao_id = kakaoId;
                 
                    SetStudentNumber(""); 
                    SetDepartment("");
                    SetNickname("");

                    Read();
                    navigation.navigate("StudendNumberLoginScreen");
                })
                .catch((error) => alert(error.messeage)); 
            } else {
                alert("입력을 안한 항목이 있거나 혹은 학번 양식 안맞습니다.");
            }
        }
    };


    const DriverColorChagneBtn = () => {
        if (isSelect[0] === true) {
            return '#315EFF';
        } else {
            return '#E7E7E7';
        }
    }
    const PesingerColorChangeBtn = () => {
        if (isSelect[1] === true) {
            return '#315EFF';
        } else {
            return '#E7E7E7';
        }
    }
    const DriverBtn = () => {
        return (
          <Pressable
            style={[{width: 140, height: 55, borderRadius: 29, justifyContent: 'center', alignItems: 'center', marginRight: 10},
              {backgroundColor: DriverColorChagneBtn()},
            ]}
            onPress={() => {
              setSelect([true,false]);
              setButton('driver');
            }}>
            <Text style={{color: isSelect[0] === true ? 'white' : 'gray', fontWeight: 'bold'}}>드라이버</Text>
          </Pressable>
        );
    };
    const PesingerBtn = () => {
        return (
          <Pressable
            style={[{width: 140, height: 55, borderRadius: 29, justifyContent: 'center', alignItems: 'center', marginLeft: 10},
              {backgroundColor: PesingerColorChangeBtn()},
            ]}
            onPress={() => {
              setSelect([false, true]);
              setButton('pesinger');
            }}>
            <Text style={{color: isSelect[1] === true ? 'white' : 'gray', fontWeight: 'bold'}}>패신저</Text>
          </Pressable>
        );
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
                        <TouchableOpacity
                            style={{right: 160 }}
                            onPress={() => navigation.navigate("StudendNumberLoginScreen")}
                        >
                                <Ionicons  name="arrow-back" size={35} color="black" />
                    
                        </TouchableOpacity> 
                            <Text style={styles.title_text}>회원가입</Text>
                    </View>

                    <View style={styles.input_container}>
                        
                        <TextInput
                            style={styles.text_input}
                            placeholder='이름'
                            value={nickname}
                            onChangeText={Text => SetNickname(Text)}
                            
                        />

                        <TextInput
                            placeholder='학번'
                            style={styles.text_input}
                            value={studentNumber}
                            maxLength={9}
                            onChangeText={Text => SetStudentNumber(Text)}
                            keyboardType="number-pad"
                        />

                        <TextInput 
                            placeholder='학과'
                            style={styles.text_input}
                            value={department}
                            onChangeText={Text => SetDepartment(Text)}
                        />

                        <TextInput 
                            placeholder='카카오아이디'
                            style={styles.text_input}
                            value={kakaoId}
                            onChangeText={Text => setKakaoId(Text)}
                        />
                    </View>
                      
                     <View style={styles.select_button_container}>
                            {DriverBtn()}
                            {PesingerBtn()}
                    </View>
                

                    <View style={styles.button_container}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                UserInfoCreate();
                            }}
                        > 
                            <View>
                                <Text style={{color: '#FFFFFF', fontSize: 24}}>가입완료</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,

        },
        header: {
            flexDirection: 'row',
            flex: 0.4,
            justifyContent: 'center',
            alignItems: 'center',
            

        },

        keyboard_container: {
            flex: 1,
            backgroundColor: 'yellow'
        },
        title: {

        },

        title_text: {
            fontSize: 32,
            fontWeight: 'bold',
            color: 'black',
            alignSelf: 'flex-end',
            position: 'absolute',

        },

        input_container: {
            flex: 1.5,
            justifyContent: 'space-around',
            alignItems: 'center',

            
        },

        select_button_container: {
            flex: 0.7,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',

        },

        button_container: {
            flex: 0.45,
            justifyContent: 'center',
            alignItems: 'center',


            
        },
        button: {
            backgroundColor: '#315EFF',
            paddingHorizontal: 60,
            paddingVertical: 10,
            borderRadius: 10,
        },
        text_input: {
            fontSize: 20,
            borderBottomWidth: 0.3,
            width: 300,
            height: 45,


        }

    }
);