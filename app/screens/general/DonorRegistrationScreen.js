import React, { Component, Fragment } from 'react'
import { StyleSheet, View, ScrollView, Alert, Linking } from 'react-native'

import { NavigationContainer } from '@react-navigation/native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
// import { utils } from '@react-native-firebase/app';
// import storage from '@react-native-firebase/storage';

import { TextInput, Button, Text, Checkbox, Surface } from 'react-native-paper'

export default class DonorRegistrationScreen extends Component {
    constructor() {
        super();

        this.state = {
            firstname: 'Rem',
            lastname: 'Irine',
            email: 'remer.irineo@gmail.com',
            username: 'rem',
            password: 'password',
            confirmPassword: 'password',
            agreeToTerms: null,
            formValid: false,
            errors: {
                firstname: {
                    empty: null,
                },
                lastname: {
                    empty: null,
                },
                email: {
                    empty: true,
                    invalidEmail: true
                },
                username: {
                    empty: true,
                    invalidLength: true
                },
                password: {
                    empty: true,
                    invalidLength: true
                },
                confirmPassword: {
                    empty: true,
                    doesNotMatch: true
                },
            }
        }

        console.log(JSON.stringify(this.state, null, 2))
    }
    componentDidMount() {
        this.handleChange();
    }

    render() {
        return (
            <ScrollView
                style={styles.container}
            >
                <TextInput 
                    placeholder="First Name" 
                    value={this.state.firstname}
                    error={this.state.errors.firstname.empty}
                    onChangeText={(text) => { 
                        this.setState({
                            ...this.state,
                            firstname: text
                        }, () => {
                            this.handleChange()
                        })
                    }}
                />
                { this.state.errors.firstname.empty && <Text style={styles.errorMessage}>Must not be empty</Text> }
                <TextInput 
                    placeholder="Last Name" 
                    value={this.state.lastname}
                    error={this.state.errors.lastname.empty}
                    onChangeText={(text) => { 
                        this.setState({
                            ...this.state,
                            lastname: text
                        }, () => {
                            this.handleChange()
                        })
                    }}
                />
                { this.state.errors.lastname.empty && <Text style={styles.errorMessage}>Must not be empty</Text> }
                <TextInput 
                    placeholder="Email" 
                    value={this.state.email}
                    error={this.state.errors.email.empty || this.state.errors.email.invalidEmail}
                    onChangeText={(text) => { 
                        this.setState({
                            ...this.state,
                            email: text
                        }, () => {
                            this.handleChange()
                        })
                    }}
                />
                { this.state.errors.email.empty && <Text style={styles.errorMessage}>Must not be empty</Text> }
                { this.state.errors.email.invalidEmail && <Text style={styles.errorMessage}>Invalid email</Text> }
                <TextInput 
                    placeholder="Username" 
                    value={this.state.username} 
                    error={this.state.errors.username.empty}
                    onChangeText={(text) => { 
                        this.setState({
                            ...this.state,
                            username: text
                        }, () => {
                            this.handleChange()
                        })
                    }}
                />
                { this.state.errors.username.empty && <Text style={styles.errorMessage}>Must not be empty</Text> }
                <TextInput 
                    placeholder="Password" 
                    value={this.state.password} 
                    secureTextEntry={true}
                    error={this.state.errors.password.empty || this.state.errors.password.invalidLength}
                    onChangeText={(text) => { 
                        this.setState({
                            ...this.state,
                            password: text
                        }, () => {
                            this.handleChange()
                        })
                    }}
                />
                { this.state.errors.password.empty && <Text style={styles.errorMessage}>Must not empty</Text> }
                { this.state.errors.password.invalidLength && <Text style={styles.errorMessage}>Password must be at least 8 characters</Text> }
                <TextInput 
                    placeholder="Confirm Password" 
                    value={this.state.confirmPassword}
                    secureTextEntry={true}
                    error={this.state.errors.confirmPassword.doesNotMatch}
                    onChangeText={(text) => { 
                        this.setState({
                            ...this.state,
                            confirmPassword: text
                        }, () => {
                            this.handleChange()
                        })
                    }}
                />
                { this.state.errors.confirmPassword.doesNotMatch && <Text style={styles.errorMessage}>Passwords do not match</Text> }
                <Surface
                    style={styles.termsGroup}>
                    <Checkbox
                        status={this.state.agreeToTerms ? 'checked' : 'unchecked'}
                        onPress={() => {
                            this.termsCheckboxToggle();
                        }}
                    />
                    <Text>Agree to 
                        <Text style={styles.termsUrl}
                            onPress={() => Linking.openURL('http://google.com')}>
                            Terms and Conditions
                        </Text>
                    </Text>
                    
                </Surface>
                
                { this.state.agreeToTerms === false && <Text style={styles.errorMessage}>You must agree to terms and conditions</Text> }
                <Button
                    mode="contained"
                    style={styles.registerButton}
                    onPress={() => {this.handleRegister()}}
                >Register</Button>
            </ScrollView>
        )
    }

    handleChange() {
        const { errors } = this.state;
        const {firstname, lastname, email, username, password, confirmPassword} = this.state;

        this.setState({
            ...this.state,
            errors: {
                firstname: {
                    empty: !firstname,
                },
                lastname: {
                    empty: !lastname,
                },
                email: {
                    empty: !email,
                    invalidEmail: !(new RegExp(/^\S+@\S+\.\S+$/).test(email))
                },
                username: {
                    empty: !username,
                },
                password: {
                    empty: !password,
                    invalidLength: !(password.length >= 8)
                },
                confirmPassword: {
                    doesNotMatch: confirmPassword !== password
                },
            }
        }, () => {
            console.log(JSON.stringify(this.state, null, 2))
        })   
    }
    
    allValid() {
        const {errors, agreeToTerms} = this.state;
        let result = true;

        if(!agreeToTerms) result = false;

        for(let i of Object.values(errors)) {
            if(typeof i === 'object') {
                for(let ii of Object.values(i)) {
                    if(ii) result = false;
                }
            } else {
                if(i) result = false;
            }
        }

        return result;
    }

    termsCheckboxToggle() {
        this.setState({
            ...this.state,
            agreeToTerms: !this.state.agreeToTerms
        }, this.handleChange)
    }

    async handleRegister() {
        let {firstname, lastname, email, username, password } = this.state;

        console.log(`ALL VALID ${this.allValid()}`);

        if(this.allValid()) {
            
            let successCredential = await auth().createUserWithEmailAndPassword(email, password)
                .then( credential => {
                    let uid = credential.user.uid;

                    let collectionRef = firestore().collection('users').doc(uid).set({
                        account_type: 'donor',
                        firstname,
                        lastname,
                        email,
                        username,
                    })
                        .then( () => {console.log('User data creation: success')} )
                        .catch( (error) => {console.log('User data creation: ', error)} )

                    auth().currentUser.sendEmailVerification()
                        .then( () => { console.log('Email Verification Sent') } )
                        .catch( (error) => {console.log('sendEmailVerification error:', error)} )

                    this.props.navigation.navigate('WelcomeScreenComponent')
                })
                .catch(error => {
                    switch(error.code) {
                        case 'auth/email-already-in-use':
                            Alert.alert('Email already in use !')
                            break;
                        case 'auth/network-request-failed':
                            Alert.alert('Request failed. Please check your network')
                            break;
                        default:
                            console.log('error', error)
                     }
                });
        }
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    errorMessage: {
        color: 'red',
    },
    actionButton: {
        margin: 10
    },
    termsGroup: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    termsUrl: {
        color: 'blue'
    }
})