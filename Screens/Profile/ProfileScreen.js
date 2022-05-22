import React, { useState, useEffect }from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { db } from '../../Database/DatabaseConfig/firebase';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { UserInfo } from'../../Database/Data/User/userInfo';
import { useIsFocused } from '@react-navigation/native';

export default function ProfileScreen({navigation})  {

    const [text, setText] = useState('');
    const [ deleted, setDeleted ] = useState(false);

    const isFocused = useIsFocused();
    
    useEffect(() => {
        Read();
        
    }, []);

    useEffect(() => {
        Read();
    }, [isFocused]);
    let readUserDoc;
    let userTickets;
    const Read = () => {
        const myDoc = doc(db, "CollectionNameCarpoolTicket", "CarpoolTicketDocument");
        
        getDoc(myDoc)
        .then((snapshot) => {
            if (snapshot.exists) {
                
                readUserDoc = snapshot.data();
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

    const DeleteAccount = () => {
        if (UserInfo.Driver[0].auth === 'driver') {
            const myDoc = doc(db, "CollectionNameCarpoolTicket", "UserInfo");

            updateDoc(myDoc, {DriverInfo: arrayRemove(UserInfo.Driver[0])});
            
            alert('회원탈퇴 완료 되었습니다.');
            setDeleted(true);

            navigation.navigate("StudendNumberLoginScreen")
        }
        else if (UserInfo.Pesinger[0].auth === 'pesinger') {
            const myDoc = doc(db, "CollectionNameCarpoolTicket", "UserInfo");
           
            updateDoc(myDoc, {PesingerInfo : arrayRemove(UserInfo.Pesinger[0])});
           
            alert('회원탈퇴 완료 되었습니다.');
            setDeleted(true)

            navigation.navigate("StudendNumberLoginScreen")
        }
        else {
            alert('회원탈퇴 실패 하였습니다.');
        }
    }

    const onChangeText = (value) => {
        setText(value);
    }
    const setStatusMessageButton = () => {
        UserInfo.UserInfo[0].status_message = text;
    }

    const ShowNotice = () => {
        if (UserInfo.Driver[0].auth != "") {
            return UserInfo.Driver[0].status_message;
        } else {
            return UserInfo.Pesinger[0].status_message;
        }
    };

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
                    <Text>{ShowNotice()}</Text>
                </View> 

                <TouchableOpacity style = {styles.button}
                    onPress={() => {
                        navigation.navigate("StudendNumberLoginScreen")
                        if (UserInfo.Driver[0].auth === 'driver') {
                            UserInfo.Driver[0] = {
                                nickname: "",
                                student_number: "", 
                                department: "", 
                                status_message: "",
                                recruitment_count: 0,
                                auth: "",
                                kakao_id: "" 
                                
                            };
                        } else {
                            UserInfo.Pesinger[0] = {
                                nickname: "", 
                                student_number: "", 
                                department: "", 
                                status_message: "", 
                                recruitment_count: 0,
                                auth: "",
                                kakao_id: ""
                                
                            };
                        }
                    }}>
                    <Text style = {styles.button_text}>로그아웃</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => DeleteAccount()}
                    style = {styles.button}>
                    <Text  style = {styles.button_text}>회원탈퇴</Text>
                </TouchableOpacity>        


        </View>
            <View style={styles.footer}>
                    
                    <TouchableOpacity onPress={() => navigation.navigate("Main")}>
                    <Ionicons name="home-outline" size={24} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("TicketScreen")}>
                        <Ionicons name="card-outline" size={30} color="black" />
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