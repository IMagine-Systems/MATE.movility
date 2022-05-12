import React, { useState, useEffect }from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
// 아이콘(원격주소)
import { Fontisto } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
//firebase
import { db } from '../../Database/DatabaseConfig/firebase';
import { doc, getDoc } from 'firebase/firestore';
// 회원정보 데이터
import { UserInfo } from'../../Database/Data/User/userInfo';
import { useIsFocused } from '@react-navigation/native';

export default function ProfileScreen({navigation})  {

    const [text, setText] = useState('');

    const isFocused = useIsFocused();
    
    useEffect(() => {
        Read();
        
    }, []);

    useEffect(() => {
        Read();
        console.log(`status_message 변함 : ${UserInfo.UserInfo[0]}`);
    }, [isFocused]);
    // firebase로 불러온 정보를 선언(가리키고자)하고자 한다.
    let readUserDoc;
    // 사용자 티켓들 
    let userTickets;

    // 데아터 문서 읽어오기
    const Read = () => {
        const myDoc = doc(db, "CollectionNameCarpoolTicket", "CarpoolTicketDocument");
        
        getDoc(myDoc)
        .then((snapshot) => {
            if (snapshot.exists) {
                
                readUserDoc = snapshot.data();
                console.log("firebase로부터 불러온 회원 정보들 : ", readUserDoc.CarpoolTicket);
                console.log("회원정보 : ", UserInfo.UserInfo[0]);
                readUserDoc = readUserDoc.CarpoolTicket;
                ShowTickets();
            }
        })
        .catch((error) => {
            alert(error.messeage);
        });
    }

    const ShowTickets = () => {
        return(
            [

            ]
        );
    }

    // 상태메시지 입력창 
    const onChangeText = (value) => {
        setText(value);
    }
    // 상태메시지 입력 버튼
    const setStatusMessageButton = () => {
        UserInfo.UserInfo[0].status_message = text;
    }

    const ShowName = () => {
        if (UserInfo.Driver[0].auth != "") {
            return UserInfo.Driver[0].nickname;
        } else {
            return UserInfo.Pesinger[0].nickname;
        }
    };

    return (
     
        <View style={styles.container}>
            <View style={{width: '100%' , height: 200 , backgroundColor: '#315EFF', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{bottom: 30, fontSize: 25, fontWeight: 'bold', color: 'white' }}>프로필</Text>
                <Image style={{position:'absolute', top: 90, width: 150, height: 150, borderRadius: 150/2, borderColor: 'white', borderWidth: 5, }}source={require('../../assets/mate_icon.png')}/>  
            </View>
            
            
            <View style={styles.body}>

                <Text style={styles.user_name_text}>{ShowName()}</Text>

                 <View style={{backgroundColor: 'rgba(196, 196, 196, 0.31)', borderRadius: 10,  width: '100%', height: '50%', justifyContent: 'center', alignItems: 'center'}}>
                    <Text>티켓 설명</Text>
                </View> 

                <TouchableOpacity style = {styles.button}>
                    <Text style = {styles.button_text}>로그아웃</Text>
                </TouchableOpacity>

                <TouchableOpacity style = {styles.button}>
                    <Text  style = {styles.button_text}>회원탈퇴</Text>
                </TouchableOpacity>        


        </View>
            <View style={styles.footer}>
                    
                    <TouchableOpacity onPress={() => navigation.navigate("Main")}>
                    <Ionicons name="home-outline" size={24} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("TicKetScreen")}>
                        <Ionicons name="card-outline" size={24} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
                        <FontAwesome name="user-circle-o" size={24} color="black" />
                    </TouchableOpacity>
            </View>
        </View>

    );
}

const styles = StyleSheet.create( {
        container: {
            flex: 1,
            backgroundColor: 'white',
        },
        body: {
            flex: 1,
            alignItems: 'center',
            margin: 40,



        },
        center: {
            flex: 1,
            backgroundColor: '#739BE1',
            marginBottom: 25,
            marginHorizontal: 20,
            borderRadius: 15,
        },
        profile_info: {
            flex:1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        profile_img: {
            resizeMode: 'stretch', 
            width: 128.0, 
            height: 128.0, 
            borderRadius: 63, 
            marginTop: 9.9, 
            marginLeft: 10
        },
        user_name_text: {
            fontSize: 30,
            marginTop: 10,
            color: 'black',


        },

        button: {
            width: 300,
            height: 40,
            borderWidth: 0.5,
            borderRadius: 4,
            margin: 3,
            top: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(196, 196, 196, 0.2)'
            
        },
     
        button_text: {
            color: 'black',
            fontWeight: 'bold',

        },

        ticket: {
            backgroundColor: '#FFFFFF',
            marginTop: 20,
            paddingVertical: 20,
            marginLeft:15,
            marginRight: 15,
            borderRadius: 12,
            
        },
        footer: {
            height: 80,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            borderWidth: 0.3,


        },

        
    }
);