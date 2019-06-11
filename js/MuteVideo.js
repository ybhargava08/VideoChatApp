import React from 'react';
import { connect } from 'react-redux';
import { flipVideoStatus } from './reduxstate/action';
import { TouchableOpacity,StyleSheet, Dimensions,Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { sendWSMessage,doAnimate } from './generalFunc';
import { REMOTE_VIDEO_STATUS } from './reduxstate/reduxConstants';

const totalHeight = Dimensions.get('window').height;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

class MuteVideo extends React.Component {
    
       constructor(props) {
           super(props);
           this.state = {
            anim:new Animated.Value(0),
            bgColor: '#56ACC6'
        }
       }

       
       shouldComponentUpdate(nextProps,nextState){
        return nextProps.showScreenButtons !== this.props.showScreenButtons 
          || nextProps.isVideoMuted!==this.props.isVideoMuted || nextState.bgColor!==this.state.bgColor;
    }

       muteUnmuteVideoIcon = () => {
            const color = (this.state.bgColor === '#56ACC6')?'#d3d3d3':'#56ACC6';
                return (<Icon name = 'video-slash' size = {20} color = {color}></Icon>)
       }

       muteVideo = () => {
        this.props.flipVideoStatus();
        if(this.props.rawLocalStream){
            this.props.rawLocalStream.getVideoTracks()[0].enabled = !this.props.rawLocalStream.getVideoTracks()[0].enabled;
            sendWSMessage(this.props.ws,REMOTE_VIDEO_STATUS,this.props.currentUser,this.props.connectedUser,
                this.props.rawLocalStream.getVideoTracks()[0].enabled);
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
            doAnimate(Animated,this.state.anim,0,600,500,'mutevideo');
        }else{
            doAnimate(Animated,this.state.anim,100,600,500,'mutevideo');   
        }
    }

       render() {
            let { anim } = this.state;
            let translateAnim = {transform: [{translateX:anim}]};   
            const bgColor = {backgroundColor:this.state.bgColor};    
           return (
            <AnimatedTouchable style = {{...styles.VideoIcons,...translateAnim,...bgColor}} 
                        onPress = {() => this.muteVideo()}> 
               {this.muteUnmuteVideoIcon()}
            </AnimatedTouchable>
           );
       }
}

const mapStateToProps = state => {
    return {
        isVideoMuted: state.isVideoMuted,
        rawLocalStream:state.rawLocalStream,
        currentUser: state.currentUser,
        connectedUser: state.connectedUser
      };
}

const mapDispatchToProps = (dispatch) => {
    return {
        flipVideoStatus: () => dispatch(flipVideoStatus())
    }};

export default connect(mapStateToProps,mapDispatchToProps)(MuteVideo);

const styles = StyleSheet.create({
        VideoIcons:{
            position:'absolute',
            top:'45%',
            right:'5%',
            alignItems:'center',
            justifyContent:'center',
            backgroundColor:'#56ACC6',
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