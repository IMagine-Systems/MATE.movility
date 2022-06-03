import React, { useState, useEffect }from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';

import { db } from '../../Database/DatabaseConfig/firebase';
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion, setDoc } from 'firebase/firestore';
import { UserInfo } from'../../Database/Data/User/userInfo';
import { CarpoolTicket } from '../../Database/Data/Ticket/carpoolData';

export default function TicketScreen({navigation})  {
 
      
    useEffect(() => {
        Read();
        ShowRecruitmentList();
        
    }, []);

    useEffect(() => {
        Read();
    }, [recruitmentCancle])

   
   
   const [ userDoc, setUserDoc ] = useState([]);

   let ticketInfos;
   
   const [ arrivalArea, setArrivalArea ] = useState("");
   const [ departArea, setDepartArea ] = useState("");
   const [ openChatName, setOpenChatName ] = useState("");
   const [ openChatPassword, setOpenChatPassword ] = useState("");
   const [ recruitmentOneList, setRescruitmentOneList ] = useState({});
   const [ recruitmentTwoList, setRescruitmentTwoList ] = useState({});
   const [ recruitmentThreeList, setRescruitmentThreeList ] = useState({});
   const [ recruitmentFourList, setRescruitmentFourList ] = useState({});
   const [ driverName, setDriverName ] = useState("");
   const [ driverDepartment, setDriverDepartment ] = useState("");
   const [ recruitmentCancle, setRecruitmentCancle ] = useState({});

   const defaultRecruitmentList = {
       nickname: '',
       department: '',
   };

   const Read = ()  => {

        const myDoc = doc(db, "CollectionNameCarpoolTicket", "TicketDocument");

        getDoc(myDoc)
        .then((snapshot) => {
           
            if (snapshot.exists) {
                setUserDoc(snapshot.data()); 
                ticketInfos = snapshot.data();

                if (ticketInfos.CarpoolTicket.length != undefined) {
                    for (let i = 0; i < ticketInfos.CarpoolTicket.length; i++) {
                        if (UserInfo.Driver[0].student_number === ticketInfos.CarpoolTicket[i].student_number && UserInfo.Driver[0].nickname === ticketInfos.CarpoolTicket[i].nickname) {
                            if (ticketInfos.CarpoolTicket[i].pesinger_info.length < 1) {
                                navigation.navigate("TicketDefaultScreen"); 
                            } else {
                                setArrivalArea(ticketInfos.CarpoolTicket[i].arrival_area); 
                                setDepartArea(ticketInfos.CarpoolTicket[i].depart_area);
                                setOpenChatName(ticketInfos.CarpoolTicket[i].open_chat);
                                setOpenChatPassword(ticketInfos.CarpoolTicket[i].open_chat_password); 
                                setDriverName(ticketInfos.CarpoolTicket[i].nickname); 
                                setDriverDepartment(ticketInfos.CarpoolTicket[i].department);
                            }
                            
                        } else {
                            
                            if (UserInfo.Pesinger[0].auth === 'pesinger') {
                                for (let j = 0; j < ticketInfos.CarpoolTicket[i].pesinger_count; j++) {
                                    if ((ticketInfos.CarpoolTicket[i].pesinger_info[j].student_number === UserInfo.Pesinger[0].student_number) 
                                        && (ticketInfos.CarpoolTicket[i].pesinger_info[j].nickname === UserInfo.Pesinger[0].nickname) ) {
                                            setArrivalArea(ticketInfos.CarpoolTicket[i].arrival_area);
                                            setDepartArea(ticketInfos.CarpoolTicket[i].depart_area);
                                            setOpenChatName(ticketInfos.CarpoolTicket[i].open_chat);
                                            setOpenChatPassword(ticketInfos.CarpoolTicket[i].open_chat_password);
                                            setDriverName(ticketInfos.CarpoolTicket[i].nickname); 
                                            setDriverDepartment(ticketInfos.CarpoolTicket[i].department); 
                                    }
                                }
                            } else {
                                for (let j = 0; j < ticketInfos.CarpoolTicket[i].pesinger_count; j++) {
                                    if ((ticketInfos.CarpoolTicket[i].pesinger_info[j].student_number === UserInfo.Driver[0].student_number) 
                                        && (ticketInfos.CarpoolTicket[i].pesinger_info[j].nickname === UserInfo.Driver[0].nickname) ) {
                                            setArrivalArea(ticketInfos.CarpoolTicket[i].arrival_area);
                                            setDepartArea(ticketInfos.CarpoolTicket[i].depart_area); 
                                            setOpenChatName(ticketInfos.CarpoolTicket[i].open_chat); 
                                            setOpenChatPassword(ticketInfos.CarpoolTicket[i].open_chat_password); 
                                            setDriverName(ticketInfos.CarpoolTicket[i].nickname); 
                                            setDriverDepartment(ticketInfos.CarpoolTicket[i].department); 
                                    }
                                }
                            }
                        }
                    }
                }
                

            } else {
                alert("No Document");
            }
        })
        .catch((error) => {
            alert(error.message);
        });
    };

    const ShowRecruitmentList = () => {
        const myDoc = doc(db, "CollectionNameCarpoolTicket", "TicketDocument");

        getDoc(myDoc)
        .then((snapshot) => {
          
            
            ticketInfos = snapshot.data();
            if (ticketInfos.CarpoolTicket.length != undefined) {
                for (let i = 0; i < ticketInfos.CarpoolTicket.length; i++) {
                    if (UserInfo.Driver[0].student_number === ticketInfos.CarpoolTicket[i].student_number && UserInfo.Driver[0].nickname === ticketInfos.CarpoolTicket[i].nickname) {
                       
                        setRescruitmentOneList(ticketInfos.CarpoolTicket[i].pesinger_info[0]);
                        if (ticketInfos.CarpoolTicket[i].pesinger_count === 1) {
                            setRescruitmentTwoList(ticketInfos.CarpoolTicket[i].pesinger_info[1]);
                        } else if (ticketInfos.CarpoolTicket[i].pesinger_count === 2) {
                            setRescruitmentTwoList(ticketInfos.CarpoolTicket[i].pesinger_info[1]);
                            setRescruitmentThreeList(ticketInfos.CarpoolTicket[i].pesinger_info[2]);
                        } else if (ticketInfos.CarpoolTicket[i].pesinger_count === 3) {
                            setRescruitmentTwoList(ticketInfos.CarpoolTicket[i].pesinger_info[1]);
                            setRescruitmentThreeList(ticketInfos.CarpoolTicket[i].pesinger_info[2]);
                            setRescruitmentFourList(ticketInfos.CarpoolTicket[i].pesinger_info[3]);
                        } else if (ticketInfos.CarpoolTicket[i].pesinger_count === 4) {
                            setRescruitmentTwoList(ticketInfos.CarpoolTicket[i].pesinger_info[1]);
                            setRescruitmentThreeList(ticketInfos.CarpoolTicket[i].pesinger_info[2]);
                            setRescruitmentFourList(ticketInfos.CarpoolTicket[i].pesinger_info[3]);
                            setRescruitmentFourList(ticketInfos.CarpoolTicket[i].pesinger_info[4]);
                        }
                        
                        
                    } else {
                        if (ticketInfos.CarpoolTicket[i].pesinger_count > 0) {
                            if (UserInfo.Pesinger[0].auth === 'pesinger') {
                                for (let j = 0; j < ticketInfos.CarpoolTicket[i].pesinger_count; j++) {
                                    if ((ticketInfos.CarpoolTicket[i].pesinger_info[j].student_number === UserInfo.Pesinger[0].student_number) 
                                        && (ticketInfos.CarpoolTicket[i].pesinger_info[j].nickname === UserInfo.Pesinger[0].nickname) ) {
                                            setRescruitmentOneList(ticketInfos.CarpoolTicket[i].pesinger_info[0]);
                                        if (ticketInfos.CarpoolTicket[i].pesinger_count === 2) {
                                            setRescruitmentTwoList(ticketInfos.CarpoolTicket[i].pesinger_info[1]);
                                        } else if (ticketInfos.CarpoolTicket[i].pesinger_count === 3) {
                                            setRescruitmentTwoList(ticketInfos.CarpoolTicket[i].pesinger_info[1]);
                                            setRescruitmentThreeList(ticketInfos.CarpoolTicket[i].pesinger_info[2]);
                                        } else if (ticketInfos.CarpoolTicket[i].pesinger_count === 4) {
                                            setRescruitmentTwoList(ticketInfos.CarpoolTicket[i].pesinger_info[1]);
                                            setRescruitmentThreeList(ticketInfos.CarpoolTicket[i].pesinger_info[2]);
                                            setRescruitmentFourList(ticketInfos.CarpoolTicket[i].pesinger_info[3]);                                            
                                        } 
                                    }
                                }
                            } else {
                                for (let j = 0; j < ticketInfos.CarpoolTicket[i].pesinger_count; j++) {
                                    if ((ticketInfos.CarpoolTicket[i].pesinger_info[j].student_number === UserInfo.Driver[0].student_number) 
                                        && (ticketInfos.CarpoolTicket[i].pesinger_info[j].nickname === UserInfo.Driver[0].nickname) ) {
                                            setRescruitmentOneList(ticketInfos.CarpoolTicket[i].pesinger_info[0]);
                                        if (ticketInfos.CarpoolTicket[i].pesinger_count === 2) {
                                            setRescruitmentTwoList(ticketInfos.CarpoolTicket[i].pesinger_info[1]);
                                        } else if (ticketInfos.CarpoolTicket[i].pesinger_count === 3) {
                                            setRescruitmentTwoList(ticketInfos.CarpoolTicket[i].pesinger_info[1]);
                                            setRescruitmentThreeList(ticketInfos.CarpoolTicket[i].pesinger_info[2]);
                                        } else if (ticketInfos.CarpoolTicket[i].pesinger_count === 4) {
                                            setRescruitmentTwoList(ticketInfos.CarpoolTicket[i].pesinger_info[1]);
                                            setRescruitmentThreeList(ticketInfos.CarpoolTicket[i].pesinger_info[2]);
                                            setRescruitmentFourList(ticketInfos.CarpoolTicket[i].pesinger_info[3]);                                            
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                setRescruitmentOneList({nickname: '', department: ''});
                setRescruitmentTwoList({nickname: '', department: ''});                
                setRescruitmentThreeList({nickname: '', department: ''});
                setRescruitmentFourList({nickname: '', department: ''});
            }
            
        })
        .catch((error) => alert(error.message))
    }

    const RecruitmentCancel = () => {
        const myDoc = doc(db, "CollectionNameCarpoolTicket", "TicketDocument");

        getDoc(myDoc)
        .then((snapshot) => {
            if (snapshot.exists) {
                ticketInfos = snapshot.data();

                for(let i = 0; i < ticketInfos.CarpoolTicket.length; i++) {
                    if (ticketInfos.CarpoolTicket[i].pesinger_count > 0) {
                        if (UserInfo.Pesinger[0].auth === 'pesinger') {
                            for (let j = 0; j < ticketInfos.CarpoolTicket[i].pesinger_count; j++) {
                                if ((ticketInfos.CarpoolTicket[i].pesinger_info[j].student_number === UserInfo.Pesinger[0].student_number) 
                                    && (ticketInfos.CarpoolTicket[i].pesinger_info[j].nickname === UserInfo.Pesinger[0].nickname) ) {
                                        
                                        setRecruitmentCancle(ticketInfos.CarpoolTicket[i]);

                                        updateDoc(myDoc, { CarpoolTicket: arrayRemove(ticketInfos.CarpoolTicket[i]) })
                                        ticketInfos.CarpoolTicket[i].pesinger_info = ticketInfos.CarpoolTicket[i].pesinger_info.filter(element => element.student_number != UserInfo.Pesinger[0].student_number);              
                                        ticketInfos.CarpoolTicket[i].pesinger_count -= 1                                                      
                                        updateDoc(myDoc, {CarpoolTicket: arrayUnion(ticketInfos.CarpoolTicket[i]) });
                                        alert('탑승 취소 하였습니다.');
                                        navigation.navigate("TicketDefaultScreen");
                                }
                            }
                        } else {
                            for (let j = 0; j < ticketInfos.CarpoolTicket[i].pesinger_count; j++) {
                                if ((ticketInfos.CarpoolTicket[i].pesinger_info[j].student_number === UserInfo.Driver[0].student_number) 
                                    && (ticketInfos.CarpoolTicket[i].pesinger_info[j].nickname === UserInfo.Driver[0].nickname) ) {
                                        setRecruitmentCancle(ticketInfos.CarpoolTicket[i]);
                                        
                                        updateDoc(myDoc, { CarpoolTicket: arrayRemove(ticketInfos.CarpoolTicket[i]) })
                                        ticketInfos.CarpoolTicket[i].pesinger_info = ticketInfos.CarpoolTicket[i].pesinger_info.filter(element => element.student_number != UserInfo.Driver[0].student_number);              
                                        ticketInfos.CarpoolTicket[i].pesinger_count -= 1                                                      
                                        updateDoc(myDoc, {CarpoolTicket: arrayUnion(ticketInfos.CarpoolTicket[i]) });
                                        alert('탑승 취소 하였습니다.');
                                        navigation.navigate("TicketDefaultScreen");
                                        
                                }
                            }
                        }
                    }
                    if (ticketInfos.CarpoolTicket[i].pesinger_count > 0) {
                        for (let j = 0; j < ticketInfos.CarpoolTicket[i].pesinger_count; j++) {
                            if ((ticketInfos.CarpoolTicket[i].pesinger_info[j].student_number === UserInfo.Pesinger[0].student_number) 
                                && (ticketInfos.CarpoolTicket[i].pesinger_info[j].nickname === UserInfo.Pesinger[0].nickname) ) {
                                    setRecruitmentCancle(ticketInfos.CarpoolTicket[i]);
                                    updateDoc(myDoc, { CarpoolTicket: arrayRemove(ticketInfos.CarpoolTicket[i]) })
                                    ticketInfos.CarpoolTicket[i].pesinger_info = ticketInfos.CarpoolTicket[i].pesinger_info.filter(element => element.student_number != UserInfo.Pesinger[0].student_number);              
                                    ticketInfos.CarpoolTicket[i].pesinger_count -= 1                                                      
                                    updateDoc(myDoc, {CarpoolTicket: arrayUnion(ticketInfos.CarpoolTicket[i]) });
                                    alert('탑승 취소 하였습니다.');
                                    navigation.navigate("TicketDefaultScreen");
                                    
                            }
                        }                                 
                    }
                }
            }
        })
    }

    const ShowRecruitmentCancelButton = () => {
        if (driverName != UserInfo.Driver[0].nickname && driverDepartment != UserInfo.Driver[0].department) {
            return (
                    <TouchableOpacity
                        onPress={RecruitmentCancel}
                    >
                        <View style={styles.button}>
                            <Text style={styles.button_font}>탑승 취소</Text>
                        </View>
                    </TouchableOpacity>
            );
        } else if (UserInfo.Pesinger[0].nickname != ""){
            return (
                <TouchableOpacity
                    onPress={RecruitmentCancel}
                >
                    <View style={styles.button}>
                        <Text style={styles.button_font}>탑승 취소</Text>
                    </View>
                </TouchableOpacity>
            );
        }
    }

    const RecruitmentComplete = () => {
        const myDoc = doc(db, "CollectionNameCarpoolTicket", "TicketDocument");
        const myDoc2 = doc(db, "CollectionNameCarpoolTicket", "ReceiptDocument");

        getDoc(myDoc)
        .then((snapshot) => {
            if (snapshot.exists) {
                ticketInfos = snapshot.data();

                if (ticketInfos.CarpoolTicket.length != undefined) {
                    for (let i = 0; i < ticketInfos.CarpoolTicket.length; i++) {
                        if (UserInfo.Driver[0].student_number === ticketInfos.CarpoolTicket[i].student_number && UserInfo.Driver[0].nickname === ticketInfos.CarpoolTicket[i].nickname) {
                
                            updateDoc(myDoc2, {CarpoolTicket: arrayUnion(ticketInfos.CarpoolTicket[i])});
                            updateDoc(myDoc, { CarpoolCount: ticketInfos.CarpoolCount-1, CarpoolTicket: arrayRemove(ticketInfos.CarpoolTicket[i]) })
                            alert("운행 종료 했습니다.");
                            navigation.navigate("Main");
                        }
                    } 
                }
            }
        })
    }

    const ShowRecruitmentCompleteButton = () => {
        if (driverName === UserInfo.Driver[0].nickname && driverDepartment === UserInfo.Driver[0].department) {
            return (
                <TouchableOpacity
                    onPress={RecruitmentComplete}
                >
                    <View style={[styles.button]}>
                        <Text style={styles.button_font}>운행 종료</Text>
                    </View>
                </TouchableOpacity>
            );
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>

                <View style={styles.map}>
                    <Text style={styles.mapText}>{arrivalArea}</Text>
                    <AntDesign name="arrowright" size={30} color="black" />
                    <Text style={styles.mapText}>{departArea}</Text>
                </View>

            </View>

            
            
            <View style={styles.body}>
                <View style={styles.chatInfo}>
                    <Text style={styles.chatInfoText}>오픈채팅 : {openChatName}</Text>
                    <Text style={styles.chatInfoText}>비밀번호 : {openChatPassword}</Text>
                </View>

                <View style={styles.userList}>
                    <View style={styles.driverText}>
                        <Image style={{flex: 0.2,height: 50, borderRadius: 50 }}source={require('../../assets/mate_icon.png')}/>
                        <View style={styles.UserInfo_text}>
                            <Text style={styles.UserInfo_font}>{driverName}</Text>
                            <Text style={styles.UserInfo_font}>{driverDepartment}</Text>
                        </View>
                    </View>

                    <View style={styles.pesingerText}>
                        <Image style={{flex: 0.2, height: 50, borderRadius: 50 }}source={require('../../assets/mate_icon.png')}/>
                        <View style={styles.UserInfo_text}>
                            <Text style={styles.UserInfo_font}>{recruitmentOneList != undefined ? recruitmentOneList.nickname : defaultRecruitmentList.nickname}</Text>
                            <Text style={styles.UserInfo_font}>{recruitmentOneList != undefined ? recruitmentOneList.department : defaultRecruitmentList.department}</Text>
                        </View>                   
                    </View>

                    <View style={styles.pesingerText}>
                        <Image style={{flex: 0.2, height: 50, borderRadius: 50}}source={require('../../assets/mate_icon.png')}/>
                        <View style={styles.UserInfo_text}>
                            <Text style={styles.UserInfo_font}>{recruitmentTwoList != undefined ? recruitmentTwoList.nickname : defaultRecruitmentList.nickname}</Text>
                            <Text style={styles.UserInfo_font}>{recruitmentTwoList != undefined ? recruitmentTwoList.department : defaultRecruitmentList.department}</Text>
                        </View>
                   </View>

                    <View style={styles.pesingerText}>
                        <Image style={{flex: 0.2, height: 50, borderRadius: 50}}source={require('../../assets/mate_icon.png')}/>
                        <View style={styles.UserInfo_text}>
                            <Text style={styles.UserInfo_font}>{recruitmentThreeList != undefined ? recruitmentThreeList.nickname : defaultRecruitmentList.nickname}</Text>
                            <Text style={styles.UserInfo_font}>{recruitmentThreeList != undefined ? recruitmentThreeList.department : defaultRecruitmentList.department}</Text>
                            </View>
                    </View>

                   <View style={styles.pesingerText}>
                        <Image style={{flex: 0.2, height: 50, borderRadius: 50 }}source={require('../../assets/mate_icon.png')}/>
                        <View style={styles.UserInfo_text}>
                            <Text style={styles.UserInfo_font}>{recruitmentFourList != undefined ? recruitmentFourList.nickname : defaultRecruitmentList.nickname}</Text>
                            <Text style={styles.UserInfo_font}>{recruitmentFourList != undefined ? recruitmentFourList.department : defaultRecruitmentList.department}</Text>
                        </View>
                    </View>
                    
                </View>
                <View style={styles.button_container}>
                    {ShowRecruitmentCompleteButton()}
                    {ShowRecruitmentCancelButton()}
                    
                </View>


            </View>
        
                <View style={styles.footer}>
                
                    <TouchableOpacity onPress={() => navigation.navigate("Main")}>
                        <Ionicons name="home-outline" size={24} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("TicketScreen")}>
                        <Ionicons name="card" size={30} color="black" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
                        <FontAwesome name="user-circle" size={24} color="black" />
                    </TouchableOpacity>
            
            </View>
        </View>
    );
}

const styles = StyleSheet.create( {
    container: {
        flex: 1,

        
    },

    header: {
        flex : 0.25,
        backgroundColor: "white",
        justifyContent: 'center',
        alignItems: 'center',
    },

    body: {
        flex: 1,
        backgroundColor: "white",
        justifyContent:"space-around",

    },
    button_container: {
        flex: 0.2,
        
        justifyContent: "center",
        alignItems: "center",
    },

    button: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 10,
        height: 50,
        width: 300,
        justifyContent: "center",
        alignItems: "center",
    },

  
   
    map: {
        bottom: 10,
        position: 'absolute',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderRadius: 10,
        width: '80%',
        height: '60%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',


    },

    mapText: {
        fontSize: 25,
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
        
    },
    
    chatInfo: {
        flex: 0.2,
        width: "80%",
        alignSelf: "center",
        justifyContent: "center",
        

      

    },

    chatInfoText: {

        fontSize: 20,
        fontWeight: 'bold',

    },

    userList: {
        flex: 0.8,   
     
        justifyContent: "space-around",
    },

    driverText: {
        
        flex: 1,
        width: "80%",
        flexDirection: "row",
        alignSelf: "center",
        alignItems: "center",

        
    },

    pesingerText: {
        
        flex: 1,
        width: "80%",
        flexDirection: "row",
        alignSelf: "center",
        alignItems: "center"
      
    },

    UserInfo_text: {
        
        flex: 1,
        height : 40,
        justifyContent: "space-between",

    },

    UserInfo_font: {
        fontSize: 20,
        left: 10,

    },

    button_font:{
        fontSize: 20,
        fontWeight: "bold"
    },
  
    
    footer: {
        height: 80,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderWidth: 0.2,
        alignItems: 'center',
        justifyContent: 'space-around',
    
    },
    
}
);