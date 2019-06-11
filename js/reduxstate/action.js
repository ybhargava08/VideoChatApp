import {MUTE_AUDIO,MUTE_VIDEO, RAW_LOCAL_STREAM, RAW_REMOTE_STREAM,PEER_CONN,PRIMARY_STREAM_LOCAL
    ,REMOTE_VIDEO_STATUS,RESET_PARAMS,CURRENT_USER,CONNECTED_USER,ONLINE_USERS,CALL_TEXT,SOUND_CLIP } 
    from './reduxConstants';
import store from './store';
import _ from 'lodash';

function flipAudioStatus() {
    console.log('in action flipAudioStatus');
    let payload = {
        ...store.getState(),
        isAudioMuted: !store.getState().isAudioMuted
    }
     return {
         type: MUTE_AUDIO,
         payload
     };
}

function flipVideoStatus() {
    console.log('in action flipVideoStatus');
    let payload = {
        ...store.getState(),
        isVideoMuted: !store.getState().isVideoMuted
    }
    return {
        type: MUTE_VIDEO,
        payload
    };
}

function captureRawLocalStream(rawLocalStream) {
    console.log('in action captureRawLocalStream');
        return {
            type: RAW_LOCAL_STREAM,
            payload: {
                ...store.getState(),
                rawLocalStream,
               // rawRemoteStream:rawLocalStream
            }
        }
}

function captureRawRemoteStream(rawRemoteStream) {
    console.log('in action captureRawRemoteStream');
    return {
        type: RAW_REMOTE_STREAM,
        payload: {
            ...store.getState(),
            rawRemoteStream
        }
    }
}

function capturePeerConn(peerConnection) {
    console.log('in action capturePeerConn');
    return {
        type: PEER_CONN,
        payload: {
            ...store.getState(),
            peerConnection    
        }
    }
}

function flipPrimaryStream () {
    console.log('in action flipPrimaryStream');
    return {
        type: PRIMARY_STREAM_LOCAL,
        payload: {
            ...store.getState(),
            isPrimaryStreamLocal: !store.getState().isPrimaryStreamLocal
        }
    }
}

function resetParams () {
    console.log('in action resetParams');
    return {
        type: RESET_PARAMS,
        payload: {
            ...store.getState(),
            isVideoMuted:false,
            isAudioMuted:false,
            rawRemoteStream:null,
            peerConnection:null,
            isPrimaryStreamLocal:true,
            remoteVideoStatus:true,
            callText:null
        }
    }
}

function setRemoteVideoStatus (remoteVideoStatus) {
    console.log('in action setRemoteVideoStatus '+remoteVideoStatus);
    return {
        type: REMOTE_VIDEO_STATUS,
        payload: {
            ...store.getState(),
            remoteVideoStatus
        }
    }
}

function updateCurrentUser(currentUser){
    console.log('in action updateCurrentUser');
    return {
        type: CURRENT_USER,
        payload: {
            ...store.getState(),
            currentUser
        }
    } 
}

 function updateConnectedUser(connectedUser){
    console.log('in action updateConnectedUser');
    return {
        type: CONNECTED_USER,
        payload: {
            ...store.getState(),
            connectedUser
        }
    } 
}

function addOnlineUser(user,type) {
    console.log('in action addOnlineUser type '+type+' user '+JSON.stringify(user));
      let userList;
      if(type === 'replace'){
        userList = [...user]; 
      }else{
        userList = [...store.getState().onlineUsers];
        let index = _.findIndex(userList,{id:user.id});
        if(index >= 0) {
            userList[index] = user;
        }else{
            userList.push(user);
        }
      }

      return {
          type: ONLINE_USERS,
          payload: {
            ...store.getState(),
            onlineUsers: userList
          }
      }
}

function removeOnlineUser(id) {
    console.log('in action removeOnlineUser');
    let userList = [...store.getState().onlineUsers];
        userList = userList.filter(item => item.id != id);
    
    return {
        type: ONLINE_USERS,
        payload: {
            ...store.getState(),
            onlineUsers: userList
          }
    }
}

function changeCallText(callText) {
    console.log('changecallText action called '+callText);
    return {
        type: CALL_TEXT,
        payload: {
            ...store.getState(),
            callText
        }
    }
}

function changeSoundClip(soundClip) {
        console.log('changeSoundClip action called '+soundClip);
        return {
            type: SOUND_CLIP,
            payload: {
                ...store.getState(),
                soundClip
            }
        }
}

export {flipAudioStatus,flipVideoStatus,captureRawLocalStream, captureRawRemoteStream,capturePeerConn
       ,flipPrimaryStream,setRemoteVideoStatus,resetParams,updateCurrentUser,updateConnectedUser,addOnlineUser,removeOnlineUser,
       changeCallText,changeSoundClip};
