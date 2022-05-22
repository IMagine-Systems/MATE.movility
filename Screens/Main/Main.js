// 모듈 불러오는 부분, 현재 수정중
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image, ImageBackground } from "react-native";
// 아이콘(원격주소) 불러오기
import { Fontisto } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import SelectDropdown from 'react-native-select-dropdown'; // dropdown 모듈 불러오기
import { FontAwesome } from '@expo/vector-icons';

// DB관련
// firebase db를 불러올려고 한다.
import { db } from '../../Database/DatabaseConfig/firebase';
// db 데이터 입출력 API 불러오기
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
// 기본 데이터 불러오기 (CarpoolTicket, TexiTicket)
import { CarpoolTicket } from'../../Database/Data/Ticket/carpoolData';
// 회원정보 데이터
import { UserInfo } from'../../Database/Data/User/userInfo';
import BottomSheet from '../Modal/BottomSheet';
import TicketBottomSheet from '../Modal/TicketBottomSheet';
import { useIsFocused } from '@react-navigation/native';
// 드롭 다운
// 드롭다운 항목들 이다.
const localList = ["", "인동"] // 선택 할 수 있는 지역

// 기본 데이터 선언
// docData : 카풀데이터이며 빈데이터로 구성 되어있다. 
const docCarpoolData = CarpoolTicket; 

// 회원정보 데이터 (아직 데이터 설계 안되어 있음.)
//const userDocData = UserInfo;

export default function Main({ navigation }) { // 정보 메인 부분
    
    // state 영역
    // 버튼 전체, 카풀, 택시 선택 했는지를 state로 선언 하였다.
    const [ all_selecting, setAllSelect ] = useState(false);
    //const [ carpool_selecting, setCarpoolSelect ] = useState(true); // 카풀 선택일때 true, 아니면 false
    const [ taxi_selecting, setTaxiSelect ] = useState(false); //택시 선택일때 true, 아니면 false
    const [ likeButton, setLikeButton ] = useState(0);
    const [ startInputText, setStartInputText ] = useState(''); // 출발지점 입력부분 state 값
    const [ endInputText, setEndInputText ] = useState(''); // 출발지점 입력부분 state 값
    const [ ticket, setTicket ] = useState('');
    // database state 영역
    // firebase 문서로 부터 데이터를 읽으면 userDoc state에 선언 할려고 한다.
    const [ userDoc, setUserDoc ] = useState([]);
    const [ userInfoDoc, setUserInfoDoc ] = useState([]);
    // '+'아이콘 티켓생성 state
    const [ modalVisible, setModalVisible ] = useState(false);
    // 티켓 클릭 할시 state
    const [ ticketModalVisible, setTicketModalVisible ] = useState(false);
    // 티켓 삭제 구현 할때 사용 한다.
    const [ data, setData ] = useState();
    // 옆으로 당긴면 refresh true 아니면 false
    const [ refresh, setRefresh ] = useState(false); 
    // 탑승 리스트페이지 True 일때 보여주기 TicketScreen
    const [ showTicketScreen, setShowTicketScreen ] = useState(false);
    // 이전 스크린으로 넘어가면 재실행하기.

    // 드라이버 티켓 중복생성 방지
    const [ createDriverTicket, setCreateDriverTicket ] = useState(false);

    const isFocused = useIsFocused(); 

    const CarpoolCreateButton = () => {
        setModalVisible(true);
        setTicket('카풀');
    };


    // 티켓을 클릭하면 모달창으로 상세 정보 보여주제 한다.
    const pressTicket = (key) => {
        setTicketModalVisible(true);
        //console.log("티켓 누름 Key : ", key);
        setData(key);
    }
    
    useEffect (() => {
        Read(); // Firebase의 문서들을 불러온다.
        showCarpoolTicket();
        showTaxiTicket();
        FindOverlay();
    }, []);


    useEffect(() => {
        Read();
        showCarpoolTicket();
        FindOverlay();
    }, [isFocused])

  


    const sheetRef = React.useRef(null);

    let carpoolCount = 0;
    let ticketInfos;

    const index = 0;
    // Database Read 부분
    const Read = ()  => {
        // Reading Doc
        // doc(firebase 경로, "컬랙션 이름", "문서 이름")
        // myDoc 변수는 firebase CarpoolTicketDocument 문서로 가르켜 준다.

        const myDoc = doc(db, "CollectionNameCarpoolTicket", "TicketDocument");

        getDoc(myDoc)
        .then((snapshot) => {
          // Read Success
          // You can read what ever document by changing the collection and document path here.
          if (snapshot.exists) { // DataSnapshop은 데이터가 포함되어있으면 true를 반환 해주며, snapshot.data()
            //console.log(snapshot.data());
            setUserDoc(snapshot.data()); // snapshot.data() 호출 되면 CloudDB에 있는 데이터들을 객체로 반환해준다.(console.log(snapshot.data()))
            ticketInfos = snapshot.data();
            carpoolCount = userDoc.CarpoolCount;

            if (ticketInfos.CarpoolTicket.length != undefined) {
                for (let i = 0; i < ticketInfos.CarpoolTicket.length; i++) {
                    if (UserInfo.Driver[0].auth === 'driver') {
                        if (UserInfo.Driver[0].student_number === ticketInfos.CarpoolTicket[i].student_number && UserInfo.Driver[0].nickname === ticketInfos.CarpoolTicket[i].nickname) {
                            if (ticketInfos.CarpoolTicket[i].pesinger_count > 0) {
                                setShowTicketScreen(true);
                                break;
                            } else {
                                setShowTicketScreen(false);
                            }
                        } else {
                            for (let j = 0; j < ticketInfos.CarpoolTicket[i].pesinger_info.length; j++) {
                                if (UserInfo.Driver[0].student_number === ticketInfos.CarpoolTicket[i].pesinger_info[j].student_number 
                                    && UserInfo.Driver[0].nickname === ticketInfos.CarpoolTicket[i].pesinger_info[j].nickname) {
                                    setShowTicketScreen(true);
                                    break;
                                } else {
                                    setShowTicketScreen(false);
                                }
                            }
                        }
                    }
                    else {
                        if (ticketInfos.CarpoolTicket[i].pesinger_count > 0) {
                            for (let j = 0; j < ticketInfos.CarpoolTicket[i].pesinger_count; j++) {
                                if ((ticketInfos.CarpoolTicket[i].pesinger_info[j].student_number === UserInfo.Pesinger[0].student_number) 
                                    && (ticketInfos.CarpoolTicket[i].pesinger_info[j].nickname === UserInfo.Pesinger[0].nickname) ) {
                                        setShowTicketScreen(true);
                                        break;
                                } else {
                                    setShowTicketScreen(false);
                                }
                            }
                        }
                    }
                }
            }
        }
          else {
            alert("No Document");
          }
        })
        .catch((error) => {
          alert(error.message);

        });

    };

    const FindOverlay = () => {
        const myDoc = doc(db, "CollectionNameCarpoolTicket", "TicketDocument");

        getDoc(myDoc)
        .then((snapshot) => {
            ticketInfos = snapshot.data();
            for(let i = 0; i < ticketInfos.CarpoolTicket.length; i++) {
                if (UserInfo.Driver[0].student_number === ticketInfos.CarpoolTicket[i].student_number && UserInfo.Driver[0].nickname === ticketInfos.CarpoolTicket[i].nickname) {
                    setCreateDriverTicket(true);
                    break;
                } else {
                    setCreateDriverTicket(false);
                }
            }

        })
    }
    // 티켓 생성
    const Create = () => {
        if (startInputText != null && endInputText != null) {
            const myDoc = doc(db, "CollectionNameCarpoolTicket", "TicketDocument");
            const myDoc2 = doc(db, "CollectionNameCarpoolTicket", "UserInfo");

            // 티켓이 아무것도 없을경우 실행
            // userDoc 변수는 firebase 문서의 데이터로 가르키고 있다.
           
            // 카풀, 택시 둘중 하나가 선택일 경우 그중 하나를 티켓이름으로 정한다.
            if (userDoc.CarpoolCount === 0) {
                if (ticket === '카풀') {
                    carpoolCount = userDoc.CarpoolCount + 1;
                    docCarpoolData.CarpoolTicket[0].ticket_name = "카풀";
                    docCarpoolData.CarpoolTicket[0].nickname = UserInfo.Driver[0].nickname; 
                    docCarpoolData.CarpoolTicket[0].department = UserInfo.Driver[0].department; 
                    docCarpoolData.CarpoolTicket[0].arrival_area = startInputText; // 출발지
                    docCarpoolData.CarpoolTicket[0].depart_area = endInputText; // 도착지
                    docCarpoolData.CarpoolTicket[0].departure_time = "30분";
                    docCarpoolData.CarpoolTicket[0].day = "2022/05/03";
                    docCarpoolData.CarpoolTicket[0].carpool_id = 1000 + carpoolCount;
                    docCarpoolData.CarpoolTicket[0].recruitment_count = UserInfo.Driver[0].recruitment_count; // 패신저(탑슨자) 모집인원 1~4명 모집
                    docCarpoolData.CarpoolTicket[0].pesinger_count = 0; // 패신저 탑승할때 마다 1 카운트 됨.
                    docCarpoolData.CarpoolTicket[0].student_number = UserInfo.Driver[0].student_number;
    
                    setDoc(myDoc, {CarpoolCount : carpoolCount, CarpoolTicket : arrayUnion(docCarpoolData.CarpoolTicket[0]) }, {merge: true})
                    .then(() => {
                        Read();
                    })
                    .catch((error) => {
                        alert(error.messeage);
                    });
                }
            }
            else {
                if (ticket === '카풀') {
                    carpoolCount = userDoc.CarpoolCount + 1;
                    docCarpoolData.CarpoolTicket[0].ticket_name = "카풀";
                    docCarpoolData.CarpoolTicket[0].nickname = UserInfo.Driver[0].nickname; 
                    docCarpoolData.CarpoolTicket[0].department = UserInfo.Driver[0].department; 
                    docCarpoolData.CarpoolTicket[0].arrival_area = startInputText; // 출발지
                    docCarpoolData.CarpoolTicket[0].depart_area = endInputText; // 도착지
                    docCarpoolData.CarpoolTicket[0].departure_time = "30분";
                    docCarpoolData.CarpoolTicket[0].day = "2022/05/03";
                    docCarpoolData.CarpoolTicket[0].carpool_id = 1000 + carpoolCount;
                    docCarpoolData.CarpoolTicket[0].recruitment_count = UserInfo.Driver[0].recruitment_count;
                    docCarpoolData.CarpoolTicket[0].pesinger_count = 0; // 패신저 탑승할때 마다 1 카운트 됨.
                    docCarpoolData.CarpoolTicket[0].student_number = UserInfo.Driver[0].student_number;
                    
    
                    updateDoc(myDoc, {"CarpoolTicket" : arrayUnion(docCarpoolData.CarpoolTicket[0]), "CarpoolCount" : carpoolCount }, {merge : true })
                    .then(() => {
                        Read();
                    })
                    .catch((error) => {
                        alert(error.messeage);
                    });
                }
            } 
        }
    }

    // runningRefresh 옆으로 당기면 refresh state를 true로 아니면 false
    const runningRefresh = () => {
        setRefresh(true);

        setTimeout(() => {
            Read();
            showCarpoolTicket();
            showTaxiTicket();
            setRefresh(false);
        }, 500);
    }
    
    // 티켓을 보여주는 부분(Ticket UI)

    function showCarpoolTicket() {

        if (userDoc.CarpoolCount > 0) {
            return (
                userDoc.CarpoolTicket.slice(0).reverse().map(key => (
                    <TouchableOpacity onPress={() => pressTicket(key)}>
                        <View style={styles.ticket_container}> 
                                     <Ionicons style={{position:"absolute", alignSelf: "flex-start" , left:10, top: -4, }} name="bookmark" size={35} color="#315EFF" />
                            <View style={styles.ticket_info}>
                                <View>
                                    <Text style={{color: '#B9696D', fontWeight: 'bold'}}>{key.arrival_area}</Text>
                                </View>
                                        <Feather name="arrow-right-circle"  size={20} color="black" /> 
                                <View>
                                    <Text style={{color: '#B9696D', fontWeight: 'bold'}}>{key.depart_area}</Text>
                                </View>
                            </View>

                            <View style={{ textAlign: "center",flex: 0.5}}>
                                 <Text style={{alignSelf: "center",fontWeight: "bold",color: "#B9696D",}}>{key.arrival_time}</Text>
                            </View>
                    

                            <View style={styles.ticket_info}>
                                <View style={{flex: 0.6}}> 
                                    <Text style={{fontSize: 16, fontWeight: 'bold', color: 'black'}}>{key.nickname}</Text>
                                    <Text style={{fontSize: 15, color: 'black'}}>{key.department}</Text>
                                </View>

                                <View style={{  backgroundColor:'#315EFF',  width:50, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 10}}>
                                    <Text style={{fontSize: 20, color: 'white'}}>{key.pesinger_count}/{key.recruitment_count}</Text>
                                </View>
                           
                            </View>
                        </View>
                    </TouchableOpacity>
                    
                ))
            );
        }
    }

    const showTaxiTicket = () => {
        
        if (userDoc.TaxiCount > 0) {
            return (
                userDoc.TaxiTicket.slice(0).reverse().map(key => (
                    <TouchableOpacity
                        onPress={() => pressTicket(key)}
                    >
                        <View style={styles.ticket_container}>
                            <View style={styles.ticket_info}>
                                <Fontisto name="bookmark-alt" size={24} color="#EEC800" />
                                <View style={{ marginHorizontal: 10, alignItems: 'center'}}>
                                    <Text >{key.nickname}</Text> 
                                    <Text style={{fontSize: 8}}>{key.department}</Text>
                                </View>
                    
                                <View style={{marginHorizontal: 12, alignItems: 'center'}}>
                                    <Feather name="arrow-right-circle" size={24} color="black" />
                                </View>
                    
                                <View style={{marginHorizontal :30, alignItems: 'center'}}>
                                    <Text>{key.depart_area}</Text>
                                    <Text style={{fontSize: 8}}>09:40</Text>
                                </View>
                            </View>
                            <View style={{flexDirection: "row", justifyContent: 'center', alignItems: 'center'}}>
                                <View style={{backgroundColor:'#315EFF', width:50, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 10}}>
                                    <Text style={{fontSize: 20, color: 'black'}}>{key.recruitment_count}/4</Text>
                                </View>
                            </View>
                            
                        </View>
                    </TouchableOpacity>
                ))
            );
        }
    }
  return (
    <View style={styles.container}>
        {/*Title 부분 */}
        <ImageBackground style={{}} source={require('../../assets/mate_main.jpeg')} imageStyle={{borderBottomLeftRadius: 40}}>
            <View style={{height: 200, width: 190,justifyContent: 'flex-end', marginLeft: 10, paddingBottom: 20}}>
                <Text style={{fontSize: 32, color: 'white', fontWeight: 'bold'}}>MATE</Text>
                <Text style={{fontSize: 13, color: 'white', fontWeight: 'bold'}}>오늘은 어떤 만남을 하시겠어요?</Text>
            </View>
        </ImageBackground>
        
        <View style={styles.ticket_create}>
            <View style={[styles.ticket_button]}>
                <Text style={{fontSize: 22, color: 'rgba(0, 0, 0, 0.6)', backgroundColor: 'white'  }}>카풀 티켓 생성</Text>
                <View style={{}}>
                    <TouchableOpacity 
                        onPress={() => {
                            if (UserInfo.Pesinger[0].auth === 'pesinger') {
                                alert('패신저는 생성 못합니다.');
                            } else if (createDriverTicket === true){
                                alert('티켓 생성 한적 있습니다.');
                            } else {
                                CarpoolCreateButton();
                                FindOverlay();
                            }
                        }}
                    >
                        <Feather name="arrow-right-circle" size={24} color="#315EFF" stlye={{}} />  
                    </TouchableOpacity>
                </View>
            </View>
        
        </View>

        <View style={{flex: 0.9, alignItems: 'center', backgroundColor: 'white'}}>
            <ScrollView refreshControl={<RefreshControl refreshing={refresh} onRefresh={() => runningRefresh()}/>}>
                <ScrollView style={{}} showsVerticalScrollIndicator ={true}>
                    <View style={{}}>
                        {showCarpoolTicket()}
                    </View>
                </ScrollView>
            </ScrollView>               
        </View>

        
       
        <View style={styles.footer}>
            <View style={{paddingHorizontal: 30}}>
                <Ionicons name="home" size={24} color="black" />
            </View>
            
            <TouchableOpacity
                style={{paddingHorizontal: 30}}
                onPress={() =>{
                    Read(); 
                    if (showTicketScreen != true) {
                        navigation.navigate("TicketDefaultScreen");
                    } else {
                        navigation.navigate("TicketScreen");
                    }
                }
            }
            >
                <Ionicons name="card-outline" size={30} color="black" />
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={{paddingHorizontal: 30}}
                onPress={() => navigation.navigate("ProfileScreen")}
            >
                <FontAwesome name="user-circle-o" size={24} color="black" />
            </TouchableOpacity>
            
        </View>
        
        <BottomSheet 
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            startInputText = {startInputText}
            endInputText = {endInputText}
            setStartInputText = {setStartInputText}
            setEndInputText = {setEndInputText}
            ticket = {ticket}
            setTicket = {setTicket}
            Create = {Create}
            Read = {Read}
            showCarpoolTicket = {showCarpoolTicket}
            showTaxiTicket = {showTaxiTicket}
            FindOverlay = {FindOverlay}
        />
        <TicketBottomSheet  
            ticketModalVisible={ticketModalVisible}
            setTicketModalVisible={setTicketModalVisible}
            userDoc={userDoc}
            setUserDoc={setUserDoc}
            data={data}
            showCarpoolTicket={showCarpoolTicket}
            showTaxiTicket={showTaxiTicket}
            Read={Read}
            carpoolCount={carpoolCount}
            UserInfo={UserInfo}
            navigation={navigation}
            FindOverlay={FindOverlay}
        />
    </View>
  );
}
 
const styles = StyleSheet.create({
    container: {
        flex:1,

    },
    
    ticket_create: {
        flex : 0.15,
        justifyContent : 'center',
        backgroundColor: 'white',
        alignItems: 'center',


    },
    footer: {
        height: 80,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderWidth: 0.3,
        alignItems: 'center',
        justifyContent: 'space-around',
    
    },
    ticket_button: {
        flex: 0.8,
        width : '80%',
        backgroundColor: 'white',

        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 0 },
        elevation: 9,
    },

    text1: {
        marginLeft: 15,
        fontSize: 24,
        color: '#315EFF',        
        fontWeight: 'bold',
        marginTop: 47,
        color: 'black',
    },
    map_icon: {
        fontSize: 24,
        marginTop: 47,
        color: 'black',
        justifyContent: 'space-between',
        marginRight: 20,
    },
    bell_icon: {
        fontSize: 24,
        marginTop: 47,
        color: 'black',
        justifyContent: 'space-between',
        marginRight: 42,
    },
    
    text_input_container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        marginTop: 8,
        borderBottomColor: '#C4C4C4',
    },
    input_start: {
        width: 137.5,
        height: 33,
        backgroundColor: 'black',
        paddingLeft: 10,
        fontSize: 16,
        marginLeft: 18,
        marginTop: 13.5,
        borderRadius: 8,
    },
   
    selection_text: {
        flexDirection: 'row',
        width: 345,
        height: 40,
        margin: 5,
    },
    status_bar: {
        width: 47.75,
        height: 3.72,
        backgroundColor: '#315EFF',
        marginTop: 5.95,
    
        
    },
    
    selection_text_all: {
       marginLeft: 50,
    },

    selection_text_carpool: {
        marginLeft: 50,
    },
    selection_text_taxi: {
        marginLeft: 50,
    },
    
    carpool_text: {
        paddingHorizontal: 30.3,
        paddingVertical: 10.3,
        backgroundColor: 'black',
        marginBottom: 14,
        justifyContent: 'space-between',
        borderWidth: 1,
        marginLeft: 6,
        marginRight: 6,
        borderRadius: 18,
       
    },
    info_text1: {
        
        marginTop: 11,
        marginLeft: 14.12,
    },
    info_text2: {
        marginTop: 5,
        marginLeft: 14.12,
        fontSize: 8,
    },
    info_profile: {
        resizeMode: 'stretch', 
        width: 33.8, 
        height: 35.2, 
        borderRadius: 25,

        
    },
    info_text_container: {
        flexDirection: 'column',
        
    },
    info_carpool_container: {
        marginTop: 14,
        width: 65,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center'
     
    },
    info_carpool_text: {
        fontSize: 18,
    },
    carpool_pointvar: {
        backgroundColor: '#315EFF',
        width: 47,
        height: 4.09,
        marginTop: 6.17,
        borderRadius: 10,
    },
    taxi_pointvar: {
        backgroundColor: '#8bc34a',
        width: 47,
        height: 4.09,
        marginTop: 6.17,
        borderRadius: 10,
    },
    info_text_local: {
        
        width: 65,
        height: 15.4,
        marginTop: 11,
        marginLeft: 14.12,
        color: '#B9696D',

    },
    info_time_text: {
        width: 40,
        height: 11,
        fontSize: 11,
        marginLeft: 17.12,
        marginTop: 6.6,

    },

    info_car_img: {
        resizeMode: 'stretch', 
        width: 200.8, 
        height: 130.2, 
    },

    count_container: {
        width: 32,
        height: 35,
        backgroundColor: '#315EFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        marginTop: 11,
        marginLeft: 25,
        marginRight: 20,

        
    },
    ticket_container: {
        flex: 1,
        backgroundColor: 'white',
        width: 330,
        height: 150,
        borderRadius: 15,
        elevation: 10,
        shadowOpacity: 0.3,
        shadowOffset: { width: 2, height: 2 },
        margin: 5,


    },
    ticket_info: {
        flex:1,
        flexDirection: 'row',
        marginTop: 15,
        justifyContent: 'space-around',


    },
});