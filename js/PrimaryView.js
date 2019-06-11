import React, { Component } from 'react';
import { StyleSheet, Text, Dimensions, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { RTCView } from 'react-native-webrtc';
import { captureRawLocalStream } from './reduxstate/action';
import { captureCameraFeed } from './generalFunc';

const totalHeight = Dimensions.get('window').height;
const totalWidth = Dimensions.get('window').width;

class PrimaryView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            elemWidth:0,
            elemHeight: 0,
        }
    }

    componentDidMount() {
        this.startCameraFeed('user');
    }

    startCameraFeed = async (cameraFacingMode) => {
        this.props.captureRawLocalStream(
            await captureCameraFeed(cameraFacingMode,this.state.elemWidth,this.state.elemHeight)
            );
    }

    setDimensions = (layout) => {
             const { width,height } = layout;
             this.setState({elemWidth:width});
             this.setState({elemHeight:height});
    }

    handlesPress = () => {
        this.props.controlShowHideScreenButtons();
    }

    showHidePrimaryVideo = () => {
        console.log('primary view '+this.props.isVideoMuted+" "+this.props.isPrimaryStreamLocal+' '+this.props.remoteVideoStatus);
        if ((this.props.isVideoMuted && this.props.isPrimaryStreamLocal) || (!this.props.isPrimaryStreamLocal
            && !this.props.remoteVideoStatus)) {
            const noVidFrom = (!this.props.isPrimaryStreamLocal && !this.props.remoteVideoStatus)
            ?'from '+this.props.connectedUser.name:'';  
            return (<TouchableOpacity style = {styles.noVidStyle} onPress = {() => {this.handlesPress()}}>
                <Text style={styles.noVidTextStyle}>No Video {noVidFrom}</Text>
            </TouchableOpacity>)
        } else {
            return (
            <TouchableOpacity onPress = {() => {this.handlesPress()}}>
                    <RTCView objectFit = 'cover' zOrder = {1} style={styles.localRtc} 
                        onLayout = {(e) => this.setDimensions(e.nativeEvent.layout)}
                        streamURL={this.props.rawLocalStream}></RTCView>
            </TouchableOpacity>
            );
        }
    }


    render() {
        return (
            <React.Fragment>
                {this.showHidePrimaryVideo()}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isVideoMuted: state.isVideoMuted,
        isPrimaryStreamLocal: state.isPrimaryStreamLocal,
        remoteVideoStatus: state.remoteVideoStatus,
        connectedUser: state.connectedUser,
        rawRemoteStream: state.rawRemoteStream
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        captureRawLocalStream: (stream) => dispatch(captureRawLocalStream(stream))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PrimaryView);

const styles = StyleSheet.create({
    localRtc: {
        width:  totalWidth,
        height: totalHeight,
        backgroundColor: '#000',
    },
    noVidStyle: {
        width: 1.06 * totalWidth,
        height: totalHeight,
        backgroundColor: '#505050',
        alignItems: 'center',
        justifyContent:'center'
    },
    noVidTextStyle : {
        color: '#fff',
        fontSize: 20, 
    }
});