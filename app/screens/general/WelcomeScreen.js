import React, { Component } from 'react'
import { StyleSheet, View, ScrollView, Alert, Image } from 'react-native'

import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import LoginPortal from './LoginPortal';
import DonorLoginScreen from './DonorLoginScreen';
import RiderLoginScreen from './RiderLoginScreen';
import CSOLoginScreen from './CSOLoginScreen';
import RegisterScreen from './RegisterScreen';
import DonorRegistrationScreen from './DonorRegistrationScreen';
import RiderRegistrationScreen from './RiderRegistrationScreen';
import CSORegistrationScreen from './CSORegistrationScreen';
import ForgotPassword from './ForgotPassword';
import PrivacyPolicy from './PrivacyPolicy';
import BrowseEfforts from './BrowseEfforts';

import {realifsLogoText, welcomeBg} from '../../assets' 

// UI Override
import { TextInput, Button, Text, IconButton } from 'react-native-paper'

import { DefaultTheme as PaperDefaultTheme, Provider as PaperProvider } from 'react-native-paper';

const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: "white",
    },
};

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

export default class WelcomeScreen extends Component {
    render() {
        return (
            <NavigationContainer theme={MyTheme}>
                <Stack.Navigator initialRouteName="WelcomeScreenComponent">
                    <Stack.Screen
                        name="WelcomeScreenComponent"
                        component={WelcomeScreenComponent}
                        options={{ title: 'Welcome'}}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="LoginPortal"
                        component={LoginPortal}
                        options={{ title: 'Login Portal'}}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="DonorLoginScreen"
                        component={DonorLoginScreen}
                        options={{ title: 'Donor Login'}}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="RiderLoginScreen"
                        component={RiderLoginScreen}
                        options={{ title: 'Fetcher Login'}}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="CSOLoginScreen"
                        component={CSOLoginScreen}
                        options={{ title: 'CSO Administrator Login'}}
                    ></Stack.Screen>
                    {/* <Stack.Screen
                        name="LoginScreen"
                        component={LoginScreen}
                        options={{ title: 'Login Portal'}}
                    ></Stack.Screen> */}
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
                        options={{ title: 'Register as Fetcher'}}
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

                    <Stack.Screen
                        name="PrivacyPolicy"
                        component={PrivacyPolicy}
                        options={{ title: 'Privacy Policy'}}
                    ></Stack.Screen>

                    <Stack.Screen
                        name="BrowseEfforts"
                        component={BrowseEfforts}
                        options={{ title: 'Browse Efforts'}}
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
                <View
                    style={ {position: "absolute", top: 0, right: 0, margin: 10} }
                >
                    <IconButton
                        accessibilityLabel="Browse"
                        icon="map-marker-radius"
                        color={PaperDefaultTheme.colors.primary}
                        style={{borderColor: PaperDefaultTheme.colors.primary, borderWidth: 1}}
                        size={20}
                        onPress={() => {this.props.navigation.navigate("BrowseEfforts")}}
                    />
                </View>
                
                <Image
                    source={realifsLogoText}
                    resizeMode='contain'
                    style={{width: "100%", height: 175, marginVertical: 50}}
                />
                <Button
                    title="Login"
                    onPress={() => {this.props.navigation.navigate("LoginPortal")}}
                    mode="contained"
                    style={ {width: '100%', marginBottom: 20} }
                >Login</Button>
                <Button
                    title="Register"
                    onPress={() => {this.props.navigation.navigate("RegisterScreen")}}
                    mode="contained"
                    style={ {width: '100%'} }
                >Register</Button>
                <Image
                    source={welcomeBg}
                    resizeMode='contain'
                    style={{position: "absolute", bottom: -20, width: "100%", height: 200}}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10
    }
})
