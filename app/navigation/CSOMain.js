import React, {Component} from 'react';
import {Text, View} from 'react-native';

import {connect} from 'react-redux';
import auth from '@react-native-firebase/auth';

import {NavigationContainer} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

import Dashboard from '../screens/cso/Dashboard';
import IncomingDonations from '../screens/cso/IncomingDonations';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CreateDonationEffort} from '../screens/cso/CreateDonationEffort';
import CSOProfile from '../screens/cso/CSOProfile';
import ContactSupport from '../screens/general/ContactSupport';
import ViewDonationEffort from '../screens/cso/ViewDonationEffort';

const Drawer = createDrawerNavigator();
const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

class CSOMain extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="CSODrawer"
            component={CSODrawer}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="CreateDonationEffort"
            component={CreateDonationEffort}
          />
          <Stack.Screen
            name="CSOProfile"
            component={CSOProfile}
            options={{headerShown: true}}
          />
          <Stack.Screen
            name="ContactSupport"
            component={ContactSupport}
            options={{headerShown: true}}
          />
          <Stack.Screen
            name="ViewDonationEffort"
            component={ViewDonationEffort}
            options={{headerShown: true}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
class CSODrawer extends React.Component {
  render() {
    return (
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={props => (
          <CustomDrawerContent {...props}></CustomDrawerContent>
        )}>
        <Drawer.Screen name="Home" component={CSOTabs} />
      </Drawer.Navigator>
    );
  }
}
// By default, drawers can only contain links to other screens. Use this if you want a button that executes a function instead (like logout)
class CustomDrawerContent extends React.Component {
  render() {
    return (
      <DrawerContentScrollView {...this.props}>
        <DrawerItemList {...this.props} />
        <DrawerItem
          label="Profile"
          onPress={() => {
            this.props.navigation.navigate('CSOProfile');
          }}
        />
        <DrawerItem
          label="Contact Support"
          onPress={() => {
            this.props.navigation.navigate('ContactSupport');
          }}
        />
        <DrawerItem label="Logout" onPress={handleLogout} />
      </DrawerContentScrollView>
    );
  }
}

class CSOTabs extends React.Component {
  render() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Dashboard" component={Dashboard} />
        <Tab.Screen name="IncomingDonations" component={IncomingDonations} />
      </Tab.Navigator>
    );
  }
}

async function handleLogout() {
  try {
    auth().signOut();
  } catch (error) {
    console.log(error);
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch: dispatch,
  };
};

export default connect(undefined, mapDispatchToProps)(CSOMain);
