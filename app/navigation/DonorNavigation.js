import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/general/HomeScreen';
import LoginScreen from '../screens/general/LoginScreen';
import Efforts from '../screens/general/Efforts';
import Donations from '../screens/general/Donations';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();


const Stack = createNativeStackNavigator();

export default class MainNavigation extends React.Component {
    render() {
        return (
            <NavigationContainer>
                {/* <Stack.Navigator initialRouteName="HomeScreen">
                    <Stack.Screen
                        name="HomeScreen"
                        component={HomeScreen}
                        options={{ title: 'Welcome'}}
                    />

                    <Stack.Screen
                        name="LoginScreen"
                        component={LoginScreen}
                        options={{ title: 'Login' }}
                    />
                </Stack.Navigator> */}

                <Tab.Navigator>
                    <Tab.Screen name="Efforts" component={Efforts} />
                    <Tab.Screen name="Donations" component={Donations} />
                </Tab.Navigator>
            </NavigationContainer>
        )
    }
}

