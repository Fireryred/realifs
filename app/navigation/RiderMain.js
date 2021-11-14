import React, { Component } from 'react'
import { Text, View } from 'react-native'

import {connect} from 'react-redux';
import auth from '@react-native-firebase/auth';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import Fetch from '../screens/rider/Fetch';
import History from '../screens/rider/History';
import Wallet from '../screens/rider/Wallet';

const Drawer = createDrawerNavigator();
const Tab = createMaterialBottomTabNavigator();

class RiderMain extends Component {

    render() {
        return (
            <NavigationContainer>
                <Drawer.Navigator initialRouteName="Home"
                drawerContent={(props) => <CustomDrawerContent {...props}></CustomDrawerContent>}
                >
                    <Drawer.Screen
                        name="Home"
                        component={RiderTabs}
                    />

                </Drawer.Navigator>  
            </NavigationContainer>
        )
    }
}

// By default, drawers can only contain links to other screens. Use this if you want a button that executes a function instead (like logout)
class CustomDrawerContent extends React.Component {
    render() {
        return (
            <DrawerContentScrollView {...this.props}>
                <DrawerItemList {...this.props} />
                <DrawerItem label="Logout" onPress={handleLogout} />
            </DrawerContentScrollView>
        )
    }
}

class RiderTabs extends React.Component {
    render() {
        return (
            <Tab.Navigator>
                <Tab.Screen name="Fetch" component={Fetch} />
                <Tab.Screen name="History" component={History} />
                <Tab.Screen name="Wallet" component={Wallet} />
            </Tab.Navigator>
        )
    }
}

async function handleLogout() {
    try {
        auth().signOut();

    } catch(error) {
        console.log(error);
    }
}

const mapDispatchToProps = dispatch => {
    return {
      dispatch: dispatch
    };
  };

export default connect(undefined, mapDispatchToProps)(RiderMain)
