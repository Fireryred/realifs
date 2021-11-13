import React from 'react';
import {ActivityIndicator, Text, View, Button, StyleSheet} from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import LoginScreen from './LoginScreen';

const Tab = createMaterialBottomTabNavigator();

export default class HomeScreen extends React.Component {  
    constructor(props) {
      super(props);
    }
    render() { 
      return (
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly',  }}>
          <Text>Home Screen</Text>

          {/* <Button
            title={`Go to Test Firebase`}
            onPress={() => {this.props.navigation.navigate('LoginScreen')}}
          />
          <Button
            title="Go to Test GoogleMaps"
            onPress={() => this.props.navigation.navigate('TestMapsScreen')}
          />
          <Button
            title="Go to Test Paymongo"
            onPress={() => this.props.navigation.navigate('TestPaymentScreen')}
          /> */}
        </View>
      )
    }
  }

  
const styles = StyleSheet.create({
    header: {
      fontWeight: 'bold',
      margin: 20
    },
  });