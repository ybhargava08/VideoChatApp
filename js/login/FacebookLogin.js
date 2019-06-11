import { LoginButton,AccessToken }  from 'react-native-fbsdk';
import React from 'react';
import { View,Text } from 'react-native';

class FacebookLogin extends React.Component {

     constructor(props) {
         super(props);
     }

     componentDidMount() {
        /* AccessToken.getCurrentAccessToken().then(data => {
                    JSON.stringify(data);
         });
         LoginManager.logInWithReadPermissions(['public-profile']).then(result => {
             JSON.stringify(result);
                 if(result.isCancelled) {
                     console.log('login cancelled');
                 }else{
                     console.log('login success');
                 }
         });*/
     }

     afterLogin = (err,result) => {
              console.log('result is '+JSON.stringify(result)+ ' error is '+JSON.stringify(err));
              if(err) {
                  console.log('facebook login err '+result.err);
              }else if(result.isCancelled) {
                  console.log('login result cancelled');
              }else{
                    AccessToken.getCurrentAccessToken(data => {
                        console.log(data.accessToken);
                    })
              }
     }

     render() {
         return (
             <View>
                 <Text>this is facebook login</Text>
                 <LoginButton readPermissions = {['public_profile']} 
                 onLoginFinished = {(err,result) => this.afterLogin(err,result)}/>
             </View>
         );
     }

}

export default FacebookLogin;