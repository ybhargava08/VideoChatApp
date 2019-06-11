import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import VidChatMobile from './js/VidChatMobile';
import store from './js/reduxstate/store';
import { Provider } from 'react-redux';
//import FacebookLogin from './js/loginmanager/FacebookLogin';
import GoogleLogin from './js/login/GoogleLogin';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
         userInfo:null
    }
  }

  setUserInfo = (userInfo) => {
       this.setState({userInfo});
  }

  loadVidChat = () => {
      if(this.state.userInfo && this.state.userInfo.user && this.state.userInfo.user.id) {
              return (<VidChatMobile user = {this.state.userInfo.user}/>);
      }
      return null;
  }

  render() {
    return (
     <Provider store = {store}> 
        <View style={styles.container}>
             <GoogleLogin setUserInfo = {this.setUserInfo}/>
             {this.loadVidChat()}
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
