import React, {Component} from 'react';

import {connect} from 'react-redux';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import CashIn from '../screens/rider/CashIn';
import CashOut from '../screens/rider/CashOut';
import Fetch from '../screens/rider/Fetch';
import History from '../screens/rider/History';
import Wallet from '../screens/rider/Wallet';
import MapScreen from '../screens/rider/MapScreen';
import FetcherProfile from '../screens/rider/FetcherProfile';
import ContactSupport from '../screens/general/ContactSupport';
import Chat from '../screens/general/Chat';
import FetcherWalletProcess from '../screens/rider/FetcherWalletProcess';

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
const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

class RiderMain extends Component {
  render() {
    return (
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator>
          <Stack.Screen
            name="RiderDrawer"
            component={RiderDrawer}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Maps"
            component={MapScreen}
            options={{headerShown: false,  }}
          />
          <Stack.Screen
            name="FetcherProfile"
            component={FetcherProfile}
            options={{title: "Profile"}}
          />
          <Stack.Screen name="ContactSupport" component={ContactSupport} 
            options={{title: "Contact Support"}}/>
          <Stack.Screen name="Chat" component={Chat} 
            options={{title: "Chatting with Customer"}}/>
          <Stack.Screen
              name="CashIn"
              component={CashIn}
              options={{title: "Cash-in"}}
          />
          <Stack.Screen
            name="CashOut"
            component={CashOut}
            options={{title: "Cash-out"}}
          />
          <Stack.Screen
            name="FetcherWalletProcess"
            component={FetcherWalletProcess}
            options={{title: "Payment"}}
          />
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
        <DrawerItem
          label="My Profile"
          onPress={() => {
            this.props.navigation.navigate('FetcherProfile');
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
class RiderDrawer extends React.Component {
  render() {
    return (
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={props => (
          <CustomDrawerContent {...props}></CustomDrawerContent>
        )}>
        <Drawer.Screen name="Home" component={RiderTabs} />
      </Drawer.Navigator>
    );
  }
}

class RiderTabs extends React.Component {
  render() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Fetch"
          component={Fetch}
          options={{
            headerTitle: 'Fetch Request Pool',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons  name="truck-fast" color={color} size={20} />
            )
          }}
        />
        <Tab.Screen 
          name="History" 
          component={History}
          options={ {
            tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons  name="history" color={color} size={20} />
            )
          }}
        />
        <Tab.Screen
          name="Wallet"
          component={Wallet}
          options={{
            headerTitle: 'My Wallet',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons  name="wallet" color={color} size={20} />
            )
          }}
        />
      </Tab.Navigator>
    );
  }
}

async function handleLogout() {
  try {
    let uid = auth().currentUser.uid;
    firestore()
      .collection('users')
      .doc(uid)
      .update({
        fcmTokens: "",
      })
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
