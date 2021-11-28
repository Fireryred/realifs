import React from 'react';
import {View} from 'react-native';
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
  }
  render() {
    const {origin, destination} = this.state;
    Geolocation.setRNConfiguration();
    Geolocation.getCurrentPosition(
      location => {
        origin.latitude = location.coords.latitude;
        origin.longitude = location.coords.longitude;
        console.log(location);
      },
      error => {
        console.error(error);
      },
    );
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
            apikey={
              'AIzaSyDIbDFd-QJ0MicKOvggJ6kmpHaDXMXuOfA'
            }></MapViewDirection>
        </MapView>
      </View>
    );
  }
}

export default MapScreen;
