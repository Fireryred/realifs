import React from 'react';
import {BackHandler, Button, Linking, View} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirection from 'react-native-maps-directions';
import Geolocation from 'react-native-geolocation-service';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';

import MapStyles from '../../styles/MapStyles';

class MapScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      location: {},
      pickup: {
        latitude: 14.5816775,
        longitude: 121.0861183,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      dropoff: {latitude: 14.5816775, longitude: 121.0861183},
      status: '',
      transitButton: false,
    };
    this.mapRef = React.createRef();
  }
  componentWillUnmount() {
    ReactNativeForegroundService.stop();
  }
  componentDidUpdate() {
    const {data} = this.props.route.params;
    const {transitButton} = this.state;
    console.log(transitButton);
    if (data[1].status === 'waiting' || transitButton) {
      this.props.navigation.goBack();
    }
  }
  componentDidMount() {
    if (!ReactNativeForegroundService.is_running()) {
      this.startGeolocationService();
    }
    this.updateConfirmButtonText();
    this.disableBackButton();
    this.setPickupDropoff();
  }
  getCurrentLocation() {
    Geolocation.setRNConfiguration();
    Geolocation.getCurrentPosition(
      location => {
        console.log(location);
        const {latitude, longitude} = location.coords;
        this.setState({
          location: {
            latitude: latitude,
            longitude: longitude,
          },
        });
      },
      error => {
        console.error(error);
      },
    );
  }
  setPickupDropoff() {
    const {pickup, dropoff} = this.props.route.params.data[1];
    this.getCurrentLocation();
    this.setState({
      pickup: {
        latitude: pickup._latitude,
        longitude: pickup._longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      dropoff: {latitude: dropoff._latitude, longitude: dropoff._longitude},
    });
  }
  autoZoom() {
    //show all markers(zoom automatically)
    const edgePadding = {top: 50, bottom: 50, left: 50, right: 50};
    const {pickup, dropoff} = this.state;
    const {mapRef} = this;
    if (mapRef.current) {
      mapRef.current.fitToCoordinates([pickup, dropoff], {
        edgePadding: edgePadding,
      });
    }
  }
  startGeolocationService() {
    ReactNativeForegroundService.remove_all_tasks();
    ReactNativeForegroundService.add_task(() => this.updateRiderLocToDB(), {
      delay: 10000,
      onLoop: true,
      taskId: 'taskId',
      onError: error => console.error(error),
    });
    ReactNativeForegroundService.start({
      id: 144,
      title: 'Realifs',
      message: 'This app uses your location',
    });
  }
  async updateRiderLocToDB() {
    this.getCurrentLocation();
    const {location} = this.state;
    const {data} = this.props.route.params;
    await firestore()
      .collection('fetch_requests')
      .doc(data[0])
      .update({riderLocation: location})
      .then(() => console.log("Rider's location updated"));
  }

  disableBackButton() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
  }

  async updateStatus() {
    let cStatus = '';
    const {data} = this.props.route.params;
    const {status} = data[1];
    switch (status) {
      case 'pickup':
        cStatus = 'transit';
        break;
      case 'transit':
        this.setState({transitButton: true});
        cStatus = 'transit';
        break;
    }
    data[1].status = cStatus;
    await firestore()
      .collection('fetch_requests')
      .doc(data[0])
      .update({status: cStatus})
      .then(() => console.log('Status Updated'));
  }

  updateConfirmButtonText() {
    let text = '';
    const {status, paymentMethod} = this.props.route.params.data[1];
    switch (paymentMethod) {
      case 'cod':
        text = 'FEES COLLECTED';
        break;
      case 'online':
        text = 'PICKUP DONE';
        break;
    }
    switch (status) {
      case 'transit':
        text = 'DELIVERY DONE';
        break;
    }
    this.setState({status: text});
    console.log(status);
  }

  handleConfirmButton = () => {
    this.updateStatus();
    this.updateConfirmButtonText();
  };
  render() {
    const {location, pickup, dropoff, status} = this.state;

    const toPickup = `https://www.google.com/maps/dir/?api=1&origin=Your Location&destination=${pickup.latitude},${pickup.longitude}`;
    const toDropoff = `https://www.google.com/maps/dir/?api=1&origin=${pickup.latitude},${pickup.longitude}&destination=${dropoff.latitude},${dropoff.longitude}`;
    return (
      <View style={MapStyles.container}>
        <MapView
          ref={this.mapRef}
          onLayout={() => this.autoZoom()}
          style={MapStyles.map}
          provider={PROVIDER_GOOGLE}
          region={pickup}>
          <Marker coordinate={pickup}></Marker>
          <Marker coordinate={dropoff}></Marker>
          <MapViewDirection
            origin={pickup}
            destination={dropoff}
            apikey={'AIzaSyDIbDFd-QJ0MicKOvggJ6kmpHaDXMXuOfA'} //hide this
            strokeWidth={4}
            strokeColor="royalblue"></MapViewDirection>
        </MapView>
        <Button
          title="Go to CurrentLocation -> Pickup"
          onPress={() => Linking.openURL(toPickup)}
        />
        <Button
          title="Go to Pickup -> Dropoff"
          onPress={() => Linking.openURL(toDropoff)}
        />
        <Button title={status} onPress={() => this.handleConfirmButton()} />
      </View>
    );
  }
}

export default MapScreen;
