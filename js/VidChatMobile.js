import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import { RTCPeerConnection,RTCIceCandidate,RTCSessionDescription} from 'react-native-webrtc';
import KeepAwake from 'react-native-keep-awake';
import { JOINED,LEFT,ICECANDIDATE,OFFER,ANSWER,config,CALLING,DIALLING,INCOMING_CALL,
    END_CALL, CALL_STATE_CALLING,CALL_STATE_CONNECTED,CALL_STATE_DIALLING,wsURL,fetchURL,
    BUSY_ON_CALL,USERUPDATES, CALL_NOT_ANSWERED } from './constants';
import MuteAudio from './MuteAudio';
import MuteVideo from './MuteVideo';
import PrimaryView from './PrimaryView';
import SecondaryView from './SecondaryView';
import CameraMode from './CameraMode';
import CallEnd from './CallEnd';
import CallPick from './CallPick';
import CallText from './CallText';
import OnlineUsers from './OnlineUsers';
import SwipeCall from './SwipeCall';
import { connect } from 'react-redux';
import { getStreamURL, sendWSMessage, addSound, playStopSound } from './generalFunc';
import { captureRawRemoteStream,capturePeerConn,flipPrimaryStream,setRemoteVideoStatus,resetParams,
    updateCurrentUser,updateConnectedUser,
    addOnlineUser,removeOnlineUser,changeCallText,changeSoundClip } from './reduxstate/action';
import InCallManager from 'react-native-incall-manager';    
import { REMOTE_VIDEO_STATUS, REMOTE_AUDIO_STATUS } from './reduxstate/reduxConstants';

const callCancelTime = 30000;

const wsReconnectTimer = 5000;

let wsConnectTimeout;

let showScreenButtonsTimeout;

class VidChatMobile extends Component{
    
    constructor(props) {
        super(props);
        this.state = {
            ws:null,
            showCallEndButton:false,
            showCallPickButton:false,
            callInProgress:false,
            isCallInitiator:false,
            callTimer:null,
            disconnectTimer:null,
            userEndedCall: false,
            callStart:false,
            showGestureCall:false,
            showScreenButtons:true
        }
    }

    componentDidMount() {
        
        this.props.updateCurrentUser({id:this.props.user.id,name:this.props.user.name});

                this.startWS();    
                
                this.controlShowHideScreenButtons();

              //  InCallManager.setForceSpeakerphoneOn(true);
              //  InCallManager.start({media:'audio',ringback:'_DTMF_'});
    }

    retryWSConnect = () => {
        
         wsConnectTimeout = setTimeout(() => {
                if(!this.state.ws || (this.state.ws && this.state.ws.readyState === WebSocket.CLOSED)) {
                        this.startWS();
                }
         },wsReconnectTimer);
 
    }

    startWS = () => {
        const ws = new WebSocket(wsURL);

        this.setState({ws},() => {
            ws.onopen = () => {
                if(wsConnectTimeout) {
                    clearTimeout(wsConnectTimeout);
                }
                this.fetchOnlineUsers(); 
                sendWSMessage(ws,JOINED,this.props.currentUser,this.props.connectedUser,null);
            };
            ws.onerror = (e) => {
                 console.log(e);
                 this.props.addOnlineUser([],'replace');
                 this.retryWSConnect();
            };
            
            KeepAwake.activate();
            this.handleWsMessages(ws);
        });
    }


    fetchOnlineUsers = async () => {
           try{
            const resp = await fetch(fetchURL,{method:'GET'});
            const jsonResp = await resp.json(); 
            console.log('got resp '+JSON.stringify(jsonResp));
            let list =  jsonResp;
            list = list.filter(item => item.id != this.props.currentUser.id);
            this.props.addOnlineUser(list,'replace');
           }catch(err) {
               console.log('got error '+err);
           } 
        

    }

    componentWillUnmount() {
        if(this.props.peerConnection) {
            this.props.peerConnection.close();
        }
        if(this.state.ws){
            this.state.ws.close(); 
        }
        this.props.resetParams();
    }

    initiateCallBacks = () => {

        this.props.peerConnection.onaddstream = (evt) => {
            InCallManager.setSpeakerphoneOn(true);
            
                this.props.captureRawRemoteStream(evt.stream);
  
                if(this.state.isCallInitiator){
                     this.invokeCallStages(CALL_STATE_CONNECTED);
                }else{
                    this.setState({showGestureCall:true},() => {
                        this.invokeCallStages(CALL_STATE_CALLING);
                    });
                }
                this.reverseStreams();
   }

   this.props.peerConnection.onnegotiationneeded = (evt) => {
         console.log('in onnegotiationneeded signal state'+this.props.peerConnection.signalingState);
          if(this.props.peerConnection.signalingState === 'stable'){
                    this.createOffer();
          }          
   }

   this.props.peerConnection.onicecandidateerror = (e) => {
       console.log('in onicecandidateerror '+JSON.stringify(e));
   }

   this.props.peerConnection.onicegatheringstatechange = (e) => {
     console.log('in onicegatheringstatechange '+e.target.iceGatheringState);  
     if(e.target.iceGatheringState === 'gathering' && this.state.isCallInitiator){
            console.log('ice gathering call state dialling invoked');
             this.invokeCallStages(CALL_STATE_DIALLING);
     }
 }

   this.props.peerConnection.onsignalingstatechange = (e) => {
       console.log('signal state is '+this.props.peerConnection.signalingState);
     if(this.props.peerConnection.signalingState === 'have-remote-offer') {
              this.setState({userEndedCall:false},() => {
                this.createAnswerForOffer();
              });
     }else if(this.props.peerConnection.signalingState === 'have-local-offer') {
        console.log('have local offer call state dialling invoked');
        this.invokeCallStages(CALL_STATE_DIALLING);
     }   
   }

   this.props.peerConnection.onconnectionstatechange = (e) => {
     console.log('in onconnectionstatechange '+JSON.stringify(e)+" "+this.props.peerConnection.connectionState);
     if(this.props.peerConnection){
        switch(this.props.peerConnection.connectionState){
            case "failed":
                this.endCall('connection state failed');
        }
     }
   }

   this.props.peerConnection.onicecandidate = (evt) => {
           if(evt.candidate){
                       sendWSMessage(this.state.ws,ICECANDIDATE,this.props.currentUser,this.props.connectedUser,evt.candidate);          
           }  
   }

   this.props.peerConnection.oniceconnectionstatechange = (e) => {
        
            const iceState = e.target.iceConnectionState;
            console.log('ice state '+iceState);
            switch(iceState) {
                case 'disconnected':
                        if(!this.state.userEndedCall) {
                            this.startCancelDisconnectTimer('ice state disconnected','start');
                        }
                case 'failed':
                if(!this.state.userEndedCall) {
                    this.endCall('ice state failed');
                }
                case 'connected': 
                    console.log('ice state connected called'); 
            }
   }
}

    setCallInit = (user) => {
        this.setState({isCallInitiator:true});
        this.waitForUpdatingConnUser(user);
        this.createPeerConnection(true);
    }

    startCancelCallTimer = (type) => {
        if (type === 'cancel' && this.state.callTimer) {
            console.log('cancelling  timer for call timer '+' at '+new Date());
                 clearTimeout(this.state.callTimer);
        }else if(type === 'start'){
                console.log('starting  timer for call timer '+' at '+new Date());
                if(this.state.callTimer) {
                    clearTimeout(this.state.callTimer);
                }
                this.setState({callTimer: setTimeout(
                       () => {
                           this.handleUserStatus(CALL_NOT_ANSWERED,this.props.connectedUser.name);
                           this.endCall('cancelcalltimer');                            
                       },callCancelTime 
                )})
        }

    } 

    handleWsMessages = (ws) => {
        ws.onmessage = (e) => {
           let msg = JSON.parse(e.data);
           console.log('got message type '+msg.type);
           if(msg.type === JOINED) {
                    if(msg.user.id !==this.props.currentUser.id) {
                        this.props.addOnlineUser(msg.user,'add');
                    }
          
                }else if(msg.type === LEFT) {
                            this.props.removeOnlineUser(msg.id);
                }else if(msg.type === ICECANDIDATE){
                if(!this.props.peerConnection) {
                    this.createPeerConnection(false);
                }
                this.waitForUpdatingConnUser(msg.currentUser);                
                
                if(msg.payload && this.props.peerConnection.remoteDescription) {
                    const ice = new RTCIceCandidate(msg.payload);
                    this.props.peerConnection.addIceCandidate(ice).then(()=>{})
                    .catch(e => {console.log('error adding ice candiate '+e)}); 
                }
            }else if(msg.type === OFFER) {

                if(!this.props.peerConnection) {
                    this.createPeerConnection(false);    
                }
                if (this.props.peerConnection.iceConnectionState === 'connected' 
                && this.props.connectedUser.id && this.props.connectedUser.id !== msg.currentUser.id) {
                        console.log('got call offer from another user '+msg.currentUser.name);
                        sendWSMessage(this.state.ws,USERUPDATES,this.props.currentUser,msg.currentUser,BUSY_ON_CALL);
                }else{
                    console.log('got call offer in else '+msg.currentUser.name);
                    this.waitForUpdatingConnUser(msg.currentUser);
                    this.acceptOffer(msg);                  
                }
            }else if(msg.type === ANSWER) {
                  this.applyAnswer(msg);
                
            }else if(msg.type === REMOTE_VIDEO_STATUS) {
                    this.waitForUpdatingConnUser(msg.currentUser);
                   this.props.setRemoteVideoStatus(Boolean(msg.payload));
            }else if(msg.type === REMOTE_AUDIO_STATUS){
                this.waitForUpdatingConnUser(msg.currentUser);
                if(this.state.callInProgress) {
                    this.setAudioStatus(Boolean(msg.payload));
                }
            }
            else if (msg.type === END_CALL) {
                   this.userEndedCall(false);
            }else if (msg.type === USERUPDATES) {
                this.handleUserStatus(String(msg.payload),msg.currentUser.name);
            }
    } 
}

   handleUserStatus = (status,name) => {
            
            if (BUSY_ON_CALL === status) {
                   console.log(name +' is busy');
                   this.props.changeCallText(name+' is busy ');
                   addSound('busy.mp3');
                   setTimeout(() => {
                        this.endCall();
                   },15000);
            }else if(CALL_NOT_ANSWERED === status) {
                console.log(name +' - missed call ');
            }
   }

   setAudioStatus = (remoteAudioStatus) => {
                let text; 
                if(remoteAudioStatus) {
                     text = this.props.connectedUser.name+' unmuted audio';
                }else{
                     text = this.props.connectedUser.name+' muted audio';    
                }
                this.props.changeCallText(text);
                setTimeout(() => {
                    this.props.changeCallText(null);
                },8000);
   }
   
    applyAnswer = async (msg) => {
        if(!this.props.peerConnection) {
            this.createPeerConnection(false);
        }
        this.waitForUpdatingConnUser(msg.currentUser);
            const sessionDesc = new RTCSessionDescription(msg.payload);
             await this.props.peerConnection.setRemoteDescription(sessionDesc);
             this.invokeCallStages(CALL_STATE_CALLING);
    }

    createPeerConnection = async (isOfferCreationNeeded) => {
             await this.creatingPeerConnection(isOfferCreationNeeded);
    }

    creatingPeerConnection = async (isOfferCreationNeeded) => {
         new Promise((resolve,reject) => {
             
            this.props.capturePeerConn(new RTCPeerConnection(config)).then(() => {
                if(isOfferCreationNeeded && this.props.rawLocalStream){
                    console.log('adding raw stream '+this.props.rawLocalStream.toURL()); 
                    this.props.peerConnection.addStream(this.props.rawLocalStream);
            }
                this.initiateCallBacks();   
                resolve();
            });
         });
    }

    waitForUpdatingConnUser = async (connectedUser) => {
             await this.props.updateConnectedUser(connectedUser);
    }

     createOffer = async () => {
        console.log('started offer creation');

        const offer = await this.props.peerConnection.createOffer();
        await this.props.peerConnection.setLocalDescription(offer);
        console.log('local offer after await is '+this.props.peerConnection.localDescription);
        sendWSMessage(this.state.ws,OFFER,this.props.currentUser,this.props.connectedUser,this.props.peerConnection.localDescription);
    }

    acceptOffer = (msg) => {
        console.log('creating asnwer');
        if(msg.payload){
            const sessionDesc = new RTCSessionDescription(msg.payload);
            this.props.peerConnection.setRemoteDescription(sessionDesc);
        }
    }

    createAnswerForOffer = async () => {
       
       const answer = await this.props.peerConnection.createAnswer();
       await this.props.peerConnection.setLocalDescription(answer);
       sendWSMessage(this.state.ws,ANSWER,this.props.currentUser,this.props.connectedUser,this.props.peerConnection.localDescription);
    }

    answerTheCall = () => {
        addSound('call_pick.m4a',0);
           this.setState({showGestureCall:false});
           if(!this.state.isCallInitiator){
               this.invokeCallStages(CALL_STATE_CONNECTED);
           }
                if(this.props.rawLocalStream){
                    console.log('adding raw stream '+this.props.rawLocalStream.toURL()); 
                    this.props.peerConnection.addStream(this.props.rawLocalStream);
                }
    }

    endCall = (triggeredby) => {  
        console.log('endcall was triggered '+triggeredby+' at '+new Date());
        playStopSound('stop');
        InCallManager.stopRingtone();
        InCallManager.stop();
        if(this.props.peerConnection) { 
            this.props.peerConnection.close();
        } 
        this.setState({showGestureCall:false});
        this.setState({isCallInitiator:false});
        this.setState({showCallEndButton:false});
        this.setState({showCallPickButton:false});
        this.setState({callInProgress:false});
        this.setState({showScreenButtons:true});
        if(showScreenButtonsTimeout) {
            clearTimeout(showScreenButtonsTimeout);
        }
        this.props.resetParams();
        this.startCancelCallTimer('cancel');
        addSound('call_end.m4a',0);
       playStopSound('stop');
   }

   invokeCallStages = (type) => {
       if(type === CALL_STATE_DIALLING) {
            this.callStageDialing();
       }else if(type === CALL_STATE_CALLING) {
            this.callStageCalling();   
       }else if(type === CALL_STATE_CONNECTED) {
           this.makeCallInProgress();
       }
   }

   callStageDialing = () => {
       playStopSound('stop');
       if(this.state.isCallInitiator){
        this.setState({showCallPickButton:false});
        this.setState({showCallEndButton:true});
        this.setState({callInProgress:false});
        this.setState({userEndedCall:false});
        this.startCancelDisconnectTimer('connection re esatabilished','stop');
        this.startCancelCallTimer('start');
        this.props.changeCallText(DIALLING);
        addSound('dialing.mp3',-1);
       }
   }

   callStageCalling = () => {
       console.log('callStageCalling '+this.state.userEndedCall+" "+this.state.callInProgress);
       playStopSound('stop');
    if(!this.state.userEndedCall && !this.state.callInProgress){
        this.setState({showCallEndButton:!this.state.showGestureCall});
        this.setState({callInProgress:false});
        this.setState({userEndedCall:false});
        this.startCancelDisconnectTimer('connection re esatabilished','stop');
        this.startCancelCallTimer('start');
        if(this.state.isCallInitiator){
            InCallManager.startRingtone('_DEFAULT_');
            this.props.changeCallText(CALLING);
            if(this.props.rawLocalStream){
                console.log('setting audio to false');
                this.props.rawLocalStream.getAudioTracks()[0].enabled = false;
            }
        }else{
            InCallManager.startRingtone('_BUNDLE_');
            this.props.changeCallText(INCOMING_CALL);
            if(this.props.rawRemoteStream){
                console.log('setting audio to false');
                this.props.rawRemoteStream.getAudioTracks()[0].enabled = false;
            }
        }
        //addSound('phone_ring.mp3',-1);
    }  
}

   makeCallInProgress = () => {
       playStopSound('stop');
       InCallManager.stopRingtone();
       this.setState({showCallPickButton:false});
       this.setState({showCallEndButton:true});
       this.setState({callInProgress:true});
       this.setState({userEndedCall:false});
       this.startCancelDisconnectTimer('connection re esatabilished','stop');
       this.startCancelCallTimer('cancel');
       this.props.changeCallText(null);
       if(this.props.rawLocalStream){
        console.log('setting audio to true');
                this.props.rawLocalStream.getAudioTracks()[0].enabled = true;
        }
   }

   userEndedCall = (sendWsMsg) => {
           if(sendWsMsg) {
            sendWSMessage(this.state.ws,END_CALL,this.props.currentUser,this.props.connectedUser,null);
           }
           this.endCall('should end call');
           this.startCancelDisconnectTimer('user ended call','stop');
           this.setState({userEndedCall:true});
           this.props.resetParams();
   }

   startCancelDisconnectTimer = (message,type) => {
       if(type === 'start'){
        console.log('starting  timer for disconnect timer '+' at '+new Date());
           const disconnectTimer = setTimeout(() => {this.endCall(message)},20000);
          this.setState({disconnectTimer});
       }else if(type === 'stop'){
           if(this.state.disconnectTimer){
               console.log('cleartimeout called for disconnect timer '+' at '+new Date());
              clearTimeout(this.state.disconnectTimer);
           }
       }
   }

   reverseStreams = () => {
                this.props.flipPrimaryStream();
   }

   getTargetStreams = (type) => {
       if(this.props.isPrimaryStreamLocal) {
               if(type === 'Primary') {
                   return getStreamURL(this.props.rawLocalStream);
               }else{
                   return getStreamURL(this.props.rawRemoteStream);
               }
       }else{
        if(type === 'Primary') {
            return getStreamURL(this.props.rawRemoteStream);
        }else{
            return getStreamURL(this.props.rawLocalStream);
        }
       }
   }

   controlShowHideScreenButtons = () => {
         console.log('controlShowHideScreenButtons triggered');
             if(showScreenButtonsTimeout) {
                 console.log('showScreenButtonsTimeout cleared');
                 clearTimeout(showScreenButtonsTimeout);
             }
             this.setState({showScreenButtons:true},() => {
                showScreenButtonsTimeout = setTimeout(() => {
                    this.setState({showScreenButtons:false});
                },10000)
             });
   }

   showHideMuteButtons = () => {
           if (this.state.callInProgress) {
            return (      
                 <React.Fragment>
                     <CameraMode showScreenButtons = {this.state.showScreenButtons} 
                            controlShowHideScreenButtons = {this.controlShowHideScreenButtons}/>
                     <MuteVideo ws = {this.state.ws} showScreenButtons = {this.state.showScreenButtons} 
                            controlShowHideScreenButtons = {this.controlShowHideScreenButtons}/>
                     <MuteAudio ws = {this.state.ws} showScreenButtons = {this.state.showScreenButtons} 
                            controlShowHideScreenButtons = {this.controlShowHideScreenButtons}/>
                 </React.Fragment>  
                )
           }
           return null;
   }

   showOnlineUsers = () => {
             return (<OnlineUsers  setCallInit = {this.setCallInit}/>);
   }

   showSwipeCallAction = () => {
       if(this.state.showGestureCall) {
          return(
            <SwipeCall answerTheCall = {this.answerTheCall} userEndedCall = {this.userEndedCall}/>
          ) ;
       }
       return null;
   }

   showSecondaryView = () => {
    if(this.props.rawRemoteStream && this.state.callInProgress) {
           return (
            <SecondaryView rawRemoteStream = {this.getTargetStreams('Secondary')} 
                reverseStreams = {this.reverseStreams}/>
           );
     }
     return null;
   }

    render() {
        return (
            <React.Fragment>
             <View style = {styles.container}>
                     <PrimaryView rawLocalStream = {this.getTargetStreams('Primary')} 
                               controlShowHideScreenButtons = {this.controlShowHideScreenButtons}/>
                     {this.showSecondaryView()}
             </View>
             {this.showOnlineUsers()}
             <CallText callText = {this.props.callText} connectedUser = {this.props.connectedUser}
               isCallInitiator = {this.state.isCallInitiator}/> 
             {this.showHideMuteButtons()}
             <View style = {styles.CallButtonsView}>
                <CallPick showCallPickButton = {!this.state.showGestureCall && this.state.showCallPickButton} 
                        answerTheCall = {this.answerTheCall}/>
                <CallEnd showCallEndButton = {!this.state.showGestureCall && this.state.showCallEndButton} 
                        userEndedCall = {this.userEndedCall} callInProgress = {this.state.callInProgress}
                        showScreenButtons = {this.state.showScreenButtons}/>   
             </View>
             {this.showSwipeCallAction()}
             </React.Fragment>
        );
    } 
}

const mapStateToProps = state => {
    return {
        rawLocalStream: state.rawLocalStream,
        rawRemoteStream:state.rawRemoteStream,
        isVideoMuted:state.isVideoMuted,
        isAudioMuted:state.isAudioMuted,
        peerConnection:state.peerConnection,
        isPrimaryStreamLocal:state.isPrimaryStreamLocal,
        currentUser: state.currentUser,
        connectedUser: state.connectedUser,
        onlineUsers: state.onlineUsers,
        callText: state.callText,
        soundClip: state.soundClip,
      };
}

const mapDispatchToProps = (dispatch) => {
    return {
        captureRawRemoteStream: (rawStream) => new Promise((resolve,reject) => {
            dispatch(captureRawRemoteStream(rawStream));
            resolve();
        }),
        capturePeerConn: (peerConnection) => new Promise((resolve,reject) => {
            dispatch(capturePeerConn(peerConnection));
            resolve();
        }), 
        flipPrimaryStream: () => dispatch(flipPrimaryStream()),
        setRemoteVideoStatus: (remoteVideoStatus) => dispatch(setRemoteVideoStatus(remoteVideoStatus)),
        resetParams: () => dispatch(resetParams()),
        updateCurrentUser: (currentUser) => new Promise((resolve,reject) => {
            dispatch(updateCurrentUser(currentUser));
            resolve();
        }),
        updateConnectedUser: (connectedUser) => new Promise((resolve,reject) => {
            dispatch(updateConnectedUser(connectedUser));
            resolve();
        }),
        addOnlineUser: (obj,type) => dispatch(addOnlineUser(obj,type)),
        removeOnlineUser: (id) => dispatch(removeOnlineUser(id)),
        changeCallText: (callText) => dispatch(changeCallText(callText)),
        changeSoundClip: (soundClip) => new Promise((resolve,reject) => {
                dispatch(changeSoundClip(soundClip));
                resolve();
        }),
    };
} 

export default connect(mapStateToProps,mapDispatchToProps)(VidChatMobile);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      height:'100%',
      width:'100%',
      backgroundColor: '#505050'
    },
    CallButtonsView:{
        position:'absolute',
        bottom:'5%',
        width:'35%',
        justifyContent:'space-around',
        flexDirection: 'row'
      }
  });