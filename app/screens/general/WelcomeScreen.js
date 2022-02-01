import React, { Component } from 'react'
import { StyleSheet, View, ScrollView, Alert } from 'react-native'

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import DonorRegistrationScreen from './DonorRegistrationScreen';
import RiderRegistrationScreen from './RiderRegistrationScreen';
import CSORegistrationScreen from './CSORegistrationScreen';
import ForgotPassword from './ForgotPassword';

// UI Override
import { TextInput, Button, Text } from 'react-native-paper'

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

export default class WelcomeScreen extends Component {
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName="WelcomeScreenComponent">
                    <Stack.Screen
                        name="WelcomeScreenComponent"
                        component={WelcomeScreenComponent}
                        options={{ title: 'Welcome'}}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="LoginScreen"
                        component={LoginScreen}
                        options={{ title: 'Login Portal'}}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="RegisterScreen"
                        component={RegisterScreen}
                        options={{ title: 'Register Portal'}}
                    ></Stack.Screen>

                    <Stack.Screen
                        name="DonorRegistrationScreen"
                        component={DonorRegistrationScreen}
                        options={{ title: 'Register as Donor'}}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="RiderRegistrationScreen"
                        component={RiderRegistrationScreen}
                        options={{ title: 'Register as Rider'}}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="CSORegistrationScreen"
                        component={CSORegistrationScreen}
                        options={{ title: 'Register as CSO Administrator'}}
                    ></Stack.Screen>

                    <Stack.Screen
                        name="ForgotPassword"
                        component={ForgotPassword}
                        options={{ title: 'Forgot Password'}}
                    ></Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
            
        )
    }
}


class WelcomeScreenComponent extends Component {
    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', padding: 10}}>
                <Text>Welcome to REALIFS!</Text>
                <Button
                    title="Login"
                    onPress={() => {this.props.navigation.navigate("LoginScreen")}}
                    mode="contained"
                    style={ {width: '100%'} }
                >Login</Button>
                <Button
                    title="Register"
                    onPress={() => {this.props.navigation.navigate("RegisterScreen")}}
                    mode="contained"
                    style={ {width: '100%'} }
                >Register</Button>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10
    }
})
