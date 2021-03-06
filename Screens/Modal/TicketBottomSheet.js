import React, { useEffect, useRef, useState } from 'react';
import { db } from '../../Database/DatabaseConfig/firebase';
import { doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import {
    View,
    StyleSheet,
    Text,
    Modal,
    Animated,
    TouchableWithoutFeedback,
    Dimensions,
    PanResponder,
    TouchableOpacity,
} from 'react-native';

import { FontAwesome } from '@expo/vector-icons'; 
import { UserInfo } from'../../Database/Data/User/userInfo';
// 아이콘(원격주소) 불러오기
import { Fontisto } from '@expo/vector-icons';
import { getPendingResultAsync } from 'expo-image-picker';
import { Touchable } from 'react-native';

const TicketBottomSheet = (props) => {


    const { ticketModalVisible, setTicketModalVisible, userDoc, data, setData,showCarpoolTicket, showTaxiTicket, Read, carpoolCount, UserInfo } = props;
    // 자기가 만든 티켓을 삭제할때 사용할 state이다.

    let default_data = {
        "arrival_area": "", // 출발지
        "carpool_id": 1000, // 카풀아이디
        "day": "2022/05/03", // 일자
        "depart_area": "", // 출발지
        "department": "", // 학과,
        "arrival_time": "",
        "departure_time": "30분", // 도착시간
        "nickname": "", // 성명
        "recruitment_count": 0, // 모집인원 0~4명
        "pesinger_count": 0,
        "ticket_name": "카풀", // 티켓 카풀
        "open_chat": "",
        "open_chat_password": "",
        "pesinger_info": [],
    };

    const [ deleted, setDeleted ] = useState(false);
    // 오픈채팅 보여줄지
    const [ openChat, setOpenChat ] = useState(false);

    // 수정 할때 사용할 state 출발지, 도착지
    const [arrivalText, setArrivalText] = useState('');
    const [departText, setDepartText] = useState('');

    const screenHeight = Dimensions.get("screen").height;
    const panY = useRef(new Animated.Value(screenHeight)).current;
    const translateY = panY.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [0, 0, 1],
    });

    const resetBottomSheet = Animated.timing(panY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
    });

    const closeBottomSheet = Animated.timing(panY, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
    });

    console.log('Ticket생성 모달 Data 출력 : ', data);
    console.log('Ticket생성 모달 Driver 출력 : ', UserInfo.Pesinger[0]);
    const ShowOpenChat = () => {
       
        console.log('showOpenChat 호출');
        if (data.ticket_name === '카풀' && UserInfo.Driver[0].nickname === data.nickname) {
            setOpenChat(true);
            return (
                <View>
                    <Text style={{fontSize: 15, marginRight: 10}}>오픈채팅방 : {data.open_chat}</Text>
                    <Text style={{fontSize: 15, marginRight: 10}}>비밀번호 : {data.open_chat_password}</Text>
                </View>
            );
        } else {
            for (let i = 0; i < data.pesinger_info.length; i++) {
                if (data.pesinger_info[i] === UserInfo.Pesinger[0].student_number) {
                    setOpenChat(true);
                    return (
                        <View>
                            <Text style={{fontSize: 15, marginRight: 10}}>오픈채팅방 : {data.open_chat}</Text>
                            <Text style={{fontSize: 15, marginRight: 10}}>비밀번호 : {data.open_chat_password}</Text>
                        </View>
                    );
                }
            }
        }
    }

    const panResponders = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => false,
        onPanResponderMove: (event, gestureState) => {
            panY.setValue(gestureState.dy);
        },
        onPanResponderRelease: (event, gestureState) => {
            if(gestureState.dy > 0 && gestureState.vy > 1.5) {
                closeModal();
            }
            else {
                resetBottomSheet.start();
            }
        }
    })).current;

    useEffect(()=>{
        if(props.ticketModalVisible) {
            resetBottomSheet.start();
            findDelete();
        }
    }, [props.ticketModalVisible]);

    const closeModal = () => {
        closeBottomSheet.start(()=>{
            setTicketModalVisible(false);
        })
    }

    // findDelete 함수는 자기 티켓만 삭제 할수있도록 setDeleted state true,false로 권한을 준다.
    // nickname으로 비교하지만 추후에 학번으로 바꾸고자 한다. 
    const findDelete = () => {
        if (data.nickname === UserInfo.UserInfo[0].nickname) {
            setDeleted(true);
        }
        else {
            setDeleted(false);
        }
    }

    console.log('카풀 티켓 수 : ', userDoc.CarpoolCount);
    console.log('택시 티켓 수 : ', userDoc.TaxiCount);
    console.log('사용자 : ', UserInfo.UserInfo[0]);
    //console.log('현재 탑승인원 : ', data.recruitment_count);
    
    const ticketDelete = () => {
        if ((data.ticket_name === '카풀') && (UserInfo.UserInfo[0].nickname === data.nickname)) {
            const myDoc = doc(db, "CollectionNameCarpoolTicket", "CarpoolTicketDocument");
            //console.log('ticket : ', data);
            updateDoc(myDoc, {CarpoolCount: userDoc.CarpoolCount-1, CarpoolTicket : arrayRemove(data)});
            alert('삭제 하였습니다.');
            Read();
            showCarpoolTicket();
            setDeleted(true);
        }
        //console.log("티켓 모달 : ", userDoc.CarpoolTicket);
        else if ((data.ticket_name === '택시') && (UserInfo.UserInfo[0].nickname === data.nickname)) {
            const myDoc = doc(db, "CollectionNameCarpoolTicket", "CarpoolTicketDocument");
            updateDoc(myDoc, {TaxiCount: userDoc.TaxiCount-1, TaxiTicket : arrayRemove(data)});
            alert('삭제 하였습니다.');
            Read();
            showCarpoolTicket();
            setDeleted(true)
        }
        else if (UserInfo.UserInfo[0].nickname != data.nickname) {
            alert('삭제 못하였습니다.');
            setDeleted(false);
        }
    }

    // 탑승하기 버튼 클릭하면 탑승자 추가 된다.
    const addRecruitment = () => {
        
        if (data === undefined) {
            if ((defult_data.ticket_name === '카풀') && (UserInfo.Pesinger[0].auth === 'pesinger')) {
                const myDoc = doc(db, "CollectionNameCarpoolTicket", "TicketDocument");
                
                console.log(UserInfo.Pesinger[0].student_number);

                for (let i = 0; i < default_data.recruitment_count; i++) {
                    if (default_data.pesinger_info[i] === UserInfo.Pesinger[0].student_number) {
                        alert('탑승 한적 있습니다.');
                        return;
                    } 
                }
                if (default_data.pesinger_count < default_data.recruitment_count) {
                    updateDoc(myDoc, { CarpoolTicket : arrayRemove(default_Pdata) });
                    default_data.pesinger_count += 1;
                    default_data.pesinger_info.push(UserInfo.Pesinger[0].student_number);
                    updateDoc(myDoc, { CarpoolTicket : arrayUnion(default_data)});
                    alert('탑승인원 추가 하였습니다.');
                    Read();
                    showCarpoolTicket();
                }
            } else {
                alert('탑승인원 초과 했습니다.');
            }
        } else {
            if ((data.ticket_name === '카풀') && (UserInfo.Pesinger[0].auth === 'pesinger')) {
                const myDoc = doc(db, "CollectionNameCarpoolTicket", "TicketDocument");
                
                if (data.pesinger_count >= data.recruitment_count) {
                    alert('탑승인원 초과 했습니다.')
                }
                for (let i = 0; i < data.recruitment_count; i++) {
                    if (data.pesinger_info[i] === UserInfo.Pesinger[0].student_number) {
                        alert('탑승 한적 있습니다.');
                        return;
                    } 
                }
                if (data.pesinger_count < data.recruitment_count) {
                    updateDoc(myDoc, { CarpoolTicket : arrayRemove(data) });
                    data.pesinger_count += 1;
                    data.pesinger_info.push(UserInfo.Pesinger[0].student_number);
                    updateDoc(myDoc, { CarpoolTicket : arrayUnion(data)});
                    alert('탑승인원 추가 하였습니다.');
                    Read();
                    showCarpoolTicket();
                } else {

                }
            } else if ((data.nickname != UserInfo.Driver[0].nickname) && (UserInfo.Driver[0].auth === 'driver')) {
                const myDoc = doc(db, "CollectionNameCarpoolTicket", "TicketDocument");
            
                if (data.pesinger_count >= data.recruitment_count) {
                    alert('탑승인원 초과 했습니다.')
                }
                for (let i = 0; i < data.recruitment_count; i++) {
                    if (data.pesinger_info[i] === UserInfo.Driver[0].student_number) {
                        alert('탑승 한적 있습니다.');
                        return;
                    } 
                }
                if (data.pesinger_count < data.recruitment_count) {
                    updateDoc(myDoc, { CarpoolTicket : arrayRemove(data) });
                    data.pesinger_count += 1;
                    data.pesinger_info.push(UserInfo.Driver[0].student_number);
                    updateDoc(myDoc, { CarpoolTicket : arrayUnion(data)});
                    alert('탑승인원 추가 하였습니다.');
                    Read();
                    showCarpoolTicket();
                }
            } else {
                if (data.nickname === UserInfo.Driver[0].nickname) {
                    alert('자신 만든 티켓입니다.');
                }
            }
        }
    }

    // 출발지, 도착지수정 실행 하는 함수
    const setArrivalUpdate = (btn_id) => {
        // btn_id : 1 경운대학교, btn_id : 2 인동, btn_id : 3 옥계
        if (btn_id === 1) {
            setArrivalText('경운대학교');
        } else if (btn_id === 2) {
            setArrivalText('인동');
        } else if (btn_id === 3) {
            setArrivalText('옥계');
        }
    }

    const setDepartUpdate = (btn_id) => {
        // btn_id : 1 경운대학교, btn_id : 2 인동, btn_id : 3 옥계
        if (btn_id === 1) {
            setDepartText('경운대학교');
        } else if (btn_id === 2) {
            setDepartText('인동');
        } else if (btn_id === 3) {
            setDepartText('옥계');
        }
    }

    const setUpdate = () => {
        
        if ((data.ticket_name === '카풀') && (UserInfo.UserInfo[0].nickname === data.nickname)) {
            const myDoc = doc(db, "CollectionNameCarpoolTicket", "CarpoolTicketDocument");
            
            //console.log('ticket : ', data);
            updateDoc(myDoc, { CarpoolTicket : arrayRemove(data) });
            data.arrival_area = arrivalText;
            data.depart_area = departText;
            updateDoc(myDoc, {CarpoolTicket : arrayUnion(data)});
            alert('수정 하였습니다.');
            Read();
            showCarpoolTicket();
        }
        else if ((data.ticket_name === '택시') && (UserInfo.UserInfo[0].nickname === data.nickname)) {
            const myDoc = doc(db, "CollectionNameCarpoolTicket", "CarpoolTicketDocument");
            
            updateDoc(myDoc, { TaxiTicket : arrayRemove(data) });
            data.arrival_area = arrivalText;
            data.depart_area = departText;
            updateDoc(myDoc, {TaxiTicket : arrayUnion(data)});
            alert('수정 하였습니다.');
            Read();
            showTaxiTicket();
        }

    }

    // 수정 모드 : 수정을 출발지, 도착지만 수정 하겠다.
    const updateTextDisplay = () => {
    
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                <Text style={{fontSize: 22}}>수정 하기</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                    <Text style={{marginRight: 15, marginLeft: 25}}>출발지 선택</Text>
                    <Fontisto name="arrow-right-l" size={24} color="black" />
                    <TouchableOpacity style={{backgroundColor: '#315EFF', marginLeft: 10, marginRight: 10, padding: 5, borderRadius: 10}}onPress={() => setArrivalUpdate(1)}><Text style={{marginHorizontal: 10, color: '#FFFFFF'}}>경운대학교</Text></TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: '#315EFF', marginRight: 10, padding: 5, borderRadius: 10}}onPress={() => setArrivalUpdate(2)}><Text style={{marginHorizontal: 10, color: '#FFFFFF'}}>인동</Text></TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: '#315EFF', marginRight: 10, padding: 5, borderRadius: 10}}onPress={() => setArrivalUpdate(3)}><Text style={{marginHorizontal: 10, color: '#FFFFFF'}}>옥계</Text></TouchableOpacity>

                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                    <Text style={{marginRight: 10, }}>도착지 선택</Text>
                    <Fontisto name="arrow-right-l" size={24} color="black" />
                    <TouchableOpacity style={{backgroundColor: '#315EFF', marginLeft: 10, marginRight: 10, padding: 5, borderRadius: 10}}onPress={() => setDepartUpdate(1)}><Text style={{marginHorizontal: 10, color: '#FFFFFF'}}>경운대학교</Text></TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: '#315EFF', marginRight: 10, padding: 5, borderRadius: 10}}onPress={() => setDepartUpdate(2)}><Text style={{marginHorizontal: 10, color: '#FFFFFF'}}>인동</Text></TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: '#315EFF', marginRight: 10, padding: 5, borderRadius: 10}}onPress={() => setDepartUpdate(3)}><Text style={{marginHorizontal: 10, color: '#FFFFFF'}}>옥계</Text></TouchableOpacity>
                </View>
                <View style={{marginTop: 20, backgroundColor: '#315EFF', padding: 10, paddingHorizontal: 20, borderRadius: 13}}>
                    <TouchableOpacity onPress={() => setUpdate()}><Text style={{fontSize: 20, color: '#FFFFFF'}}>수정</Text></TouchableOpacity>
                </View>
            </View>
             
        );    
    }

    const RecruitmentCountOneColor = () => {
        if (data === undefined) {
            if (default_data.recruitment_count != 1) {
                return (
                    {
                        backgroundColor: '#C4C4C4',
                        padding: '2%', 
                        paddingHorizontal: '4.5%', 
                        borderRadius: 20
                    }
                )
            } else {
                return (
                    {
                        backgroundColor: '#315EFF',
                        padding: '2%',
                        paddingHorizontal: '4.5%',
                        borderRadius: 20
                    }
                )
            }
        } else {
            if (data.recruitment_count != 1) {
                return (
                    {
                        backgroundColor: '#C4C4C4',
                        padding: '2%', 
                        paddingHorizontal: '4.5%', 
                        borderRadius: 20
                    }
                )
            } else {
                return (
                    {
                        backgroundColor: '#315EFF',
                        padding: '2%',
                        paddingHorizontal: '4.5%',
                        borderRadius: 20
                    }
                )
            }
        }
    }
    const RecruitmentCountTwoColor = () => {
        if (data === undefined) {
            if (default_data.recruitment_count != 2) {
                return (
                    {
                        backgroundColor: '#C4C4C4',
                        padding: '2%', 
                        paddingHorizontal: '4.5%', 
                        borderRadius: 20
                    }
                )
            } else {
                return (
                    {
                        backgroundColor: '#315EFF',
                        padding: '2%',
                        paddingHorizontal: '4.5%',
                        borderRadius: 20
                    }
                )
            }
        } else {
            if (data.recruitment_count != 2) {
                return (
                    {
                        backgroundColor: '#C4C4C4',
                        padding: '2%', 
                        paddingHorizontal: '4.5%', 
                        borderRadius: 20
                    }
                )
            } else {
                return (
                    {
                        backgroundColor: '#315EFF',
                        padding: '2%',
                        paddingHorizontal: '4.5%',
                        borderRadius: 20
                    }
                )
            }
        }
    }
    const RecruitmentCountThreeColor = () => {
        if (data === undefined) {
            if (default_data.recruitment_count != 3) {
                return (
                    {
                        backgroundColor: '#C4C4C4',
                        padding: '2%', 
                        paddingHorizontal: '4.5%', 
                        borderRadius: 20
                    }
                )
            } else {
                return (
                    {
                        backgroundColor: '#315EFF',
                        padding: '2%',
                        paddingHorizontal: '4.5%',
                        borderRadius: 20
                    }
                )
            }
        } else {
            if (data.recruitment_count != 3) {
                return (
                    {
                        backgroundColor: '#C4C4C4',
                        padding: '2%', 
                        paddingHorizontal: '4.5%', 
                        borderRadius: 20
                    }
                )
            } else {
                return (
                    {
                        backgroundColor: '#315EFF',
                        padding: '2%',
                        paddingHorizontal: '4.5%',
                        borderRadius: 20
                    }
                )
            }
        }
    }
    const RecruitmentCountFourColor = () => {
        if (data === undefined) {
            if (default_data.recruitment_count != 4) {
                return (
                    {
                        backgroundColor: '#C4C4C4',
                        padding: '2%', 
                        paddingHorizontal: '4.5%', 
                        borderRadius: 20
                    }
                )
            } else {
                return (
                    {
                        backgroundColor: '#315EFF',
                        padding: '2%',
                        paddingHorizontal: '4.5%',
                        borderRadius: 20
                    }
                )
            }
        } else {
            if (data.recruitment_count != 4) {
                return (
                    {
                        backgroundColor: '#C4C4C4',
                        padding: '2%', 
                        paddingHorizontal: '4.5%', 
                        borderRadius: 20
                    }
                )
            } else {
                return (
                    {
                        backgroundColor: '#315EFF',
                        padding: '2%',
                        paddingHorizontal: '4.5%',
                        borderRadius: 20
                    }
                )
            }
        }
    }

    const RecruitmentCountTextOneColor = () => {
        if (data === undefined) {
            if (default_data.recruitment_count != 1) {
                return (
                    {
                        color: 'gray',
                        fontWeight: 'bold'
                    }
                );
            } else {
                return (
                    {
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                    }
                );
            }
        } else {
            if (data.recruitment_count != 1) {
                return (
                    {
                        color: 'gray',
                        fontWeight: 'bold'
                    }
                );
            } else {
                return (
                    {
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                    }
                );
            }
        }
    }


    const RecruitmentCountTextTwoColor = () => {
        if (data === undefined) {
            if (default_data.recruitment_count != 2) {
                return (
                    {
                        color: 'gray',
                        fontWeight: 'bold'
                    }
                );
            } else {
                return (
                    {
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                    }
                );
            }
        } else {
            if (data.recruitment_count != 2) {
                return (
                    {
                        color: 'gray',
                        fontWeight: 'bold'
                    }
                );
            } else {
                return (
                    {
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                    }
                );
            }
        }
    }

    const RecruitmentCountTextThreeColor = () => {
        if (data === undefined) {
            if (default_data.recruitment_count != 3) {
                return (
                    {
                        color: 'gray',
                        fontWeight: 'bold'
                    }
                );
            } else {
                return (
                    {
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                    }
                );
            }
        } else {
            if (data.recruitment_count != 3) {
                return (
                    {
                        color: 'gray',
                        fontWeight: 'bold'
                    }
                );
            } else {
                return (
                    {
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                    }
                );
            }
        }
    }

    const RecruitmentCountTextFourColor = () => {
        if (data === undefined) {
            if (default_data.recruitment_count != 4) {
                return (
                    {
                        color: 'gray',
                        fontWeight: 'bold'
                    }
                );
            } else {
                return (
                    {
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                    }
                );
            }
        } else {
            if (data.recruitment_count != 4) {
                return (
                    {
                        color: 'gray',
                        fontWeight: 'bold'
                    }
                );
            } else {
                return (
                    {
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                    }
                );
            }
        }
    }
    return (
        <Modal
            visible={ticketModalVisible}
            animationType={"fade"}
            transparent
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <TouchableWithoutFeedback
                    onPress={closeModal}
                >
                    <View style={styles.background}/>
                </TouchableWithoutFeedback>
                <Animated.View
                    style={{...styles.bottomSheetContainer, transform: [{ translateY: translateY }]}}
                    {...panResponders.panHandlers}
                >
                    <View style={styles.container}>
                        <View>
                            <View style={styles.start_local_container}>
                                <View style={styles.start_local}>
                                    <FontAwesome style={{backgroundColor: 'white',}} name="circle" size={15} color="#587DFF" />
                                    <View style={styles.start_text_container}>
                                        <Text style={styles.start_text}>출발지</Text>
                                    </View>
                                    <View style={styles.arrival_area_container}>
                                        <View style={styles.arrival_area}>
                                            <Text style={default_data.arrival_area != '항공관' ? {padding: 10, paddingHorizontal: 25, color: '#FFFFFF',fontWeight: 'bold'} : {padding: 10, paddingHorizontal: 20, color: '#FFFFFF',fontWeight: 'bold'}}>{data === undefined ? default_data.arrival_area : data.arrival_area}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.end_local}>
                                <FontAwesome style={{backgroundColor: 'white',}} name="circle" size={15} color="#587DFF" />
                                <View style={styles.end_text_container}>
                                    <Text style={styles.start_text}>도착지</Text>
                                </View>
                                <View style={styles.depart_area_container}>
                                    <View style={styles.depart_area}>
                                        <Text style={default_data.depart_area != '항공관' ? {padding: 10, paddingHorizontal: 25, color: '#FFFFFF',fontWeight: 'bold'} : {padding: 10, paddingHorizontal: 20, color: '#FFFFFF',fontWeight: 'bold'}}>{data === undefined ? default_data.depart_area : data.depart_area}</Text>
                                    </View>
                                </View>                            
                            </View>
                            <View style={styles.recruitment_count_container}>
                                <View style={styles.recruitment_count_text_container}>
                                    <Text style={styles.recruitment_count_text}>인원</Text>
                                </View>
                                <View style={styles.recruitment_count}>
                                    <View style={RecruitmentCountOneColor()}>
                                        <Text style={RecruitmentCountTextOneColor()}>1</Text>
                                    </View>
                                    <View style={RecruitmentCountTwoColor()}>
                                        <Text style={RecruitmentCountTextTwoColor()}>2</Text>
                                    </View>
                                    <View style={RecruitmentCountThreeColor()}>
                                        <Text style={RecruitmentCountTextThreeColor()}>3</Text>
                                    </View>
                                    <View style={RecruitmentCountFourColor()}>
                                        <Text style={RecruitmentCountTextFourColor()}>4</Text>
                                    </View>                                                            
                                </View>
                            </View>
                            <View style={styles.time_container}>
                                <View style={{flexDirection: 'row'}}>
                                    <View style={styles.arrival_time_text}>
                                        <Text style={{fontWeight: 'bold'}}>출발 시간</Text>
                                    </View>
                                    <View style={styles.arrival_time_container}>
                                        <Text>{data === undefined ? default_data.arrival_time : data.arrival_time}</Text>
                                    </View>
                                </View>
                    
                                <View style={{flexDirection: 'row', marginTop: '5%'}}>
                                    <View style={styles.estimated_time_text}>
                                        <Text style={{fontWeight: 'bold'}}>예상 소요시간</Text>
                                    </View>
                                    <View style={styles.estimated_time_conatainer}>
                                        <Text>{data === undefined ? default_data.departure_time : data.departure_time}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.driver_info_container}>
                                <View style={{marginLeft: '2%'}}>
                                    <Text style={{marginBottom: '10%', marginTop: '10%'}}>{data === undefined ? default_data.nickname : data.nickname}</Text>
                                    <Text>{data === undefined ? default_data.department : data.department}</Text>
                                </View>
                                <View style={styles.driver_charater}>
                                    <Text>조용히 갈게요</Text>
                                </View>
                            </View>
                            <View style={styles.recruitment_button_container}>
                                <View style={styles.button_container}>
                                    <TouchableOpacity onPress={addRecruitment} style={{width: '100%', alignItems: 'center'}}>
                                        <Text style={{fontWeight: 'bold'}}>탑승하기</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.4)"
    },
    background: {
        flex: 1,
    },
    bottomSheetContainer: {
        height: '60%',
        // justifyContent: "center",
        // alignItems: "center",
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,   
    },
    start_local_container: {
        marginTop: '4%'
    },
    start_local: {
        flexDirection: 'row',
        marginLeft: '4%',
        width: '90%',
        borderBottomWidth: 2,
        borderColor: '#C4C4C44F',
        padding: '2%',
        alignItems: 'center',
    },
    end_local: {
        flexDirection: 'row',
        marginLeft: '4%',
        width: '90%',
        borderBottomWidth: 2,
        borderColor: '#C4C4C44F',
        padding: '2%',
        alignItems: 'center'
        
    },
    start_text_container: {
        marginHorizontal: '2%',
    },
    start_text: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    end_text_container: {
        marginHorizontal: '2%',
    },
    end_text: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    arrival_area_container: {

    },
    arrival_area: {
        backgroundColor: '#315EFF',
        borderRadius: 15,
    },

    depart_area_container: {

    },
    depart_area: {
        backgroundColor: '#315EFF',
        borderRadius: 15,
    },
    recruitment_count_container: {
        marginLeft: '4%',
        width: '90%',
        padding: '2%',
        paddingTop: '5%',
        flexDirection: 'row',
    },
    recruitment_count_text_container: {
        backgroundColor: '#C4C4C4',
        borderRadius: 15,
        width: '20%', 
        height: 30, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    recruitment_count_text: {
        fontWeight: 'bold',
    },
    recruitment_count: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '65%',
        
    },
    time_container: {
        marginLeft: '4%',
        width: '90%',
        padding: '2%',
        paddingTop: '5%',
        paddingBottom: '5%',
    },
    arrival_time_text: {
        backgroundColor: '#C4C4C4',
        width: '20%',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15
    },
    arrival_time_container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '60%',
        marginLeft: '20.1%',
        borderBottomWidth: 2,
        borderColor: '#C4C4C44F'
    },
    estimated_time_text: {
        backgroundColor: '#C4C4C4',
        width: '25%',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15
    },
    estimated_time_conatainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '60%',
        marginLeft: '15.1%',
        borderBottomWidth: 2,
        borderColor: '#C4C4C44F'
    },
    driver_info_container: {
        marginLeft: '4%',
        width: '90%',
        paddingVertical: '8%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    driver_charater: {
        backgroundColor: '#C4C4C4',
        marginLeft: '32%',
        padding: '2%',
        borderRadius: 15
    },
    recruitment_button_container: {

        marginLeft: '4%',
        width: '90%',
        alignItems: 'center',
    },
    button_container: {
        backgroundColor: '#FFFFFF',
        width: '70%', height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10
    }
})

export default TicketBottomSheet;