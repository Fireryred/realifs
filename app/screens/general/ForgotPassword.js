import { StyleSheet, View, Modal, Alert } from 'react-native';
import React, { Component } from 'react';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { Text, Surface, Card, Title, Colors, Switch, Button, TextInput } from 'react-native-paper'

export default class ForgotPassword extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            loading: false
        }
    }

    setLoading(isLoading) {
        this.setState({
            ...this.state,
            loading: isLoading
        })
    }
    render() {
        let {email, loading} = this.state;

        return (
            <View style={styles.container}>
                <Surface style={styles.inputContainer}>
                    <TextInput
                        keyboardType='email-address'
                        value={email}
                        onChangeText={(text) => { 
                            this.setState({
                                ...this.state,
                                email: text
                            })
                        }}
                        mode='outlined'
                        placeholder='Enter your email'
                        style={styles.emailInput}
                    />
                </Surface>
                
                <Button
                    mode="contained"
                    onPress={() => {
                        this.setLoading(true)

                        if(email && email.trim() !== "") {
                            auth().sendPasswordResetEmail(email).then(() => {
                                this.setLoading(false)
                                Alert.alert("Password Reset Sent", `Password reset instructions was sent to: ${email}`)
                                {this.props.navigation.popToTop()}
                            }).catch((reason) => {
                                console.log("error sending password reset", reason);
                                Alert.alert("Invalid request", `The email may not be associated with any account or may have been badly formatted.`)
                            })
                        }
                    }}
                >Reset Password</Button>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 10
    },
    inputContainer: {
        backgroundColor: 'none',
        paddingVertical: 20
    },  
    input: {
    }

});
