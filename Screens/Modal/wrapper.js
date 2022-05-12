import React, { Children } from "react";

import{TouchableWithoutFeedback,Keyboard,KeyboardAvoidingView, ScrollView} from "react-native";

const wrapper =()=>{
    return(
        <KeyboardAvoidingView style={{flex:1}}>
            <ScrollView>
                <TouchableWithoutFeedback onPress={keyboard.dismiss}>
                    {Children}
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default warapper;