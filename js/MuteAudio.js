import React from 'react';
import { connect } from 'react-redux';
import { flipAudioStatus } from './reduxstate/action';
import { TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { sendWSMessage, doAnimate } from './generalFunc';
import { REMOTE_AUDIO_STATUS } from './reduxstate/reduxConstants';

const totalHeight = Dimensions.get('window').height;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

class MuteAudio extends React.Component {
    
       constructor(props) {
           super(props);
           this.state = {
            anim:new Animated.Value(0),
            bgColor: '#56ACC6'
        }
       }

       shouldComponentUpdate(nextProps,nextState){
           return nextProps.showScreenButtons !== this.props.showScreenButtons 
             || nextProps.isAudioMuted!==this.props.isAudioMuted || nextState.bgColor!==this.state.bgColor;
       }

       muteUnmuteAudioIcon = () => {
           const color = (this.state.bgColor === '#56ACC6')?'#d3d3d3':'#56ACC6';
                return (<Icon name = 'microphone-slash' size = {20} color = {color}></Icon>);
       }

       muteAudio = () => {
           this.props.flipAudioStatus();
           if(this.props.rawLocalStream){
                this.props.rawLocalStream.getAudioTracks()[0].enabled = !this.props.rawLocalStream.getAudioTracks()[0].enabled;
                sendWSMessage(this.props.ws,REMOTE_AUDIO_STATUS,this.props.currentUser,this.props.connectedUser,
                    this.props.rawLocalStream.getAudioTracks()[0].enabled);
           }

           if(this.state.bgColor === '#56ACC6') {
               this.setState({bgColor:'#d3d3d3'});
           }else{
            this.setState({bgColor:'#56ACC6'});
           }
           this.props.controlShowHideScreenButtons();
       }

       
    doAnimate = () => {
        if(this.props.showScreenButtons){
            doAnimate(Animated,this.state.anim,0,600,1000,'muteaudio');
        }else{
            doAnimate(Animated,this.state.anim,100,600,1000,'muteaudio');   
        }
    }


       render() {
             let { anim } = this.state;
             let translateAnim = {transform: [{translateX:anim}]};   
             const bgColor = {backgroundColor:this.state.bgColor};
           return (
            <AnimatedTouchable style = {{...styles.AudioIcons,...translateAnim,...bgColor}} 
                       onPress = {() => this.muteAudio()}>
               {this.muteUnmuteAudioIcon()}
            </AnimatedTouchable>
           );
       }
}

const mapStateToProps = state => {
    return {
        isAudioMuted: state.isAudioMuted,
        rawLocalStream:state.rawLocalStream,
        currentUser: state.currentUser,
        connectedUser: state.connectedUser
      };
}

const mapDispatchToProps = (dispatch) => {
    return {
          flipAudioStatus: () => dispatch(flipAudioStatus())
    }};

    const styles = StyleSheet.create({
        AudioIcons:{
            position:'absolute',
            top:'55%',
            right:'5%',
            alignItems:'center',
            justifyContent:'center',
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

export default connect(mapStateToProps,mapDispatchToProps)(MuteAudio);