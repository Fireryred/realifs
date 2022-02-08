import { Alert, StyleSheet, View, Keyboard, ActivityIndicator } from 'react-native';
import React, { Component } from 'react';

import {connect} from 'react-redux';

import firestore, { firebase } from '@react-native-firebase/firestore';

import { TextInput, Button, Title } from 'react-native-paper'

class ContactSupport extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            message: "",
            loading: false
        }
    }
    setLoading(isLoading) {
        this.setState({
            ...this.state,
            loading: isLoading,
        })
    }
    componentDidMount() {
        let email = this.props.auth.userSession.email ?? "";
        console.log(email);
        this.setState({
            ...this.state,
            email: email,
        })
    }
    render() {
        let {email, message, loading} = this.state;

        return (
            <View style={{padding: 10}}>
                <Title>Email</Title>
                <TextInput
                    style={{...styles.input, backgroundColor: 'rgba(200,200,200,1)'}}
                    mode="outlined"
                    value={email}
                    disabled={true}
                />
                <Title
                    // Workaround to dismiss the keyboard since it's a known issue that keyboard gets stuck
                    onPress={() => {
                        Keyboard.dismiss()
                    }}
                >How can we help?</Title>
                <TextInput
                    style={{...styles.input, height: 160}}
                    mode="outlined"
                    onChangeText={text => {
                        this.setState({
                            ...this.state,
                            message: text
                        })
                    }}
                    multiline={true}
                    placeholder="Describe your concern"
                />
                <Button
                    mode="contained"
                    disabled={loading}
                    onPress={() => {
                        this.setLoading(true)
                        console.log(this.state)
                        if(!message || message === "") {
                            Alert.alert(undefined, "Please fill up the necessary fields.");
                            return;
                        }

                        firestore().collection('user_support_logs').add({
                            email,
                            message,
                            date: firestore.Timestamp.now(),        
                        }).then(doc => {
                            Alert.alert("Your concern has been submitted", "Please wait for our support team to get back to you")
                            this.props.navigation.popToTop()
                        }).catch((reason) => {
                            console.log("send contact support error", reason)
                            Alert.alert("There was a problem connecting with the server. Try again.")
                        }).finally(() => { this.setLoading(false) })
                    }}
                >
                Send</Button>
                { loading && <ActivityIndicator animating={true} />}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    label: {
        paddingBottom: 10
    },
    input: {
        paddingBottom: 10
    }
});

const mapStateToProps = state => ({
    auth: state.authReducer
})

export default connect(mapStateToProps, undefined)(ContactSupport)
