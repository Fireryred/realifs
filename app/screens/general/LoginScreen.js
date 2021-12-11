import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Button, Text, TextInput, View, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';

class LoginScreen extends Component {

  constructor() {
    // This executes first. It is best to set declare state properties here.
    // Read more: https://reactjs.org/docs/react-component.html#the-component-lifecycle
    
    super();

    this.state = {
      donorCredentials: {
        inputEmail: 'remer.irineo@gmail.com',
        inputPassword: 'test123456'
      },

      riderCredentials: {
        inputEmail: '201801360@iacademy.edu.ph',
        inputPassword: 'test123456'
      },

      CSOCredentials: {
        inputEmail: 'realifs.cso1@gmail.com',
        inputPassword: 'test123456'
      }
      
    }
  }
  
  componentDidMount() {
    // This executes only once, after render loads.
  }

  componentDidUpdate() {
    // Everytime state and props change, this executes.
  }

  render() {
    // This executes before componentDidMount and componenDidUpdate. Best not to put logic here

    return (
      <View>
        <Text>Login Screen</Text>

            <View>
              <TextInput placeholder="Email" value={this.state.donorCredentials.inputEmail} />
              <TextInput
                placeholder="Password"
                secureTextEntry={true}
                value={this.state.donorCredentials.inputPassword}
              />
              <Button
                title="Login as Donor"
                onPress={() => this.handleLogin(this.state.donorCredentials.inputEmail, this.state.donorCredentials.inputPassword)}
              />


              <TextInput placeholder="Email" value={this.state.riderCredentials.inputEmail} />
              <TextInput
                placeholder="Password"
                secureTextEntry={true}
                value={this.state.riderCredentials.inputPassword}
              />
              <Button
                title="Login as Rider"
                onPress={() => this.handleLogin(this.state.riderCredentials.inputEmail, this.state.riderCredentials.inputPassword)}
              />


              <TextInput placeholder="Email" value={this.state.CSOCredentials.inputEmail} />
              <TextInput
                placeholder="Password"
                secureTextEntry={true}
                value={this.state.CSOCredentials.inputPassword}
              />
              <Button
                title="Login as CSO Administrator"
                onPress={() => this.handleLogin(this.state.CSOCredentials.inputEmail, this.state.CSOCredentials.inputPassword)}
              />
            </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
