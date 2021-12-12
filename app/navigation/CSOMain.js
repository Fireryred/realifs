import React, { Component } from 'react'
import { Text, View } from 'react-native'

import {connect} from 'react-redux';
import auth from '@react-native-firebase/auth';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import Dashboard from '../screens/cso/Dashboard';
import IncomingDonations from '../screens/cso/IncomingDonations';

const Drawer = createDrawerNavigator();
const Tab = createMaterialBottomTabNavigator();

class CSOMain extends Component {

    render() {
        return (
            <NavigationContainer>
                <Drawer.Navigator initialRouteName="Home"
                drawerContent={(props) => <CustomDrawerContent {...props}></CustomDrawerContent>}
                >
                    <Drawer.Screen
                        name="Home"
                        component={CSOTabs}
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

class CSOTabs extends React.Component {
    render() {
        return (
            <Tab.Navigator>
                <Tab.Screen name="Dashboard" component={Dashboard} />
                <Tab.Screen name="IncomingDonations" component={IncomingDonations} />
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

export default connect(undefined, mapDispatchToProps)(CSOMain)
