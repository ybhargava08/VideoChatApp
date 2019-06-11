import { mediaDevices } from 'react-native-webrtc';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');
Sound.setMode('VideoChat');

let newSound;

const sendWSMessage = (ws,type,fromId,toId,payload) => {
    console.log('readystate '+ws.readyState);
    if(ws.OPEN === ws.readyState){
         ws.send(JSON.stringify(constructMsg(type,fromId,toId,payload)));
    }
}

function constructMsg(type,currentUser,connectedUser,payload) {
 let msg = {
   type,
   currentUser,
   connectedUser,
   payload
 };
 return msg;
}

const getStreamURL = (stream) => {
    if(stream) {
        return stream.toURL();
    }
    return null;
}

const captureCameraFeed = (facingMode,maxWidth,maxHeight) => {
    console.log('calling captureCameraFeed '+facingMode);
   return mediaDevices.getUserMedia({
        audio: true,
        video: {
            mandatory: {
                 minWidth:270,
                 minHeight:270,
                 maxWidth:480,
                 maxHeight:480,
                 minFrameRate: 60
            },
            facingMode
        }, 
    }).then(stream => {
        console.log('captured stream');
        return stream});
}

const addSound = (sound,loop) => {
    console.log('add sound was triggered '+sound);
      if(newSound) {
          playStopSound('stop');
          newSound = null;
      }
      newSound = new Sound(sound,Sound.MAIN_BUNDLE,(err) => {
         if(err){
            console.log('failed to load sound '+JSON.stringify(err));
         } else{
               if(newSound){
                newSound.setNumberOfLoops(loop);
               } 
             
            playStopSound('play'); 
         }
     });  
}

const playStopSound = (type) => {
    console.log('play stop sound was triggered '+type);
    if(newSound) {
        if(type === 'stop') {
            newSound.stop();
           // newSound.release();
        }else{
            newSound.play(success => {
                if(success) {
                    console.log('played successfully');
                }else{
                    console.log('error occurred');
                }
            });
        }
    }
}

const getDimensions = (layout, totalWidth,totalHeight) => {
       const { x,y,width,height } = layout;
       console.log('wt '+width+" ht "+height+" totalHt "+totalHeight+" totalWT "+totalWidth);
}

const doAnimate = (Animated,animateObj,toValue,duration,delay,component) => {
    console.log('triggering animation of comp '+component+" toVal "+toValue+' curr val '+animateObj._value);
    if(toValue!==animateObj._value) {
        Animated.timing(
            animateObj,
            {
                toValue,
                duration,
                delay
            }
        ).start(() => {
            console.log('after animation of component '+component+' val '+animateObj._value);
        });
    }
}
 
export {getStreamURL,captureCameraFeed,sendWSMessage,addSound,playStopSound,getDimensions,doAnimate};