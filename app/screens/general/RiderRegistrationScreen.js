import React, { Component, Fragment } from 'react'
import { PermissionsAndroid, StyleSheet, View, ScrollView, Alert, Linking } from 'react-native'

import { NavigationContainer } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';

import { TextInput, Button, Text, Checkbox, Surface, Subheading } from 'react-native-paper'
import DocumentPicker from 'react-native-document-picker'

export default class FetcherRegistrationScreen extends Component {
    constructor() {
        super();

        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
            driversLicenseExists: null,
            driversLicenseFilepath: null,
            driversLicenseWebURL: null,
            agreeToTerms: false,
            formValid: false,
            mobileNumber: "",
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
                driversLicenseExists: {
                    empty: null
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
        // this.handleChange();        
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
                            this.handleChange("firstname")
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
                            this.handleChange("lastname")
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
                            this.handleChange("email")
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
                            this.handleChange("username")
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
                            this.handleChange("mobileNumber")
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
                            this.handleChange("password")
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
                            this.handleChange("confirmPassword")
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
                <Text style={{fontWeight: "bold"}}>Driver's License (Non-professional or Professional only)</Text>
                <Text style={{fontStyle: "italic", color: "gray", }}>Please select .jpeg .jpg .png image up to 5mb in file size.</Text>
                <Surface
                    style={styles.filePickerGroup}
                >
                    <Text>{this.state.driversLicenseFilepath ?? 'No file chosen' }</Text>
                    <Button
                        mode={'outlined'}
                        onPress={() => {
                            this.pickFile().catch((error) => {
                                if (DocumentPicker.isCancel(error)) {
                                    // User cancelled the picker, exit any dialogs or menus and move on
                                } else {
                                    console.log('Error with file upload: ', error)
                                }
                            })
                            }
                        }
                    >CHOOSE FILE</Button>
                </Surface>
                { this.state.driversLicenseExists === false && <Text style={styles.errorMessage}>Please upload a photo/document of you valid Driver's License</Text> }
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
                
                { this.state.errors.agreeToTerms.disagree && <Text style={styles.errorMessage}>You must agree to our privacy policy</Text> }
                <Button
                
                    mode="contained"
                    style={{
                        marginTop: 30,
                        marginBottom: 30
                    }}
                    onPress={() => {
                        this.handleRegister()
                    }}
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

    handleChange(property) {
        const { errors } = this.state;
        const {firstname, lastname, email, username, password, confirmPassword, agreeToTerms, driversLicenseExists, mobileNumber} = this.state;

        if(property == "firstname") {
            this.setState({
                ...this.state,
                errors: {
                    ...this.state.errors,
                    firstname: {
                        empty: !firstname,
                    },
                }
            }, () => {
                console.log(JSON.stringify(this.state, null, 2))
            })   
        } else if(property == "lastname") {
            this.setState({
                ...this.state,
                errors: {
                    ...this.state.errors,
                    lastname: {
                        empty: !lastname,
                    },
                }
            }, () => {
                console.log(JSON.stringify(this.state, null, 2))
            })   
        } else if(property == "email") {
            this.setState({
                ...this.state,
                errors: {
                    ...this.state.errors,
                    email: {
                        empty: !email,
                        invalidEmail: !(new RegExp(/^\S+@\S+\.\S+$/).test(email))
                    },
                }
            }, () => {
                console.log(JSON.stringify(this.state, null, 2))
            })   
        } else if(property == "username") {
            this.setState({
                ...this.state,
                errors: {
                    ...this.state.errors,
                    username: {
                        empty: !username,
                    },
                }
            }, () => {
                console.log(JSON.stringify(this.state, null, 2))
            })   
        } else if(property == "password") {
            this.setState({
                ...this.state,
                errors: {
                    ...this.state.errors,
                    password: {
                        empty: !password,
                        invalidLength: !(password.length >= 8)
                    },
                }
            }, () => {
                console.log(JSON.stringify(this.state, null, 2))
            })   
        } else if(property == "confirmPassword") {
            this.setState({
                ...this.state,
                errors: {
                    ...this.state.errors,
                    confirmPassword: {
                        doesNotMatch: confirmPassword !== password
                    },
                }
            }, () => {
                console.log(JSON.stringify(this.state, null, 2))
            })   
        } else if(property == "agreeToTerms") {
            this.setState({
                ...this.state,
                errors: {
                    ...this.state.errors,
                    agreeToTerms: {
                        disagree: !agreeToTerms
                    },
                }
            }, () => {
                console.log(JSON.stringify(this.state, null, 2))
            })   
        } else if(property == "driversLicenseExists") {
            this.setState({
                ...this.state,
                errors: {
                    ...this.state.errors,
                    driversLicenseExists: {
                        empty: !driversLicenseExists
                    },
                }
            }, () => {
                console.log(JSON.stringify(this.state, null, 2))
            })   
        } else if(property == "mobileNumber") {
            this.setState({
                ...this.state,
                errors: {
                    ...this.state.errors,
                    mobileNumber: {
                        empty: !mobileNumber,
                        invalidLength: !(mobileNumber.length == 11 || mobileNumber.length == 0)
                    }
                }
            }, () => {
                console.log(JSON.stringify(this.state, null, 2))
            })   
        }
        
        // this.setState({
        //     ...this.state,
        //     errors: {
        //         firstname: {
        //             empty: !firstname,
        //         },
        //         lastname: {
        //             empty: !lastname,
        //         },
        //         email: {
        //             empty: !email,
        //             invalidEmail: !(new RegExp(/^\S+@\S+\.\S+$/).test(email))
        //         },
        //         username: {
        //             empty: !username,
        //         },
        //         password: {
        //             empty: !password,
        //             invalidLength: !(password.length >= 8)
        //         },
        //         confirmPassword: {
        //             doesNotMatch: confirmPassword !== password
        //         },
        //         agreeToTerms: {
        //             disagree: !agreeToTerms
        //         },
        //         driversLicenseExists: {
        //             empty: !driversLicenseExists
        //         },
        //         mobileNumber: {
        //             empty: !mobileNumber,
        //             invalidLength: !(mobileNumber.length == 11 || mobileNumber.length == 0)
        //         }
        //     }
        // }, () => {
        //     console.log(JSON.stringify(this.state, null, 2))
        // })   
    }
    
    allValid() {
        const {errors} = this.state;
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

    allInputMade() {
        const {errors} = this.state;
        let result = true;

        for(let i of Object.values(errors)) {
            if(typeof i === 'object') {
                for(let ii of Object.values(i)) {
                    if(ii == null) result = false;
                }
            } else {
                if(i == null) result = false;
            }
        }

        return result;
    }

    termsCheckboxToggle() {
        this.setState({
            ...this.state,
            agreeToTerms: !this.state.agreeToTerms
        }, () => this.handleChange("agreeToTerms"))
    }

    async pickFile() {
        // Getting android permission
        let granted = await this.requestStoragePermission().catch(error => {
            console.log(error)
        })

        // Select local file from device
        let file = await DocumentPicker.pick({
            type: [DocumentPicker.types.images],
            copyTo: 'documentDirectory'
        })

        if(file[0].size > 5242880) {
            Alert.alert(undefined, "Invalid file size, please select image up to 5mb in file size.");
            return;
        }

        this.setState({
            ...this.state,
            driversLicenseFilepath: 'Uploading...'
        })

        let pathToFile = `${file[0].fileCopyUri}`;
        let filenameSplitLength = file[0].name.split('.').length ?? 0;
        let filetype = file[0].name.split('.')[filenameSplitLength - 1] ?? '';
        let uploadFilename = this.generateRandomHex() + filetype;
        let firebaseStorageRef = storage().ref(`driverslicense/${uploadFilename}`);

        // Upload to Firebase Storage
        let result = await firebaseStorageRef.putFile(pathToFile, {
            cacheControl: 'no-store'
        }).catch((error) => {
            console.log(error)
        })
        console.log('result', result)

        // Get Web URL of the uploaded Image
        const url = await storage().ref(`driverslicense/${uploadFilename}`).getDownloadURL();
        console.log('imageURL: ', url)

        this.setState({
            ...this.state,
            driversLicenseFilepath: file[0].name
        }, () => {
            this.handleChange();
        })

        this.setState({
            ...this.state,
            driversLicenseExists: true,
            driversLicenseWebURL: url
        }, () => {
            console.log(JSON.stringify(this.state, null, 2))
            this.handleChange("driversLicenseExists");
        })
    }

    async requestStoragePermission() {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Storage permission granted");
            return true;
        } else {
            console.log("Storage permission denied");
            return false;
        }
    }
 
    async handleRegister() {
        let {firstname, lastname, email, username, password, driversLicenseWebURL, mobileNumber, birthdate } = this.state;

        console.log(`ALL VALID ${this.allValid()}`);

        if(this.allInputMade() && this.allValid()) {
            
            let successCredential = await auth().createUserWithEmailAndPassword(email, password)
            .then( credential => {
                let uid = credential.user.uid;

                let collectionRef = firestore().collection('users').doc(uid).set({
                    account_type: 'rider',
                    firstname,
                    lastname,
                    email,
                    username,
                    driversLicenseWebURL,
                    verifiedByHR: false,
                    balance: 0,
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

    generateRandomHex(length = 16) {
        return [...Array(length)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
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
    },
    filePickerGroup: {
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center'
    }
})