import React from 'react';
import {
  BackHandler,
  Linking,
  View,
  Dimensions,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirection from 'react-native-maps-directions';
import Geolocation from 'react-native-geolocation-service';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';

import MapStyles from '../../styles/MapStyles';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
  TextInput,
  Button,
  Text,
  Checkbox,
  Surface,
  Subheading,
  RadioButton,
  Portal,
  Provider,
  Title,
  Headline,
  Caption,
} from 'react-native-paper';
import {
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';

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
      donorData: null,
      dimensions: {
        window: Dimensions.get('window'),
        screen: Dimensions.get('screen'),
      },
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
    this.getDonorData();

    Dimensions.addEventListener('change', ({window, screen}) => {
      console.log('screen', screen);
      this.setState({
        ...this.state,
        dimensions: {
          window,
          screen,
        },
      });
    });
  }
  async setPermission() {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
  }
  getCurrentLocation() {
    this.setPermission();
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
    const edgePadding = {top: 75, bottom: 0, left: 0, right: 0};
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
      this.props.navigation.replace('RiderDrawer');
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

  getDonorData = async () => {
    let donorData = await firestore()
      .collection('users')
      .doc(this.props.route.params.data[1].donorID)
      .get();

    this.setState({
      ...this.state,
      donorData: donorData.data(),
    });
  };

  render() {
    const {location, pickup, dropoff, status} = this.state;
    const {pickupAddress, dropoffAddress} = this.props.route.params.data[1];

    console.log('height', this.state?.dimensions?.screen?.height);
    const toPickup = `https://www.google.com/maps/dir/?api=1&origin=Your Location&destination=${pickup.latitude},${pickup.longitude}`;
    const toDropoff = `https://www.google.com/maps/dir/?api=1&origin=${pickup.latitude},${pickup.longitude}&destination=${dropoff.latitude},${dropoff.longitude}`;
    return (
      <View
        style={{
          ...MapStyles.container,
          width: this.state?.dimensions?.window?.width,
        }}>
        <MapView
          ref={this.mapRef}
          onRegionChangeComplete={() => this.autoZoom()}
          style={{
            height: this.state?.dimensions?.window?.height / 2,
            width: this.state?.dimensions?.window?.width,
            marginBottom: 10,
          }}
          provider={PROVIDER_GOOGLE}
          initialRegion={pickup}>
          <Marker coordinate={pickup}></Marker>
          <Marker coordinate={dropoff}></Marker>
          <MapViewDirection
            origin={pickup}
            destination={dropoff}
            apikey={'AIzaSyDIbDFd-QJ0MicKOvggJ6kmpHaDXMXuOfA'} //hide this
            strokeWidth={4}
            strokeColor="royalblue"></MapViewDirection>
        </MapView>
        <View
          style={{
            height: this.state?.dimensions?.window?.height / 2,
            width: this.state?.dimensions?.window?.width,
            paddingHorizontal: 10,
            display: 'flex',
            flexDirection: 'column',
          }}>
          <View>
            <View
              style={{
                borderColor: '#444444',
                borderLeftWidth: 3,
                paddingLeft: 10,
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: 15,
                }}>
                <View
                  style={{
                    flex: 7,
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                  }}>
                  <Text style={{color: 'gray', fontWeight: 'bold'}}>
                    PICK-UP
                  </Text>
                  <Text>{pickupAddress}</Text>
                </View>
                <View
                  style={{
                    flex: 3,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      height: 40,
                      width: 40,
                      padding: 0,
                      borderRadius: 40,
                      backgroundColor: PaperDefaultTheme.colors.primary,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => Linking.openURL(toPickup)}>
                    <Ionicons name="navigate" size={25} color="red" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{display: 'flex', flexDirection: 'row'}}>
                <View
                  style={{
                    flex: 7,
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                  }}>
                  <Text style={{color: 'gray', fontWeight: 'bold'}}>
                    DROP-OFF
                  </Text>
                  <Text>{dropoffAddress}</Text>
                </View>
                <View
                  style={{
                    flex: 3,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      height: 40,
                      width: 40,
                      padding: 0,
                      borderRadius: 40,
                      backgroundColor: PaperDefaultTheme.colors.primary,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => Linking.openURL(toDropoff)}>
                    <Ionicons name="navigate" size={25} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View
              style={{display: 'flex', flexDirection: 'row', marginTop: 15}}>
              <View
                style={{
                  flex: 7,
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}>
                <Title>Customer Details</Title>
                <Text style={{fontWeight: 'bold'}}>{`${
                  this.state?.donorData?.firstname || ''
                } ${this.state?.donorData?.lastname || ''}`}</Text>
                <Text>{`${this.state?.donorData?.mobileNumber || ''}`}</Text>
              </View>
              <View
                style={{
                  flex: 3,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    height: 40,
                    width: 40,
                    padding: 0,
                    borderRadius: 40,
                    backgroundColor: PaperDefaultTheme.colors.primary,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.props.navigation.navigate('Chat', {
                      fetchRequestId: this.props.route.params.data[0],
                    });
                  }}>
                  <MaterialIcons name="chat" size={25} color="gold" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            width: '100%',
            position: 'absolute',
            bottom: 0,
            padding: 10,
          }}>
          <Button
            contentStyle={{height: 50}}
            mode="contained"
            onPress={() => this.handleConfirmButton()}>
            {status}
          </Button>
        </View>
      </View>
    );
  }
}

export default MapScreen;
