import React, { Component } from 'react'
import { StyleSheet, View, ScrollView, Image, Alert, Modal, Pressable } from 'react-native'

import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker, Polyline, Overlay, PROVIDER_GOOGLE, Callout } from 'react-native-maps';

import auth from '@react-native-firebase/auth';
import firestore, { firebase } from '@react-native-firebase/firestore';

import { TextInput, Button, Text, Checkbox, Surface, Subheading, RadioButton, Portal, Provider } from 'react-native-paper'

import { fetcherIndicator } from '../../assets';

export default class TrackFetcher extends Component {
    constructor() {
        super();

        this.state = {
            effortId: null,
            dropoff: null,
            pickup: null,
            riderLocation: null,
            dataFetched: false,
            pathPolylines: null,
        }
    }
    componentDidMount() {
        this.loadEffortData()
            .catch((err) => {
                console.log("error getting effort data", err);
                this.props.navigation.goBack();
            })
    }

    loadEffortData = async () => {
        let effortId = this.props.route.params.effortId;
        let doc = await firestore().collection("fetch_requests").doc(effortId).get();
        let effort = doc.data();

        console.log(effort)
        if(!effort.riderLocation.keys) {
            Alert.alert(undefined, "Could not get fetcher location. Please try again later.")
            throw new Error("error getting riderLocation data");
        }
        this.setState({
            ...this.state,
            pickup: effort.pickup,
            dropoff: effort.dropoff,
            riderLocation: effort.riderLocation,
            dataFetched: true,
        }, () => {
            this.getDistance(`${this.state.pickup.latitude},${this.state.pickup.longitude}`, `${this.state.dropoff.latitude},${this.state.dropoff.longitude}`)
        })
    }

    getDistance(origin, destination) {
        let uri = encodeURI(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=AIzaSyDAdKi6it1aJYQ9GUVDIPQAG4s6P_UyCjw`);

        fetch(uri).then( (res) => {
            res.json().then( json => {
                if(!json.routes[0]) {
                    throw new Error("directions fetch failed")
                }
                console.log(`${uri}\nResult: `, Object.entries(json).length);

                let paths = []
                let legs = json.routes[0].legs;

                for (let i=0;i<legs.length;i++) {
                    var steps = legs[i].steps;

                    for (let j=0;j<steps.length;j++) {
                        paths.push({
                            latitude: steps[j]['start_location']['lat'],
                            longitude: steps[j]['start_location']['lng'],
                        })
                        paths.push({
                            latitude: steps[j]['end_location']['lat'],
                            longitude: steps[j]['end_location']['lng'],
                        })
                    }
                }

                this.setState({
                    ...this.state,
                    pathPolylines: paths,
                })
            } )
        })
    }

    render() {
        let { dataFetched, riderLocation, pickup, dropoff, pathPolylines } = this.state;

        return (
            <View>
                {!dataFetched && !pathPolylines && (<Text>Loading...</Text>) }
                {dataFetched && pathPolylines &&
                    <MapView
                        style={{display: 'flex', height: '100%'}}
                        initialRegion={{
                            latitude: riderLocation.latitude,
                            longitude: riderLocation.longitude,
                            latitudeDelta: 0.2,
                            longitudeDelta: 0.1,
                        }}
                        onMapReady={() => { }}
                    >
                        <Marker
                            coordinate={{ latitude: riderLocation.latitude, longitude: riderLocation.longitude }}
                        >
                            <View
                            >
                                <Image
                                    resizeMode='contain'
                                    source={fetcherIndicator}
                                    style={{height: 45, width: 45}}
                                />
                            </View>
                            <Callout tooltip={true}>
                                <Text> </Text>
                            </Callout>
                        </Marker>
                        <Marker
                            coordinate={{ latitude: pickup.latitude, longitude: pickup.longitude }}
                        >
                        </Marker>
                        <Marker
                            coordinate={{ latitude: dropoff.latitude, longitude: dropoff.longitude }}
                        >
                        </Marker>

                        { pathPolylines && 
                            <Polyline
                                coordinates={pathPolylines}
                                strokeColor="#7b17ff" // fallback for when `strokeColors` is not supported by the map-provider
                                strokeColors={[
                                    '#7F0000',
                                    '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
                                    '#B24112',
                                    '#E5845C',
                                    '#238C23',
                                    '#7F0000'
                                ]}
                                strokeWidth={6}
                            />
                        }

                    </MapView>
                }
                </View>
                );
    }
}

const styles = StyleSheet.create({ });
