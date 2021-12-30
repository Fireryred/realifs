import React from 'react';
import {Button, Linking, View} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapStyles from '../../styles/MapStyles';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirection from 'react-native-maps-directions';

class MapScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      origin: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      destination: {
        latitude: 14.559776337593197,
        longitude: 121.00805475813596,
      },
    };
    Geolocation.setRNConfiguration();
    Geolocation.getCurrentPosition(
      location => {
        this.setState({
          origin: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          },
        });
        console.log(location);
      },
      error => {
        console.error(error);
      },
    );
  }
  render() {
    const {origin, destination} = this.state;

    const url = `https://www.google.com/maps/dir/?api=1&origin=Your Location&destination=${destination.latitude},${destination.longitude}`;
    console.log(url);
    return (
      <View style={MapStyles.container}>
        <MapView
          style={MapStyles.map}
          provider={PROVIDER_GOOGLE}
          region={origin}
          showsUserLocation={true}>
          <Marker coordinate={origin}></Marker>
          <Marker coordinate={destination}></Marker>
          <MapViewDirection
            origin={origin}
            destination={destination}
            apikey={'AIzaSyDIbDFd-QJ0MicKOvggJ6kmpHaDXMXuOfA'}
            strokeWidth={4}
            strokeColor="royalblue"></MapViewDirection>
        </MapView>
        <Button
          title="Go to Google Map App"
          onPress={() => Linking.openURL(url)}
        />
      </View>
    );
  }
}

export default MapScreen;
