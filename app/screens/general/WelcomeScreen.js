import React, { Component } from 'react'
import { StyleSheet, View, ScrollView, Alert, Image } from 'react-native'

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

import {realifsLogoText, welcomeBg} from '../../assets' 

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
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 10, backgroundColor: "white"}}>
                <Image
                    source={realifsLogoText}
                    resizeMode='contain'
                    style={{width: "100%", height: 175, marginVertical: 100}}
                />
                <Button
                    title="Login"
                    onPress={() => {this.props.navigation.navigate("LoginScreen")}}
                    mode="contained"
                    style={ {width: '100%', marginBottom: 20} }
                >Login</Button>
                <Button
                    title="Register"
                    onPress={() => {this.props.navigation.navigate("RegisterScreen")}}
                    mode="contained"
                    style={ {width: '100%'} }
                >Register</Button>
                {/* <Image
                    source={welcomeBg}
                    resizeMode='contain'
                    style={{position: "absolute", bottom: 0, width: "100%", height: 200}}
                /> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10
    }
})
