import React, { Component } from 'react'
import { Text, View } from 'react-native'

import {connect} from 'react-redux';
import auth from '@react-native-firebase/auth';

import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Efforts from '../screens/donor/Efforts';
import Donations from '../screens/donor/Donations';
import EffortDetails from '../screens/donor/EffortDetails'
import RequestFetch from '../screens/donor/RequestFetch'
import PayFetchRequest from '../screens/donor/PayFetchRequest'
import ContactSupport from '../screens/general/ContactSupport';
import DonorProfile from '../screens/donor/DonorProfile';
import TrackFetcher from '../screens/donor/TrackFetcher';
import CSOInfo from '../screens/donor/CSOInfo';
import Chat from '../screens/general/Chat';

import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { DefaultTheme as PaperDefaultTheme, Provider as PaperProvider } from 'react-native-paper';

const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: "white",
    },
};

const Drawer = createDrawerNavigator();
const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

class DonorMain extends Component {

    render() {
        return (
            <NavigationContainer theme={MyTheme}>
                <Stack.Navigator>
                    <Stack.Screen name="DonorDrawer" component={DonorDrawer} 
                        options={{headerShown: false}}/>
                    <Stack.Screen name="EffortDetails" component={EffortDetails} 
                        options={{title: "Effort Details"}}/>
                    <Stack.Screen name="RequestFetch" component={RequestFetch} 
                        options={{title: "Request to Fetch Donation"}}/>
                    <Stack.Screen name="ContactSupport" component={ContactSupport} 
                        options={{title: "Contact Support"}}/>
                    <Stack.Screen name="PayFetchRequest" component={PayFetchRequest} 
                        options={{title: "Payment"}}/>
                    <Stack.Screen name="DonorProfile" component={DonorProfile} 
                        options={{title: "Profile"}}/>
                    <Stack.Screen name="TrackFetcher" component={TrackFetcher} 
                        options={{title: "Track Fetcher"}}/>
                    <Stack.Screen name="CSOInfo" component={CSOInfo} 
                        options={{title: "CSO Information"}}/>
                    <Stack.Screen name="Chat" component={Chat} 
                        options={{title: "Chatting with Fetcher"}}/>
                </Stack.Navigator>
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
                <DrawerItem label="My Profile" onPress={() => {
                    this.props.navigation.navigate("DonorProfile")
                }} />
                <DrawerItem label="Contact Support" onPress={() => {
                    this.props.navigation.navigate("ContactSupport")
                }} />
                <DrawerItem label="Logout" onPress={handleLogout} />
            </DrawerContentScrollView>
        )
    }
}

class DonorTabs extends React.Component {
    render() {
        return (
            <Tab.Navigator>
                <Tab.Screen 
                    name="Efforts" 
                    component={Efforts} 
                    options={ {
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons  name="map-marker-radius" color={color} size={20} />
                        )
                    }}
                    listeners={{
                        tabPress: (e) => {
                            // Prevent default action
                            // e.preventDefault();
                            this.props.navigation.setOptions({title: 'Donation Efforts'});
                        }
                    }}
                />
                <Tab.Screen 
                    name="Donations" 
                    component={Donations} 
                    options={ {
                        tabBarIcon: ({ color }) => (
                            <FontAwesome name="hand-holding-heart" color={color} size={20} />
                        )
                    }}
                    listeners={{
                        tabPress: (e) => {
                            // Prevent default action
                            // e.preventDefault();
                            this.props.navigation.setOptions({title: 'Donations'});
                        }
                    }}
                    />
            </Tab.Navigator>
        )
    }
}


class DonorDrawer extends React.Component {
    render() {
        return (
            <Drawer.Navigator 
                initialRouteName="Home"
                drawerContent={(props) => <CustomDrawerContent {...props}></CustomDrawerContent>}
                
            >
                <Drawer.Screen
                    name="Home"
                    component={DonorTabs}
                    headerShown={false}
                />

            </Drawer.Navigator> 
        );
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
