const initState = {
   isVideoMuted:false,
   isAudioMuted:false,
   rawLocalStream:null,
   rawRemoteStream:null,
   peerConnection:null,
   isPrimaryStreamLocal:true,
   remoteVideoStatus:true,
   currentUser: {id:null,name:'default'},
   connectedUser: {id:null,name:'remote'},
   onlineUsers: [/*{id:1,name:'yash'},{id:2,name:'greg'},{id:3,name:'yash'},{id:4,name:'greg'},{id:5,name:'yash'},{id:6,name:'greg'}
,{id:7,name:'yash'},{id:8,name:'greg'},{id:9,name:'yash'},{id:10,name:'greg'}*/],
   callText:null,
   soundClip:null
};

const MUTE_VIDEO = 'MUTE_VIDEO';
const MUTE_AUDIO = 'MUTE_AUDIO';
const RAW_LOCAL_STREAM = 'RAW_LOCAL_STREAM';
const RAW_REMOTE_STREAM = 'RAW_REMOTE_STREAM';
const PEER_CONN = 'PEER_CONNECTION';
const PRIMARY_STREAM_LOCAL = 'PRIMARY_STREAM_LOCAL';
const REMOTE_VIDEO_STATUS = 'REMOTE_VIDEO_STATUS';
const RESET_PARAMS = 'RESET_PARAMS';
const CURRENT_USER = 'CURRENT_USER';
const CONNECTED_USER = 'CONNECTED_USER';
const ONLINE_USERS = 'ONLINE_USERS';
const CALL_TEXT = 'CALL_TEXT';
const SOUND_CLIP = 'SOUND_CLIP';
const REMOTE_AUDIO_STATUS = 'REMOTE_AUDIO_STATUS';

export {initState,MUTE_AUDIO,MUTE_VIDEO,RAW_LOCAL_STREAM,RAW_REMOTE_STREAM,PEER_CONN,PRIMARY_STREAM_LOCAL,
   REMOTE_VIDEO_STATUS,RESET_PARAMS,CURRENT_USER,CONNECTED_USER,ONLINE_USERS,CALL_TEXT,SOUND_CLIP, REMOTE_AUDIO_STATUS };