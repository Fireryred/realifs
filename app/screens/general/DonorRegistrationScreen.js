import React, { Component, Fragment } from 'react'
import { StyleSheet, View, ScrollView, Alert, Linking } from 'react-native'

import { NavigationContainer } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
// import { utils } from '@react-native-firebase/app';
// import storage from '@react-native-firebase/storage';

import { TextInput, Button, Text, Checkbox, Surface } from 'react-native-paper'

export default class DonorRegistrationScreen extends Component {
    constructor() {
        super();

        let testMode = false;

        this.state = {
            firstname: testMode ? "Sarah" : "",
            lastname: testMode ? "Baker" : "",
            email: testMode ? "sbaker@realifs.com" : "",
            username: testMode ? "sbaker" : "",
            password: testMode ? "password" : "",
            confirmPassword: testMode ? "password" : "",
            agreeToTerms: testMode ? true : false,
            mobileNumber: testMode ? "09998887777" : "",
            birthdate: new Date("1995-01-01"),
            datePickerShow: false,
            errors: {
                firstname: {
                    empty: null,
                },
                lastname: {
                    empty: null,
                },
                email: {
                    empty: null,
                    invalidEmail: null
                },
                username: {
                    empty: null,
                    invalidLength: null
                },
                password: {
                    empty: null,
                    invalidLength: null
                },
                confirmPassword: {
                    empty: null,
                    doesNotMatch: null
                },
                agreeToTerms: {
                    disagree: null
                },
                mobileNumber: {
                    empty: null,
                    invalidLength: null,
                }
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
                <Text style={{fontWeight: "bold"}}>First Name</Text>
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
                {/* { this.state.errors.firstname.empty && <Text style={styles.errorMessage}>Must not be empty</Text> } */}

                <Text style={{fontWeight: "bold"}}>Last Name</Text>
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
                {/* { this.state.errors.lastname.empty && <Text style={styles.errorMessage}>Must not be empty</Text> } */}

                <Text style={{fontWeight: "bold"}}>Email</Text>
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
                
                {/* { this.state.errors.email.empty && <Text style={styles.errorMessage}>Must not be empty</Text> } */}
                { this.state.errors.email.invalidEmail && <Text style={styles.errorMessage}>Invalid email</Text> }

                <Text style={{fontWeight: "bold"}}>Username</Text>
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
                {/* { this.state.errors.username.empty && <Text style={styles.errorMessage}>Must not be empty</Text> } */}

                <Text style={{fontWeight: "bold"}}>Mobile Number</Text>
                <TextInput 
                    placeholder="Mobile Number" 
                    keyboardType="numeric"
                    value={this.state.mobileNumber} 
                    error={this.state.errors.mobileNumber.empty || this.state.errors.mobileNumber.invalidLength}
                    onChangeText={(text) => { 
                        this.setState({
                            ...this.state,
                            mobileNumber: text
                        }, () => {
                            this.handleChange()
                        })
                    }}
                />
                { this.state.errors.mobileNumber.invalidLength && <Text style={styles.errorMessage}>Invalid Length</Text> }

                <Text style={{fontWeight: "bold"}}>Password</Text>
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
                {/* { this.state.errors.password.empty && <Text style={styles.errorMessage}>Must not empty</Text> } */}
                { this.state.errors.password.invalidLength && <Text style={styles.errorMessage}>Password must be at least 8 characters</Text> }

                <Text style={{fontWeight: "bold"}}>Confirm Password</Text>
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

                <Text style={{fontWeight: "bold"}}>Birthdate</Text>
                <View style={{display: "flex", flexDirection: "row"}}>
                    <Button 
                        mode="outlined" 
                        color="black" 
                        style={{marginBottom: 20}}
                        onPress={() => {
                            this.setState({
                                ...this.state,
                                datePickerShow: true,
                            })
                        }}
                    >{this.state.birthdate.toLocaleDateString()}</Button>
                </View>
                
                <Surface
                    style={styles.termsGroup}>
                    <Checkbox
                        status={this.state.agreeToTerms ? 'checked' : 'unchecked'}
                        onPress={() => {
                            this.termsCheckboxToggle();
                        }}
                    />
                    <Text>{"Agree to "} 
                        <Text style={styles.termsUrl}
                            onPress={() => this.props.navigation.navigate("PrivacyPolicy")}>
                            {"Privacy Policy"}
                        </Text>
                    </Text>
                    
                </Surface>
                
                { this.state.agreeToTerms === false && <Text style={styles.errorMessage}>You must agree to our privacy policy</Text> }
                <Button
                    mode="contained"
                    style={{marginBottom: 20}}
                    onPress={() => {this.handleRegister()}}
                >Register</Button>

                {this.state.datePickerShow &&
                    <DateTimePicker value={this.state.birthdate} onChange={this.datePickerChange} maximumDate={new Date()}/>
                }
            </ScrollView>
        )
    }

    datePickerChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.birthdate;
        this.setState({
            ...this.state,
            birthdate: currentDate,
            datePickerShow: false,
        });
    }

    handleChange() {
        const { errors } = this.state;
        const {firstname, lastname, email, username, password, confirmPassword, agreeToTerms, mobileNumber} = this.state;

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
                agreeToTerms: {
                    disagree: !agreeToTerms
                },
                mobileNumber: {
                    empty: !mobileNumber,
                    invalidLength: !(mobileNumber.length == 11 || mobileNumber.length == 0)
                }
            }
        }, () => {
            console.log(JSON.stringify(this.state, null, 2))
        })   
    }
    
    allValid() {
        const {errors, agreeToTerms} = this.state;
        let result = true;


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
        let {firstname, lastname, email, username, password, mobileNumber, birthdate } = this.state;

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
                        mobileNumber,
                        birthdate: firestore.Timestamp.fromDate(birthdate),
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
        } else {
            Alert.alert('Form invalid','Please fill up all the fields')
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