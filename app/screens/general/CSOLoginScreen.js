import React, {Component} from 'react';
import {connect} from 'react-redux';
import { View, Alert, StyleSheet, Modal} from 'react-native';
import auth from '@react-native-firebase/auth';

import { Text, Button, TextInput } from 'react-native-paper'

class CSOLoginScreen extends Component {

  constructor() {
    // This executes first. It is best to set declare state properties here.
    // Read more: https://reactjs.org/docs/react-component.html#the-component-lifecycle
    
    super();

    this.state = {
      CSOCredentials: {
        inputEmail: 'realifs.cso1@gmail.com',
        inputPassword: 'password'
      },
      modalVisible: false,
    }
  }

  setModalVisibility = (visibilityBool = false) => {
    this.setState({
      ...this.state,
      modalVisible: visibilityBool
    })
  }
  
  componentDidMount() {
    // This executes only once, after render loads.
    
  }

  componentDidUpdate() {
    // Everytime state and props change, this executes.
  }

  validInput() {
    let result = true;

    if(!this.state.CSOCredentials.inputEmail || this.state.CSOCredentials.inputEmail == ""  || !this.state.CSOCredentials.inputPassword || this.state.CSOCredentials.inputPassword == "") {
      result = false;
    }

    console.log(this.state)
    return result;
  }

  render() {
    // This executes before componentDidMount and componenDidUpdate. Best not to put logic here

    return (
      <View style={{flex: 1, padding:10, marginTop: 25}}>
        <Text style={{fontWeight: "bold"}}>Email</Text>
        <View style={{marginBottom: 15}}>
          <TextInput 
            mode="outlined"
            value={this.state.CSOCredentials.inputEmail} 
            onChangeText={(text) => { 
              this.setState({
                CSOCredentials: {
                  ...this.state.CSOCredentials,
                  inputEmail: text
                }
              })
            }}
          />
        </View>

        <View style={{marginBottom: 15}}>
          <Text style={{fontWeight: "bold"}}>Password</Text>
          <TextInput
            mode="outlined"
            placeholder="Password"
            secureTextEntry={true}
            value={this.state.CSOCredentials.inputPassword}
            onChangeText={(text) => { 
              this.setState({
                CSOCredentials: {
                  ...this.state.CSOCredentials,
                  inputPassword: text
                }
              })
            }}
          />
        </View>
        <Button
          mode="contained"
          title="Login as CSO Administrator"
          onPress={() => {
            if(this.validInput()) {
              this.setModalVisibility(true);
              this.handleLogin(this.state.CSOCredentials.inputEmail, this.state.CSOCredentials.inputPassword);
            }
          }}
        >Login as CSO Administrator</Button>

        <Text 
          style={styles.forgotPassword}
          onPress={() => {this.props.navigation.navigate("ForgotPassword")}}
        >Forgot Password?</Text>

        <Modal 
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Please wait..</Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // BELOW ARE CUSTOM FUNCTIONS

  async handleLogin(email, password) {
    await auth().signOut().catch(error => { console.log("No user to log out") });

    try {
      console.log(`Trying to login using ${email} and ${password}`);
      
      // I don't know if the returned credentials can be used for anything
      let credentials = await auth().signInWithEmailAndPassword(email, password);
    } catch(error) {
      Alert.alert('Login Failed', error.toString())
      console.log(error);
    }
  }

}

const styles = StyleSheet.create({
  forgotPassword: {
    textAlign: 'center',
    marginTop: 20,
    color: 'blue'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
})

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

export default connect(mapStateToProps, mapDispatchToProps)(CSOLoginScreen);
