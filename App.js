import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Main from "./Screens/Main/Main"; // 메인 화면
import LoginScreen from './Screens/Login/LoginScreen'; // 학번로그인 일경우 학번 로그인 화면으로 전환 
import SignUpScreen from "./Screens/Login/SignUpScreen"; // 회원가입 페이지
import ProfileScreen from "./Screens/Profile/ProfileScreen"; // 프로필 화면 페이지
import FixProfileScreen from "./Screens/Profile/FixProfileScreen";
import TicketCreatScreen from "./Screens/TicketScreen/TicketCreatScreen";

const Stack = createStackNavigator();

export default class App extends React.Component {
  

    render() {

        return (
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{ 
                headerShown: false,
                animationEnabled: false
              }}
            > 
              <Stack.Screen name="StudendNumberLoginScreen" component={LoginScreen} /> 
              <Stack.Screen name="SignUpScreen" component={SignUpScreen} /> 
              <Stack.Screen name="Main" component={Main} />
              <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
              <Stack.Screen name="FixProfileScreen" component={FixProfileScreen} />
              <Stack.Screen name="TicketCreatScreen" component={TicketCreatScreen} />
              
            </Stack.Navigator>
          </NavigationContainer>
        );
    }
}