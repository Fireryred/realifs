import React, { Fragment } from 'react';
import { Platform, ActivityIndicator, Text, View, Button, StyleSheet, Alert } from 'react-native';
import { connect } from 'react-redux';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import AuthAction from './app/redux/actions/AuthAction';
import DonorMain from './app/navigation/DonorMain';
import WelcomeScreen from './app/screens/general/WelcomeScreen'
import CSOMain from './app/navigation/CSOMain';
import RiderMain from './app/navigation/RiderMain';

class App extends React.Component {
    componentDidMount() {
        console.log(`Running on Android Version: ${Platform.Version}`)
        // console.log(JSON.stringify(this.props.auth.userSession, null, 2))

        auth().onAuthStateChanged(async (user) => {
            if (user) {
                // Signed in / Currently logged i

                if (!user.emailVerified) {
                    this.verifyAlert();
                    console.log("Logged in. Email not verified: ", user)
                }
                else {
                    try {
                        // Fetches custom user data. This includes account_type, that determines cso, donor, or rider
                        let documentSnapshot = await firestore()
                            .collection('users')
                            .doc(user.uid)
                            .get();
                        let userData = documentSnapshot.data();

                        this.props.dispatch(AuthAction.getActionLogin(user, userData));
                        console.log(`Logged in as: ${userData.account_type}`);
                    }
                    catch (error) {
                        console.log('User authenticated. But cannot get user data: ', error)
                    }
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
        if (this.props.auth.userSession && this.props.auth.userData?.account_type) {

            if (this.props.auth.userData.account_type === 'donor') {
                return (
                    <DonorMain />
                )
            }
            else if (this.props.auth.userData.account_type === 'rider') {
                return (
                    <RiderMain />
                )
            }
            else if (this.props.auth.userData.account_type === 'cso') {
                return (
                    <CSOMain />
                )
            }

        }
        else {
            return (
                <WelcomeScreen></WelcomeScreen>
            )
        }

    }

    verifyAlert() {
        Alert.alert(
            "Verify your email",
            "Please check the verification link sent to your email",
            [
                { text: "OK", onPress: () => { } }
            ]
        );
    }
}

const mapStateToProps = state => ({
    auth: state.authReducer
})

// Redundant. But im still gonna include it anyway. dispatch is automatically available, so do this only when you want to rename it
const mapDispatchToProps = dispatch => {
    return {
        dispatch: dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App)