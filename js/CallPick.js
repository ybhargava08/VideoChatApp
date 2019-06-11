import React from 'react';
import {StyleSheet,TouchableHighlight,View, Dimensions} from 'react-native';
import  MatIcon from 'react-native-vector-icons/MaterialIcons';
import { getDimensions } from'./generalFunc';

const totalWidth = Dimensions.get('window').width;
const totalHeight = Dimensions.get('window').height;

const CallPick = (props) => {

      showHideCallEndButton = () => {
            if(props.showCallPickButton) {
                return (
                    <View style = {styles.PickCallButtonIcon} onLayout={(e) => getDimensions(e.nativeEvent.layout,
                        totalWidth, totalHeight)}>
                    <TouchableHighlight  onPress = {() => props.answerTheCall()}>
                         <MatIcon name ='call' size = {20} color = '#fff'/>
                    </TouchableHighlight>
                    </View>
                );
            }
            return null;
      }

      return (
          <React.Fragment>
               {this.showHideCallEndButton()}
          </React.Fragment>
      );
}

const styles = StyleSheet.create({
   PickCallButtonIcon:{
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'green',
        width:totalHeight/13.2,
        height:totalHeight/13.2,
        borderRadius:100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
      }  
  }); 

export default CallPick;