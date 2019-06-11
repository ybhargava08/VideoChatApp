import React from 'react';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import { GOOGLE_WEB_CLIENT_ID } from '../constants';

class GoogleLogin extends React.Component {

      constructor(props) {
          super(props);
          this.state = {
              userInfo:null
          }
      }

      componentDidMount() {
          GoogleSignin.configure({
              scopes:['https://www.googleapis.com/auth/drive.readonly'],
              webClientId:GOOGLE_WEB_CLIENT_ID
          });

          this.doLogin();
      }

      doLogin = async () => {
          try{
            const userInfo = await GoogleSignin.signInSilently();
            this.props.setUserInfo(userInfo);
            this.setState({userInfo},() => {
                console.log('user info is '+JSON.stringify(this.state.userInfo));
            });
          }catch(err) {
              console.log('err is '+JSON.stringify(err));
              if(err.code === statusCodes.SIGN_IN_REQUIRED) {
                  this.doManualSignin();
              }
          }
      }

      doManualSignin = async () => {
        try{
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            this.props.setUserInfo(userInfo);
           console.log('user info '+JSON.stringify(userInfo));
           }catch(e) {
               console.log('error '+JSON.stringify(e));
           }
      }      

      render() {
          return (
                 <React.Fragment></React.Fragment> 
          );
      }
}

export default GoogleLogin;