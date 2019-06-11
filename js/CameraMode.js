import React from 'react';
import { StyleSheet, TouchableOpacity, Dimensions,Animated } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { doAnimate } from './generalFunc';

const totalHeight = Dimensions.get('window').height;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity); 

class CameraMode extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            anim:new Animated.Value(0)
        }
    }

    shouldComponentUpdate(nextProps,nextState){
        console.log('in should comp update camera mode next props '+nextProps.showScreenButtons
           +' curr props '+this.props.showScreenButtons);
        return nextProps.showScreenButtons !== this.props.showScreenButtons;
    }

    handleCameraModeChange = () => {
        console.log('calling handleCameraModeChange');
        //this.props.controlShowHideScreenButtons();
        this.props.rawLocalStream.getVideoTracks().forEach(track => {
            track._switchCamera();
        });
    }

    doAnimate = () => {
        console.log('do animate triggered '+this.props.showScreenButtons);
        if(this.props.showScreenButtons){
            doAnimate(Animated,this.state.anim,0,600,0,'camera mode');
        }else{
            doAnimate(Animated,this.state.anim,100,600,0,'camera mode');   
        }
    }

    render() {
         let { anim } = this.state;
         let translateAnim = {transform: [{translateX:anim}]};   
        return (
            <AnimatedTouchable style={{...styles.RotateCameraIcons,...translateAnim}} 
                   onPress={() => { this.handleCameraModeChange() }}>
                <IonIcon name='ios-reverse-camera' size={25} color='#d3d3d3'></IonIcon>
            </AnimatedTouchable>
        );
    }
}

const mapStateToProps = state => {
    return {
        rawLocalStream: state.rawLocalStream
    };
}

export default connect(mapStateToProps, null)(CameraMode);

const styles = StyleSheet.create({
    RotateCameraIcons: {
        position: 'absolute',
        top: '35%',
        right: '5%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#56ACC6',
        width: totalHeight/13.2,
        height: totalHeight/13.2,
        borderRadius: 100,
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