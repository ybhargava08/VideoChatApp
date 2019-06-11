import React from 'react';
import {StyleSheet, Dimensions,Text, PanResponder,Animated} from 'react-native';
import { RTCView } from 'react-native-webrtc';
import { connect } from 'react-redux';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const marginTop = 0.07*height;
const marginLeft = 0.08*width;

class SecondaryView extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            pan: new Animated.ValueXY(),
            isAnimRunning:false,
             endX:0,
            endY:0,
            currTop:0,
            currLeft:0,
            initLeft:0,
            initTop:0,
        }
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => {
                return !this.state.isAnimRunning;
            },
            onStartShouldSetPanResponderCapture: (evt, gestureState) => {
                return !this.state.isAnimRunning;
            },
            
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return !this.state.isAnimRunning;
            },
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
                return !this.state.isAnimRunning;
            },
      
            onPanResponderGrant: (evt, gestureState) => {
                  this.state.pan.setOffset({x:this.state.endX,y:this.state.endY});
                  this.setState({currLeft:evt.nativeEvent.pageX - evt.nativeEvent.locationX});
                  this.setState({currTop:evt.nativeEvent.pageY - evt.nativeEvent.locationY});
            },
            onPanResponderMove: (evt,gestureState) => {
                const { dx,dy } = gestureState; 
                    this.state.pan.setValue({x:dx,y:dy});
            },

            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                const { dx,dy } = gestureState; 
            
                if(Math.abs(dx) > 2 || Math.abs(dy) > 2) {
                    
                 this.runAlignToCornerAnimation(this.getAnimValue('x',evt),this.getAnimValue('y',evt),700);

               } else{
                    this.onPressPan();
               }
            },
            onPanResponderTerminate: (evt, gestureState) => { },
            onShouldBlockNativeResponder: (evt, gestureState) => {
              return true;
            },
          });
    }

    runAlignToCornerAnimation = (x,y,duration) => {
        this.setState({isAnimRunning:true},() => {
            Animated.timing(
                this.state.pan,
                {
                    toValue: {x,y},
                    duration,
                    useNativeDriver: true
                }
            ).start(() => {
                this.setState({endX:this.state.pan.x._offset+x});
                this.setState({endY:this.state.pan.y._offset+y});
                this.setState({isAnimRunning:false});
            });
        });
    }
    getAnimValue = (type,evt) => {
        if(type === 'x') {
              if(evt.nativeEvent.pageX < width/2) {
                  return marginLeft-this.state.currLeft;
              }else{
                  return this.state.initLeft - this.state.currLeft;  
              }    
        }else{
            if(evt.nativeEvent.pageY < height/2) {
                return marginTop-this.state.currTop;
            }else{
                return this.state.initTop - this.state.currTop;  
            }
        }
    }

    onPressPan = () => {
        console.log('onPressPan was triggered');
        this.props.reverseStreams();
    }

    setDimensionsOnInit = (layout) => {
           const { x,y } = layout;
           this.setState({initLeft:x});
           this.setState({initTop:y});
    }

    showHideSecondaryVideo = () => { 
            let { pan } = this.state;
            let [translateX,translateY] = [pan.x,pan.y];
            let panAnimation = {transform :[{translateX},{translateY}]};

        if((this.props.isVideoMuted && !this.props.isPrimaryStreamLocal) 
            || (this.props.isPrimaryStreamLocal && !this.props.remoteVideoStatus)) {
                const noVidFrom = (!this.props.isPrimaryStreamLocal && !this.props.remoteVideoStatus)
                ?'from '+this.props.connectedUser.name:'';
                return (
                 <Animated.View style = {{...styles.noVidStyle,...panAnimation}} {...this._panResponder.panHandlers}
                    onLayout = {(e) => this.setDimensionsOnInit(e.nativeEvent.layout)}>       
                        <Text style = {styles.textStyle}>No Video {noVidFrom}</Text>
                </Animated.View>)
        }else{
            return (
            <Animated.View style = {{...styles.touchable,...panAnimation}} {...this._panResponder.panHandlers}
              onLayout = {(e) => this.setDimensionsOnInit(e.nativeEvent.layout)}>       
                <RTCView objectFit = 'cover' zOrder = {2} style = {styles.remoteRTC} streamURL = {this.props.rawRemoteStream}></RTCView>
             </Animated.View>)
        } 
    }

    render() {
        return (
               <React.Fragment>
                   {this.showHideSecondaryVideo()}
               </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isVideoMuted:state.isVideoMuted,
        isPrimaryStreamLocal:state.isPrimaryStreamLocal,
        remoteVideoStatus:state.remoteVideoStatus,
        connectedUser: state.connectedUser
    };
}

export default connect(mapStateToProps,null)(SecondaryView);

const styles = StyleSheet.create({
      touchable: {
        bottom:'7%',
        right:'8%',  
        height:height/5,
        width: width/3.5,        
        position:'absolute',
        backgroundColor: '#fff',
        elevation:30,
        borderRadius: 25
    },
    noVidStyle: {
        bottom:'5%',
        right:'5%',  
        height:height/5,
        width: width/4,        
        position:'absolute',
        backgroundColor: '#505050',
        borderRadius:25,
        alignItems: 'center',
        justifyContent:'center',
        elevation:30
    },
    textStyle: {
        color: '#fff'
    },
    remoteRTC: {
        flex:1,
        borderRadius: 25
      }
  });