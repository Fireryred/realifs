import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import React, { Component } from 'react';

import {connect} from 'react-redux';
import AuthAction from '../../redux/actions/AuthAction';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { TextInput, Caption, Text, Button, Surface } from 'react-native-paper'

class CSOProfile extends Component {
    constructor() {
        super();
        this.state = {
            about: null,
            bankNumbers: null,
            email: null,
            organizationName: null,
            username: null,
            editMode: false,
            userData: {},
            loading: false,
            errors: {
                organizationName: {
                    empty: null,
                },
            }
        }
    }

    handleChange() {
        const {organizationName} = this.state;

        this.setState({
            ...this.state,
            errors: {
                organizationName: {
                    empty: !organizationName,
                },

            }
        }, () => {
            console.log(JSON.stringify(this.state, null, 2))
        })   
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

    async handleSave() {
        this.setLoading(true);
        let {organizationName, about, bankNumbers, loading } = this.state;
        
        console.log(`ALL VALID ${this.allValid()}`);

        if(this.allValid()) {
            let uid = this.props.auth.userSession.uid;
            await firestore().collection('users').doc(uid).update({
                organizationName,
                about,
                bankNumbers,
            }).then(() => {
                this.setEditMode(false);
                Alert.alert(undefined, "Successfully updated profile information")

                firestore().collection('users').doc(uid).get().then(doc => {
                    let updatedUserData = doc.data();
                    let currentUserSession = auth().currentUser;
                    this.props.dispatch(AuthAction.getActionLogin(currentUserSession, updatedUserData));
                    console.log("Updated Redux userData", updatedUserData);
                })
            }).catch(reason => {
                console.log("error edit profile", reason)
            }).finally(() => {
                this.setLoading(false);
            })

        } else {
            Alert.alert('Form invalid','Please fill up all the fields')
        }
    }

    componentDidMount() {
        this.setLoading(true);

        let uid = this.props.auth.userSession.uid;
        console.log(uid);
        firestore().collection('users').doc(uid).get()
            .then(doc => {
                let fetchedData = doc.data()
                this.setState({
                    email: fetchedData.email,
                    username: fetchedData.username,
                    organizationName: fetchedData.organizationName,
                    about: fetchedData.about,
                    bankNumbers: fetchedData.bankNumbers,
                }, () => {
                    this.handleChange();
                })

            })
            .catch(reason => {
                console.log("error getting user", reason)
            })
            .finally(() => {
                this.setLoading(false);
            })
    }
    setLoading(isLoading) {
        this.setState({
            ...this.state,
            loading: isLoading
        })
    }
    setEditMode(isEditMode) {
        this.setState({
            ...this.state,
            editMode: isEditMode
        })
    }
    render() {
        let {email, username, organizationName, about, bankNumbers, editMode, loading} = this.state;

        return (
            <>
            {!editMode && 
            <ScrollView style={styles.container}>
                <Surface style={styles.editBtnContainer}>
                    <Button 
                        style={styles.editBtn}
                        mode="contained"
                        onPress={() => {
                            this.setEditMode(true);
                        }}
                    >Edit</Button>
                </Surface>
                <Caption>Organization Name</Caption>
                <Text style={styles.text}>{organizationName}</Text>
                <Caption>About</Caption>
                <Text style={styles.text}>{(this.state.about ? this.state.about + "" : "").replace(`\\n`, `\n`)}</Text>
                <Caption>Bank/E-wallet Numbers</Caption>
                <Text style={styles.text}>{(this.state.bankNumbers ? this.state.bankNumbers + "" : "").replace(`\\n`, `\n`)}</Text>
                <Caption>Email</Caption>
                <Text style={styles.text}>{email}</Text>
                <Caption>Username</Caption>
                <Text style={styles.text}>{username}</Text>
            </ScrollView>
            }
            {editMode && 
            <ScrollView style={styles.container}>
                <Caption>Organization Name</Caption>
                <TextInput 
                    style={styles.text}
                    value={organizationName}
                    onChangeText={(text) => { 
                        this.setState({
                            ...this.state,
                            organizationName: text
                        }, () => {
                            this.handleChange()
                        })
                    }}
                />
                { this.state.errors.organizationName.empty && <Text style={styles.errorText}>Must not empty</Text> }
                
                <Caption>About</Caption>
                <TextInput 
                    style={styles.text}
                    value={about}
                    multiline={true}
                    onChangeText={(text) => { 
                        this.setState({
                            ...this.state,
                            about: text
                        }, () => {
                            this.handleChange()
                        })
                    }}
                />

                <Caption>Bank/E-wallet Numbers</Caption>
                <TextInput 
                    style={styles.text}
                    value={bankNumbers}
                    multiline={true}
                    onChangeText={(text) => { 
                        this.setState({
                            ...this.state,
                            bankNumbers: text
                        }, () => {
                            this.handleChange()
                        })
                    }}
                />
                <Caption>Email</Caption>
                <TextInput
                    disabled={true}
                    style={styles.text}
                    value={email}
                />
                <Caption>Username</Caption>
                <TextInput 
                    disabled={true}
                    style={styles.text}
                    value={username}
                />
                <Surface style={styles.editModeBtnsContainer}>
                    <Button 
                        style={styles.cancelBtn}
                        mode="contained"
                        color='gray'
                        onPress={() => {
                            this.setEditMode(false);
                        }}
                    >Cancel</Button>
                    <Button 
                        style={styles.saveBtn}
                        mode="contained"
                        onPress={() => {
                            this.handleSave();
                        }}
                    >Save</Button>
                </Surface>
            </ScrollView>
            }
            </>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        padding: 10
    },
    text: {
        marginBottom: 20
    },
    editBtnContainer:{
        display:'flex', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        backgroundColor: 'none'
    },
    editBtn: {
        backgroundColor: 'rgba(180,180,180,1)'
    },
    editModeBtnsContainer: {
        display:'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-evenly', 
        backgroundColor: 'none',
        marginBottom: 20
    },
    cancelBtn: {
    },
    saveBtn: {

    },
    errorText: {
        color: 'red'
    }
});

const mapStateToProps = state => {
    return {
      auth: state.authReducer
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
      dispatch: dispatch
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(CSOProfile);