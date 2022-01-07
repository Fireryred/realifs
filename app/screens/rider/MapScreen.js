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
      location: {},
      pickup: {},
      dropoff: {},
    };
  }
  componentDidMount() {
    const {pickup, dropoff} = this.props.route.params.data[1];
    Geolocation.setRNConfiguration();
    Geolocation.getCurrentPosition(
      location => {
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
    this.setState({
      pickup: {
        latitude: pickup._latitude,
        longitude: pickup._longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      dropoff: {latitude: dropoff._latitude, longitude: dropoff._longitude},
    });
    console.log(pickup);
    console.log(dropoff);
  }

  render() {
    const {location, pickup, dropoff} = this.state;
    console.log(pickup);
    console.log(dropoff);
    const toPickup = `https://www.google.com/maps/dir/?api=1&origin=Your Location&destination=${pickup.latitude},${pickup.longitude}`;
    const toDropoff = `https://www.google.com/maps/dir/?api=1&origin=${pickup.latitude},${pickup.longitude}&destination=${dropoff.latitude},${dropoff.longitude}`;
    return (
      <View style={MapStyles.container}>
        <MapView
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
      </View>
    );
  }
}

export default MapScreen;
