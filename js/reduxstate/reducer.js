import {initState,MUTE_AUDIO,MUTE_VIDEO,RAW_LOCAL_STREAM,RAW_REMOTE_STREAM,PEER_CONN,PRIMARY_STREAM_LOCAL
   ,REMOTE_VIDEO_STATUS,RESET_PARAMS,CURRENT_USER,ONLINE_USERS,CONNECTED_USER,CALL_TEXT,SOUND_CLIP} 
   from './reduxConstants';

const reducer = (state = initState,action) => {
    switch (action.type) {
        case MUTE_AUDIO:
           return action.payload;
        case MUTE_VIDEO:
           return action.payload;
        case RAW_LOCAL_STREAM:
           return action.payload;
        case RAW_REMOTE_STREAM:
           return action.payload;  
        case PEER_CONN:
           return action.payload; 
        case PRIMARY_STREAM_LOCAL:
           return action.payload; 
        case REMOTE_VIDEO_STATUS:
             return action.payload;
        case RESET_PARAMS:
             return action.payload;
        case CURRENT_USER:
             return action.payload;
        case CONNECTED_USER:
             return action.payload; 
        case ONLINE_USERS:
             return action.payload;
        case CALL_TEXT:
             return action.payload;
        case SOUND_CLIP:
             return action.payload;  
        default:
           return state;      
    }
}

export default reducer;