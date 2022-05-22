import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Pressable} from "react-native";
import SelectDropdown from 'react-native-select-dropdown'; 
import { Input } from 'react-native-elements';
import React, { useState } from 'react';

import { UserInfo } from '../../Database/Data/User/userInfo';

import { db } from '../../Database/DatabaseConfig/firebase';

import { doc, setDoc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { TextInput } from "react-native";

export default function SignUpScreen({navigation}) {
    
    const [ button, setButton ] = useState('driver');
    const [ isSelect, setSelect ] = useState([false, true]) 
    const [ studentNumber, SetStudentNumber ] = useState(""); 
    const [ department, SetDepartment ] = useState("");
    const [ nickname, SetNickname ] = useState("");

    const pesingerData = UserInfo.UserInfo[0];

    let readDoc = {}; 
    
    let userInfoDatas = [];

    async function  Read() {
    
        const myDoc = doc(db, 'CollectionNameCarpoolTicket', 'UserInfo'); 
    
        const docSnap =  await getDoc(myDoc);
    
        
        if (docSnap.exists()) {
            readDoc = docSnap.data();
            PesingerInfoDatas = readDoc.PesingerInfo;
            UserInfo.userInfoDatas = userInfoDatas;
            
        
        }
    }
    const PesingerInfoCreate = () => {
        pesingerData.nickname = nickname; 
        pesingerData.student_number = studentNumber;
        pesingerData.department = department;

        const myDoc = doc(db, 'CollectionNameCarpoolTicket', 'UserInfo'); 
        if (nickname != "" && studentNumber != "" && department != "") {
            
            setDoc(myDoc, {"PesingerInfo": arrayUnion(pesingerData)}, {merge: true})
            .then(() => {

                alert("Successed Sign Up");

                SetStudentNumber(""); 
                SetDepartment("");
                SetNickname("");
                Read();

                navigation.navigate("StudendNumberLoginScreen");
            })
            .catch((error) => alert(error.messeage)); 
        } else {
            alert("입력을 안한 항목이 있습니다.");
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
            style={[{width: 140, height: 55, borderRadius: 29, justifyContent: 'center', alignItems: 'center', marginRight: 20},
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
            style={[{width: 140, height: 55, borderRadius: 29, justifyContent: 'center', alignItems: 'center', marginRight: 20},
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
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.title}>
                    <Text style={styles.title_text}>MATE 회원가입</Text>
                </View>
            </View>

            <ScrollView style={styles.inputContainer}>
                <View>
                    <Input
                        placeholder='성명을 입력해 주세요'
                        label="성명"
                        leftIcon={{ type: 'material', name: 'school'}}   
                        value={nickname}
                        onChangeText={Text => SetNickname(Text)}
                    />

                    <Input
                        placeholder='학번을 입력해 주세요'
                        label="학번"
                        leftIcon={{ type: 'material', name: 'school'}}  
                        value={studentNumber}
                        onChangeText={Text => SetStudentNumber(Text)}
                    />

                 
                    {button === 'pesinger' ? <Input placeholder='학과를 입력해 주세요' label="학과" leftIcon={{ type: 'material', name: 'school'}} value={department} onChangeText={Text => SetDepartment(Text)}/> : null}

                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        {DriverBtn()}
                        {PesingerBtn()}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.button_container}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        PesingerInfoCreate();
                    }}
                > 
                    <View>
                        <Text style={{color: '#FFFFFF', fontSize: 24}}>Sign Up</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            
        },
        header: {
            flex: 0.2,
            backgroundColor: '#315EFF',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomLeftRadius: 30,
        },

        title: {

        },

        title_text: {
            fontSize: 30,
            fontWeight: 'bold',
            color: '#FFFFFF',
        },

        inputContainer: {
            flex: 1,
            marginTop: 10,
        },

        button_container: {
            flex: 0.2,
            justifyContent: 'center',
            alignItems: 'center',
        },
        button: {
            backgroundColor: '#315EFF',
            paddingHorizontal: 60,
            paddingVertical: 10,
            borderRadius: 10,
        }

    }
);