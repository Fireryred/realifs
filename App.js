import React, {Fragment} from 'react';
import {ActivityIndicator, Text, View, Button, StyleSheet} from 'react-native';
import {connect} from 'react-redux';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import AuthAction from './app/redux/actions/AuthAction';
import DonorMain from './app/navigation/DonorMain';
import LoginScreen from './app/screens/general/LoginScreen';
import RiderMain from './app/navigation/RiderMain';
class App extends React.Component {
  componentDidMount() {
    // console.log(JSON.stringify(this.props.auth.userSession, null, 2))

    auth().onAuthStateChanged( async (user) => {
      if(user) {
        // Signed in / Currently logged in

        try {
          let user_exploded = JSON.stringify(user, null, 2);
          // console.log('onAuthStateChanged: Logged in as', user_exploded);
          
          // Fetches custom user data. This includes account_type, that determines cso, donor, or rider
          let documentSnapshot = await firestore()
            .collection('users')
            .doc(user.uid)
            .get();

          let userData = documentSnapshot.data();

          this.props.dispatch(AuthAction.getActionLogin(user, userData));
          console.log(`Logged in as: ${userData.account_type}`);
        } 
        catch(error) {
          // console.log('User authenticated. But cannot get user data: ', error)
        }
      } 
      else {
        // Signed out / Not logged in

        this.props.dispatch(AuthAction.getActionLogout());
        console.log('onAuthStateChanged: No user logged in')
      }
    })
  }

  render() {
    if(this.props.auth.userSession && this.props.auth.userData?.account_type) {
      if(this.props.auth.userData.account_type === 'cso') {
        return (
          <DonorMain/>
        )
      } 
      else if(this.props.auth.userData.account_type === 'donor') {
        return (
          <DonorMain/>
        )
      }
      else if(this.props.auth.userData.account_type === 'rider') {
        return (
          <RiderMain/>
        )
      }
      
    } 
    else {
      return (
        <LoginScreen></LoginScreen>
      )
    }
  }

}

const mapStateToProps = state => ({
  auth: state.authReducer
})

export default connect(mapStateToProps)(App)