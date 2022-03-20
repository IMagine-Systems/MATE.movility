//import 순서는 react, navigation, stack, text view ... , 다음은 계속해서 바뀌면서 순위 설정
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-gesture-handler";                            //손가락 제스처 관련 파일

import OnboardingScreen from "./Screens/Onboarding/OnboardingScreen"; 
import Login from "./Screens/Login/LoginScreen"; 

const Stack = createStackNavigator();

export default class App extends React.Component {
    
    render() {
        return (
          <NavigationContainer>
            <Stack.Navigator creenOptions={{ headerShown: false }}> 
            
              <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
              <Stack.Screen name="Login" component={Login} />

            </Stack.Navigator>
          </NavigationContainer>
        );
    }
}
