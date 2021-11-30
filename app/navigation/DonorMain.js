import React, { Component } from 'react'
import { Text, View } from 'react-native'

import {connect} from 'react-redux';
import auth from '@react-native-firebase/auth';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import Efforts from '../screens/donor/Efforts';
import Donations from '../screens/donor/Donations';

import MaterialCommunityIcons from 'react-native-vector-icons/FontAwesome5';

const Drawer = createDrawerNavigator();
const Tab = createMaterialBottomTabNavigator();

class DonorMain extends Component {

    render() {
        return (
            <NavigationContainer>
                <Drawer.Navigator initialRouteName="Home"
                drawerContent={(props) => <CustomDrawerContent {...props}></CustomDrawerContent>}
                >
                    <Drawer.Screen
                        name="Home"
                        component={DonorTabs}
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

class DonorTabs extends React.Component {
    render() {
        return (
            <Tab.Navigator>
                <Tab.Screen name="Efforts" component={Efforts} />
                <Tab.Screen name="Donations" component={Donations} options={ {
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="hand-holding-heart" color={color} size={20} />
                    )
                }}/>
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

export default connect(undefined, mapDispatchToProps)(DonorMain)
