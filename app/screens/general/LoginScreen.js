import React, {Component} from 'react';
import {connect} from 'react-redux';
import  AuthAction from '../../redux/actions/AuthAction';
import {Button, Text, TextInput, View} from 'react-native';
import auth from '@react-native-firebase/auth';

class LoginScreen extends Component {

  constructor() {
    // This executes first. It is best to set declare state properties here.
    super();

    this.state = {
      inputEmail: 'realifs_johndoe3@gmail.com',
      inputPassword: 'test123456'
    }
  }
  
  componentDidMount() {
    // After component loads, this executes. It is best for fetching data asyncronously
    
    auth().onAuthStateChanged( (user) => {
      if(user) {
        // Signed in / Currently logged in

        let user_exploded = JSON.stringify(user, null, 2);
        console.log('onAuthStateChanged: Logged in as', user_exploded);

        this.props.dispatch(AuthAction.getActionLogin(user));
      } else {
        // Signed out / Not logged in

        console.log('onAuthStateChanged: No user logged in')
        this.props.dispatch(AuthAction.getActionLogin(null));
      }
    })
  }

  componentDidUpdate() {
    // After state and props change, this executes. It is best for updating other values in the state.
  }

  render() {
    // This executes before componentDidMount and componenDidUpdate. 

    const {email, password} = this.props;
    return (
      
      <View>
        <Text>Login</Text>

        {this.props.userSession ?
          (
            <View>
              <Text>Welcome {this.props.userSession.email}</Text>
              <Button 
                title="Logout"
                onPress={this.handleLogout}
              />
            </View>
          ) : 
          (
            <View>
              <TextInput placeholder="Email" value={this.state.inputEmail} />
              <TextInput
                placeholder="Password"
                secureTextEntry={true}
                value={this.state.inputPassword}
              />
              <Button
                title="Login"
                onPress={() => this.handleLogin(this.state.inputEmail, this.state.inputPassword)}
              />
              <Button
                title="Show AuthReducer's state"
                onPress={() => this.handleShow()}
              />
            </View>
          )
        }
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
      console.log(error);
    }
  }

  async handleLogout() {
    try {
      auth().signOut();

    } catch(error) {
      console.log(error);
    }
  }

  handleShow() {
    const {userSession} = this.props;
    let exploded = JSON.stringify(userSession, null, 2);
    alert(exploded);
  }

}

const mapStateToProps = state => {
  return {
    userSession: state.authReducer.userSession
  };
};
const mapDispatchToProps = dispatch => {
  return {
    dispatch: dispatch
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
