import React from 'react';
import {StyleSheet,TouchableOpacity, Dimensions, Animated} from 'react-native';
import  MatIcon from 'react-native-vector-icons/MaterialIcons';
import { doAnimate } from './generalFunc';

const totalHeight = Dimensions.get('window').height;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

class CallEnd extends React.Component {

      constructor(props) {
          super(props);
          this.state = {
              anim: new Animated.Value(0)
          }
      }

      shouldComponentUpdate(nextProps,nextState) {
          return nextProps.showCallEndButton!==this.props.showCallEndButton 
                  || nextProps.callInProgress !== this.props.callInProgress
                  || nextProps.showScreenButtons !== this.props.showScreenButtons;
      }

      showHideCallEndButton = () => {
            if(this.props.showCallEndButton) {
                let { anim } = this.state;
                let translateAnim = {transform: [{translateX:anim}]};   
                return (
                   <AnimatedTouchable style = {{...styles.EndCallButtonIcon,...translateAnim}} 
                         onPress = {() => {this.props.userEndedCall(true)}}>
                         <MatIcon name ='call-end' size = {20} color = '#fff'/>
                    </AnimatedTouchable>
                );
            }
            return null;
      }

      doAnimate = () => {
       if(this.props.callInProgress) {
            if(this.props.showScreenButtons){
                doAnimate(Animated,this.state.anim,0,600,500,'endcall');
            }else{
                doAnimate(Animated,this.state.anim,100,600,500,'endcall');   
            }
       }   
    }

      render() {
        return (
            <React.Fragment>
                 {this.showHideCallEndButton()}
            </React.Fragment>
        );
      }
}

const styles = StyleSheet.create({
   EndCallButtonIcon:{
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'red',
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

export default CallEnd;