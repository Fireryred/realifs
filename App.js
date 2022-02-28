import React, {Fragment} from 'react';
import {
  Platform,
  ActivityIndicator,
  Text,
  View,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import AuthAction from './app/redux/actions/AuthAction';
import DonorMain from './app/navigation/DonorMain';
import WelcomeScreen from './app/screens/general/WelcomeScreen';
import CSOMain from './app/navigation/CSOMain';
import RiderMain from './app/navigation/RiderMain';
import WelcomeScreenProxy from './app/screens/general/WelcomeScreenProxy';

class App extends React.Component {
  componentDidMount() {
    console.log(`Running on Android Version: ${Platform.Version}`);
    // console.log(JSON.stringify(this.props.auth.userSession, null, 2))
    this.updateDonoEff().catch(error => console.error(error));
    auth().onAuthStateChanged(user => {
      if (user) {
        // Signed in / Currently logged i
        console.log('triggered');
        this.props.dispatch(AuthAction.getActionLogin(user, {}));
        if (!user.emailVerified) {
          this.verifyAlert();
          console.log('Logged in. Email not verified: ', user);
        } else {
          // Fetches custom user data. This includes account_type, that determines cso, donor, or rider
          firestore()
            .collection('users')
            .doc(user.uid)
            .get()
            .then(doc => {
              let userData = doc.data();
              this.props.dispatch(AuthAction.getActionLogin(user, userData));
              console.log(`Logged in as: ${userData.account_type}`);
            })
            .catch(error => {
              console.log(
                'User authenticated. But cannot get user data: ',
                error,
              );
            });
        }
      } else {
        // Signed out / Not logged in

        this.props.dispatch(AuthAction.getActionLogout());
        console.log('onAuthStateChanged: No user logged in');
      }
    });
  }
  async updateDonoEff() {
    let today = new Date();
    today.setDate(today.getDate());
    today.setHours(0, 0, 0, 0);
    await firestore()
      .collection('donation_efforts')
      .where('isDeleted', '==', false)
      .get()
      .then(query => {
        query.forEach(async doc => {
          if (doc.data().endDateTime.toDate() <= today) {
            console.log('boop');
            await firestore()
              .collection('donation_efforts')
              .doc(doc.id)
              .update({isDeleted: true});
          }
        });
      });
  }
  render() {
    if (this.props.auth.userSession && this.props.auth.userData?.account_type) {
      if (this.props.auth.userData.account_type === 'donor') {
        return <DonorMain />;
      } else if (this.props.auth.userData.account_type === 'rider') {
        if (this.props.auth.userData.verifiedByHR == false) {
          Alert.alert(
            'Account under review',
            'Your fetcher account is still being verified by our team.',
            [{text: 'OK', onPress: () => {}}],
          );
          return <WelcomeScreenProxy />;
        } else {
          return <RiderMain />;
        }
      } else if (this.props.auth.userData.account_type === 'cso') {
        console.log(!this.props.auth.userData.verifiedByHR);
        if (this.props.auth.userData.verifiedByHR == false) {
          Alert.alert(
            'Account under review',
            'Your CSO Administrator account is still being verified by our team.',
            [{text: 'OK', onPress: () => {}}],
          );
          return <WelcomeScreenProxy />;
        } else {
          return <CSOMain />;
        }
      }
    } else {
      if (this.props.auth.userSession?.emailVerified == false) {
        console.log('redirect');
        return <WelcomeScreenProxy />;
      } else {
        return <WelcomeScreen></WelcomeScreen>;
      }
    }
  }

  verifyAlert() {
    Alert.alert(
      'Verify your email',
      'Please check the verification link sent to your email',
      [{text: 'OK', onPress: () => {}}],
    );
  }
}

const mapStateToProps = state => ({
  auth: state.authReducer,
});

// Redundant. But im still gonna include it anyway. dispatch is automatically available, so do this only when you want to rename it
const mapDispatchToProps = dispatch => {
  return {
    dispatch: dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
