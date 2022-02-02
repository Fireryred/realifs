/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import React from 'react';
import {Provider} from 'react-redux';
import store from './app/redux/store';

import ReactNativeForegroundService from '@supersami/rn-foreground-service';

const RNRedux = () => (
  <Provider store={store}>
    <App />
  </Provider>
);
ReactNativeForegroundService.register();
AppRegistry.registerComponent(appName, () => RNRedux);
