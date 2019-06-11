import React from 'react';
import { Text,StyleSheet,View,PanResponder, Animated,Easing } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class SwipeCall extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            swipeText:null,
            moveY:0,
            pan: new Animated.ValueXY(),
            startAnim: new Animated.Value(0),
            startAnimationRunning:true,
            switchAnimToValue:false
        }
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      
            onPanResponderGrant: (evt, gestureState) => {
                this.state.pan.setValue({y:gestureState.dy});
                this.state.startAnim.stopAnimation(() => this.setState({startAnimationRunning:false}));
            },
            onPanResponderMove: (evt,gestureState) => {
                this.state.pan.setValue({y:gestureState.dy});
                if(this.state.moveY == 0) {
                    this.setState({moveY:gestureState.moveY});
                }
            },

            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
              if(gestureState.moveY > this.state.moveY) {
                    this.onSwipeDown();
              }else{
                    this.onSwipeUp();
              }
              this.setState({moveY:0});
              this.state.pan.setValue({y:gestureState.dy});
            },
            onPanResponderTerminate: (evt, gestureState) => { },
            onShouldBlockNativeResponder: (evt, gestureState) => {
              return true;
            },
          });
    }

    componentDidMount() {
        this.startAnimation();
    }

    componentWillUnmount() {
        this.state.pan.stopAnimation();
        this.state.startAnim.stopAnimation();
    }

    onSwipeUp = () => {
        this.props.answerTheCall();
    }

    onSwipeDown = () => {
        this.props.userEndedCall();
    }

    startAnimation = () => {
        this.setState(prevState => ({switchAnimToValue:!prevState.switchAnimToValue}),() => {
            const toValue = (this.state.switchAnimToValue)?0:-30;
            Animated.timing(
                this.state.startAnim,
                {
                    toValue,
                    duration:2000,
                    useNativeDriver: true
                }
            ).start(() => this.startAnimation())
        });
    }

    render() { 
        let { pan,startAnimationRunning,startAnim } = this.state;
        let [translateY] = (startAnimationRunning)?[startAnim]:[pan.y];

        let animateStyle = { transform: [{translateY}] };   
        return (
            <View style = {styles.SwipeGesture} {...this._panResponder.panHandlers}>
            <Animated.View style = {animateStyle}>
            <Text style = {styles.SwipeText}>Swipe up to Answer</Text>
            <View style = {styles.SwipeCallImage}>
                <Icon name = "video-camera" size = {25} color = "#56ACC6"></Icon>
            </View>
            </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
        SwipeGesture: {
            position:'absolute',
            width:'50%',
            height: '50%',
            bottom:'5%',
            borderColor: '#56ACC6',
            alignItems:'center',
            flexDirection:'column',
            justifyContent:'flex-end'
        },
        SwipeCallImage: {
             width:70,
             height:70,
             backgroundColor: '#fff',
             borderRadius:100,
             alignItems:'center',
             justifyContent:'center',  
        },
       SwipeText :{
        color:'#fff',   
        fontSize:15,
        marginBottom:15,
        textShadowColor: '#000',
        textShadowOffset: {width:0.5,height:0.5},
        textShadowRadius:3,
       }
});

export default SwipeCall;