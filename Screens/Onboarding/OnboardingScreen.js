import React from "react";
//import { Image } from "react-native-elements";

import Onboarding from 'react-native-onboarding-swiper';

const OnboardingScreen = ({navigation}) => {
    return (  
        <Onboarding
        onSkip={() => navigation.navigate("Login")}
        onDone={() => navigation.navigate("Login")}
        pages={[
        {
         backgroundColor: '#fff',
       //  image: <Image source={require('../../car-icon-vector.jpg')} />,
         title: 'Onboarding 12',
         subtitle: 'Done with React Native Onboarding Swiper',
        },
        {
          backgroundColor: '#fff',
      //    image: <Image source={require('../../car-icon-vector.jpg')} />,
          title: 'Onboarding 2',
          subtitle: 'Done with React Native Onboarding Swiper',
        },
        {
        backgroundColor: '#fff',
      //  image: <Image source={require('../../car-icon-vector.jpg')} />,
        title: 'Onboarding 3',
        subtitle: 'Done with React Native Onboarding Swiper',
        },
      ]}
      />
     )
    }

    export default OnboardingScreen;