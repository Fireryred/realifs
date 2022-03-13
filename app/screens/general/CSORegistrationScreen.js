import React, { Component, Fragment } from 'react'
import { PermissionsAndroid, StyleSheet, View, ScrollView, Alert, Linking } from 'react-native'

import { NavigationContainer } from '@react-navigation/native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';

import { TextInput, Button, Text, Checkbox, Surface, Subheading } from 'react-native-paper'
import DocumentPicker from 'react-native-document-picker'

export default class CSORegistrationScreen extends Component {
    constructor() {
        super();

        this.state = {
            organizationName: '',
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
            SECCertificateExists: null,
            SECCertificateFilepath: null,
            SECCertificateWebURL: null,
            PCNCCertificateExists: null,
            PCNCCertificateFilepath: null,
            PCNCCertificateWebURL: null,
            about: "",
            bankNumbers: "",
            agreeToTerms: false,
            formValid: false,
            errors: {
                organizationName: {
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
                SECCertificateExists: {
                    empty: null
                },
                PCNCCertificateExists: {
                    empty: null
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
                <Text style={{fontWeight: "bold"}}>Full Organization Name</Text>
                <TextInput 
                    placeholder="Full Organization Name" 
                    value={this.state.organizationName}
                    error={this.state.errors.organizationName.empty}
                    onChangeText={(text) => { 
                        this.setState({
                            ...this.state,
                            organizationName: text
                        }, () => {
                            this.handleChange("organizationName")
                        })
                    }}
                />
                {/* { this.state.errors.organizationName.empty && <Text style={styles.errorMessage}>Must not be empty</Text> } */}
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

                <View style={{marginVertical: 5}}>
                    <Text style={{fontWeight: "bold"}}>Organization Certificates</Text>
                    <Text style={{fontStyle: "italic", color: "gray", }}>Please select .jpeg .jpg .png images up to 5mb in file size.</Text>
                </View>
                <View style={{marginLeft: 10}}>
                    <Text style={{fontWeight: "bold",}}>SEC Certificate</Text>
                    <Surface
                        style={styles.filePickerGroup}
                    >
                        <Text>{this.state.SECCertificateFilepath ?? 'No file chosen' }</Text>
                        <Button
                            mode={'outlined'}
                            onPress={() => {
                                this.pickFileSEC().catch((error) => {
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
                    { this.state.SECCertificateExists === false && <Text style={styles.errorMessage}>Please upload a photo/document of your Organization's SEC Certificate</Text> }

                    <Text style={{fontWeight: "bold"}}>PCNC Certificate</Text>
                    <Surface
                        style={styles.filePickerGroup}
                    >
                        <Text>{this.state.PCNCCertificateFilepath ?? 'No file chosen' }</Text>
                        <Button
                            mode={'outlined'}
                            onPress={() => {
                                this.pickFilePCNC().catch((error) => {
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
                    { this.state.PCNCCertificateExists === false && <Text style={styles.errorMessage}>Please upload a photo/document of your Organization's PCNC Certificate</Text> }

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
                { this.state.errors.agreeToTerms.disagree && <Text style={styles.errorMessage}>You must agree to our privacy policy</Text> }
                <Button
                
                    mode="contained"
                    style={{
                        marginTop: 30,
                        marginBottom: 30
                    }}
                    onPress={() => {this.handleRegister()}}
                >Register</Button>
            </ScrollView>
        )
    }

    handleChange(property) {
        const { errors } = this.state;
        const {organizationName, email, username, password, confirmPassword, agreeToTerms, SECCertificateExists, PCNCCertificateExists} = this.state;

        if(property == "organizationName") {
            this.setState({
                ...this.state,
                errors: {
                    ...this.state.errors,
                    organizationName: {
                        empty: !organizationName,
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
        } else if(property == "SECCertificateExists") {
            this.setState({
                ...this.state,
                errors: {
                    ...this.state.errors,
                    SECCertificateExists: {
                        empty: !SECCertificateExists
                    },
                }
            }, () => {
                console.log(JSON.stringify(this.state, null, 2))
            })   
        } else if(property == "PCNCCertificateExists") {
            this.setState({
                ...this.state,
                errors: {
                    ...this.state.errors,
                    PCNCCertificateExists: {
                        empty: !PCNCCertificateExists
                    }
                }
            }, () => {
                console.log(JSON.stringify(this.state, null, 2))
            })   
        }

        // this.setState({
        //     ...this.state,
        //     errors: {
        //         organizationName: {
        //             empty: !organizationName,
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
        //         SECCertificateExists: {
        //             empty: !SECCertificateExists
        //         },
        //         PCNCCertificateExists: {
        //             empty: !PCNCCertificateExists
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

    async pickFileSEC() {
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
            Alert.alert(undefined, "Invalid file size, please select images up to 5mb in file size.");
            return;
        }
        
        this.setState({
            ...this.state,
            SECCertificateFilepath: 'Uploading...'
        })

        let pathToFile = `${file[0].fileCopyUri}`;
        let filenameSplitLength = file[0].name.split('.').length ?? 0;
        let filetype = file[0].name.split('.')[filenameSplitLength - 1] ?? '';
        let uploadFilename = this.generateRandomHex() + filetype;
        let firebaseStorageRef = storage().ref(`SECCertificate/${uploadFilename}`);

        // Upload to Firebase Storage
        let result = await firebaseStorageRef.putFile(pathToFile, {
            cacheControl: 'no-store'
        }).catch((error) => {
            console.log(error)
        })
        console.log('result', result)

        // Get Web URL of the uploaded Image
        const url = await storage().ref(`SECCertificate/${uploadFilename}`).getDownloadURL();
        console.log('imageURL: ', url)

        this.setState({
            ...this.state,
            SECCertificateFilepath: file[0].name
        }, () => {
            this.handleChange();
        })

        this.setState({
            ...this.state,
            SECCertificateExists: true,
            SECCertificateWebURL: url
        }, () => {
            console.log(JSON.stringify(this.state, null, 2))
            this.handleChange("SECCertificateExists");
        })
    }

    async pickFilePCNC() {
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
            Alert.alert(undefined, "Invalid file size, please select images up to 5mb in file size.");
            return;
        }

        this.setState({
            ...this.state,
            PCNCCertificateFilepath: 'Uploading...'
        })

        let pathToFile = `${file[0].fileCopyUri}`;
        let filenameSplitLength = file[0].name.split('.').length ?? 0;
        let filetype = file[0].name.split('.')[filenameSplitLength - 1] ?? '';
        let uploadFilename = this.generateRandomHex() + filetype;
        let firebaseStorageRef = storage().ref(`PCNCCertificate/${uploadFilename}`);

        // Upload to Firebase Storage
        let result = await firebaseStorageRef.putFile(pathToFile, {
            cacheControl: 'no-store'
        }).catch((error) => {
            console.log(error)
        })
        console.log('result', result)

        // Get Web URL of the uploaded Image
        const url = await storage().ref(`PCNCCertificate/${uploadFilename}`).getDownloadURL();
        console.log('imageURL: ', url)

        this.setState({
            ...this.state,
            PCNCCertificateFilepath: file[0].name
        }, () => {
            this.handleChange();
        })

        this.setState({
            ...this.state,
            PCNCCertificateExists: true,
            PCNCCertificateWebURL: url
        }, () => {
            console.log(JSON.stringify(this.state, null, 2))
            this.handleChange("PCNCCertificateExists");
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
        let {organizationName, email, username, password, SECCertificateWebURL, PCNCCertificateWebURL, about, bankNumbers } = this.state;

        console.log(`ALL VALID ${this.allValid()}`);

        if(this.allInputMade() && this.allValid()) {
            
            let successCredential = await auth().createUserWithEmailAndPassword(email, password)
            .then( credential => {
                let uid = credential.user.uid;

                let collectionRef = firestore().collection('users').doc(uid).set({
                    account_type: 'cso',
                    organizationName,
                    email,
                    username,
                    SECCertificateWebURL,
                    PCNCCertificateWebURL,
                    about,
                    bankNumbers,
                    verifiedByHR: false
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
                        console.log('error CSORegistrationScreen > handleRegister', error)
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