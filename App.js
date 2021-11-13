import React, {Fragment} from 'react';
import {ActivityIndicator, Text, View, Button, StyleSheet} from 'react-native';
import {connect} from 'react-redux';

import DonorNavigation from './app/navigation/DonorNavigation';
import LoginScreen from './app/screens/general/LoginScreen';

class App extends React.Component {
  componentDidMount() {
    console.log(JSON.stringify(this.props.userSession, null, 2))
  }

  render() {
    return (
        <Fragment>
          {this.props.userSession ?
          (
            <DonorNavigation/>
          ) : 

          (
            <View><Text> Go to Login Screen </Text></View>
          )
        }
        </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userSession: ''
})

export default connect(mapStateToProps)(App)