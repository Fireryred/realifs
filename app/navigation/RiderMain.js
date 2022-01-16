import React, {Component} from 'react';

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
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Fetch from '../screens/rider/Fetch';
import History from '../screens/rider/History';
import Wallet from '../screens/rider/Wallet';
import MapScreen from '../screens/rider/MapScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

class RiderMain extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={RiderTabs} />
          <Stack.Screen name="RiderDrawer" component={RiderDrawer} />
        </Stack.Navigator>
      </NavigationContainer>
    );
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
    );
  }
}
class RiderDrawer extends React.Component {
  render() {
    return (
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name="Home"
          component={RiderDrawer}
          headerShown={false}
        />
      </Drawer.Navigator>
    );
  }
}

class RiderTabs extends React.Component {
  render() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Fetch" component={FetchStack} />
        <Tab.Screen name="History" component={History} />
        <Tab.Screen name="Wallet" component={Wallet} />
      </Tab.Navigator>
    );
  }
}

class FetchStack extends React.Component {
  render() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Fetch" component={Fetch} />
        <Stack.Screen name="Maps" component={MapScreen} />
      </Stack.Navigator>
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

export default connect(undefined, mapDispatchToProps)(RiderMain);
