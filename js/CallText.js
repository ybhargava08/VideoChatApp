import React from 'react';
import { View,Text,StyleSheet } from 'react-native';
import { CALLING,DIALLING,INCOMING_CALL } from './constants';

const CallText = (props) => {

    showVidStatus = () => {
        if(props.isCallInitiator && CALLING === props.callText){
              const textStyle = {fontSize: 25,color:'#F0F0F0'};
              return (
                  <View style = {{justifyContent: 'center',alignItems: 'center'}}>
                      <Text style = {{...styles.TextShadow,...textStyle}}>Your video is visible..</Text>
                  </View>
              );
        } 
        return null;
    }

    showNameText = () => {
          const textStyle = {fontSize: 40,color:'#fff'};
          if(props.callText === DIALLING || CALLING === props.callText || INCOMING_CALL === props.callText) {
              return (
                    <View style = {{justifyContent: 'center',alignItems: 'center'}}>
                     <Text style = {{...textStyle,...styles.TextShadow}}>{props.connectedUser.name}</Text>
                     {this.showVidStatus()}
                     </View>
              );
          }
          return null;
    }

    showText = () => {
        if(props.callText) {
            return(
                <View style = {styles.CallView}>
                     <View style = {{justifyContent: 'center',alignItems: 'center'}}>
                     <Text style = {{...styles.TextView,...styles.TextShadow}}>{props.callText}</Text>
                     </View>
                     {this.showNameText()}
                </View>
            );
        }         
    }

    return (
         <React.Fragment>
            {this.showText()}
         </React.Fragment>
    );
}

export default CallText;

const styles = StyleSheet.create({
    
    CallView:{
        position:'absolute',
        top:'5%',
        justifyContent:'space-between',
        flexDirection: 'column',
        elevation: 10
      },
    TextView: {
         color:'#fff',
         fontSize: 25,
         padding: 15 
    },
    TextShadow: {
        textShadowColor: '#000',
        textShadowOffset: {width:0.5,height:0.5},
        textShadowRadius:3,
        fontFamily: 'sans-serif-medium'
    }
  });