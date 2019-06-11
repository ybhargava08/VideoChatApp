const JOINED = 'joined';
const LEFT = 'left';
const ICECANDIDATE = 'icecandidate';
const OFFER = 'offer';
const ANSWER = 'answer';
const END_CALL = 'END_CALL';
const DIALLING = 'Dialling...';
const CALLING = 'Calling...';
const INCOMING_CALL = 'Incoming Video Call From ...';

const CALL_STATE_DIALLING = 'dialling';
const CALL_STATE_CALLING = 'calling';
const CALL_STATE_CONNECTED = 'connected';

//call status

const BUSY_ON_CALL = "busy";
const USERUPDATES = "userupdates";
const FREE_TO_CALL = "free";
const CALL_NOT_ANSWERED = "CALL_NOT_ANSWERED";

const config = {'iceServers' : [
{'url':'stun:stun.l.google.com:19305?transport=tcp'},
{'url':'stun:stun1.l.google.com:19305?transport=tcp'},
{'url':'stun:stun2.l.google.com:19305?transport=tcp'},
{'url':'stun:stun3.l.google.com:19305?transport=tcp'},
{'url':'stun:stun4.l.google.com:19305?transport=tcp'},
    {
        url: 'turn:numb.viagenie.ca',
        credential: 'muazkh',
        username: 'webrtc@live.com'
    },
    {
        url: 'turn:192.158.29.39:3478?transport=udp',
        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        username: '28224511:1379330808'
    },
    {
        url: 'turn:192.158.29.39:3478?transport=tcp',
        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        username: '28224511:1379330808'
    }
]};

const GOOGLE_WEB_CLIENT_ID = "895622550595-ctm9olnaaha1am72r9v0dsvv7uu7cgu4.apps.googleusercontent.com";

const wsURL ="ws://192.168.1.47:4000";

const fetchURL = "http://192.168.1.47:4000/getConnectedUsers";

export {JOINED,LEFT,ICECANDIDATE,OFFER,ANSWER,config,DIALLING,CALLING,INCOMING_CALL,END_CALL,
       CALL_STATE_DIALLING,CALL_STATE_CALLING,CALL_STATE_CONNECTED,GOOGLE_WEB_CLIENT_ID,wsURL,fetchURL,
       BUSY_ON_CALL,USERUPDATES,FREE_TO_CALL,CALL_NOT_ANSWERED};