import React, { Component } from 'react'
import { StyleSheet, View, ScrollView, Image, Alert, Modal, Pressable } from 'react-native'

import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker, Polyline, Overlay, PROVIDER_GOOGLE} from 'react-native-maps';

import auth from '@react-native-firebase/auth';
import firestore, { firebase } from '@react-native-firebase/firestore';

import { TextInput, Button, Text, Checkbox, Surface, Subheading, RadioButton, Portal, Provider } from 'react-native-paper'

export default class RequestFetch extends Component {
    constructor() {
        super();

        this.state = {
            effortDataInitialized: false,
            donationDetails: "",
            fullAddress: "",
            pickupCoordinates: {
                latitude: null,
                longitude: null,
            },
            pickupCity: null,
            effortId: null,
            effortCoordinates: {
                latitude: null,
                longitude: null,
            },
            effortGeocodeAddress: null,
            effortCity: null,
            marker: null,
            cost: 100,
            distance: 0,
            pathPolylines: null,
            pickupGeocodeAddress: null,
            vehicleType: "motorcycle", // motorcycle or car
            paymentMethod: "online", // online or cod
            modalVisible: false,
            title: "",
            canSubmit: false,
        }
    }
    componentDidMount() {
        let {effortId, effortCoordinates, geocodeAddress, city, title} = this.props.route.params;
        console.log('Request Fetch EFFORT ID:', JSON.stringify(effortId, null, 2))
        console.log('effortCoordinates', JSON.stringify(effortCoordinates, null, 2))
        console.log('geocodeAddress', JSON.stringify(geocodeAddress, null, 2))
        console.log('city', city)
        console.log('Title:', title)
        
        // Initialize data from previous screen
        this.setState({
            ...this.state,
            effortId: effortId,
            effortCoordinates: effortCoordinates,
            effortGeocodeAddress: geocodeAddress,
            effortCity: city,
            pickupCoordinates: effortCoordinates, // Set initial location same as the effort location
            effortDataInitialized: true,
            title: title,
        },)
    }

    onRegionChange = this.debounce((region) => {
        this.setState({
            ...this.state,
            pickupCoordinates: {...region}
        }, () => {
            this.getDistance(`${this.state.pickupCoordinates.latitude},${this.state.pickupCoordinates.longitude}`, `${this.state.effortCoordinates.latitude},${this.state.effortCoordinates.longitude}`);
            this.getAddressWithLatlng(this.state.pickupCoordinates.latitude, this.state.pickupCoordinates.longitude);
        })
    }, 500)

    debounce(fn, interval) {
        let timer = null;
        
        return function() {
            let context = this;
            let args = arguments;

            clearInterval(timer);
            timer = setTimeout(function() {
                fn.apply(context, args)
            }, interval)
        }
    }

    getAddressWithLatlng(lat, lng) {
        this.setState({
            ...this.state,
            canSubmit: false,
        });

        let uri = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDAdKi6it1aJYQ9GUVDIPQAG4s6P_UyCjw`;

        fetch(uri)
            .then(res => {
                res.json().then(json => {     
                    console.log(`${uri}\nResult: `, Object.entries(json).length);

                    for(let item of json.results) {
                        this.setState({
                            ...this.state,
                            pickupGeocodeAddress: item['formatted_address'],
                            canSubmit: true,
                        })

                        for(let comp of item['address_components']) {
                            if(comp.types.includes('locality')) {
                                this.setState({
                                    ...this.state,
                                    pickupCity: comp.long_name
                                })
                            }
                        }
                        
                        break;
                    }
                }) 
            })
    }

    setMarkerRef = (ref) => {
        console.log('REF', JSON.stringify(Object.keys(ref), null, 2));
        // console.log('REF', JSON.stringify(Object.keys(ref.state), null, 2));
        ref.showCallout()
        this.setState({
            ...this.state,
            marker: ref,
        }, () => {
            console.log('STATE REF', this.state.marker);
            
            setTimeout( () => { this.state.marker.showCallout() }, 0)
        })

        return this.state.marker;
    }

    getDistance(origin, destination) {
        this.setState({
            ...this.state,
            canSubmit: false,
        });

        let uri = encodeURI(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=AIzaSyDAdKi6it1aJYQ9GUVDIPQAG4s6P_UyCjw`);

        fetch(uri).then( (res) => {
            res.json().then( json => {
                if(!json.routes[0]) {
                    Alert.alert('Invalid Location.', 'Please retry.')
                    return;
                }
                console.log(`${uri}\nResult: `, Object.entries(json).length);

                let paths = []
                let legs = json.routes[0].legs;
                let distance = legs[0].distance.value;
                let cost = this.calculateCost(distance);

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
                    distance: distance,
                    cost: cost,
                    canSubmit: true,
                })
            } )
        })
    }

    calculateCost(distance) {
        let costPerKm = 10;
        let baseCost = 100;
        let baseKm = 1;

        let cost = baseCost + (Math.floor(Math.max( (distance / 1000) - baseKm, 0)) * costPerKm);

        console.log(`Distance: ${distance}`);
        console.log(`Cost: P${baseCost} (BASE 1km) + ADDITIONAL: ${Math.floor(Math.max( (distance / 1000) - baseKm, 0))}km * P10 = P${cost}`)

        return cost;
    }

    setModalVisibility = (visibilityBool = false) => {
        this.setState({
            ...this.state,
            modalVisible: visibilityBool
        })
    }

    storeFetchRequest = () => {        
        this.setModalVisibility(true)
        let effortCoordinates = {latitude: this.state.effortCoordinates.latitude, longitude: this.state.effortCoordinates.longitude} 
        let pickupGeopoint = {latitude: this.state.pickupCoordinates.latitude, longitude: this.state.pickupCoordinates.longitude}

        let collectionRef = firestore().collection('fetch_requests').add({
            creationDate: firestore.Timestamp.now(),
            donationDetails: this.state.donationDetails,
            distance: this.state.distance,
            donorID: auth().currentUser.uid,
            cost: this.state.cost,
            status: this.state.paymentMethod == "cod" ? "waiting" : "unpaid",
            vehicleType: this.state.vehicleType,
            paymentMethod: this.state.paymentMethod,
            pickupHouseAddress: this.state.fullAddress,
            pickup: new firestore.GeoPoint(pickupGeopoint.latitude, pickupGeopoint.longitude),
            pickupAddress: this.state.pickupGeocodeAddress,
            dropoff: new firestore.GeoPoint(effortCoordinates.latitude, effortCoordinates.longitude),
            dropoffAddress: this.state.effortGeocodeAddress,
            pickupCity: this.state.pickupCity,
            dropoffCity: this.state.effortCity,
            effortId: this.state.effortId,
            fetcherId: null,
        }).then( doc => {
            let fetchRequestID = doc.id;;
            let {paymentMethod} = this.state; 

            if(paymentMethod == "online") {
                this.props.navigation.reset({
                    index: 1,
                    routes: [
                      { name: 'DonorDrawer' },
                      {
                        name: 'PayFetchRequest',
                        params: {fetchRequestID, cost: this.state.cost},
                      },
                    ],
                  })
            } 
            else if(paymentMethod == "cod") {
                Alert.alert('Fetch request success!', 'Please wait for fetchers to take your request.', undefined, {cancelable: true});
                this.props.navigation.replace("DonorDrawer");
            }
            else {
                throw new Error("No payment method")
            }
        } ).catch((err) => {
            Alert.alert(undefined, 'There was an error processing your request', undefined, {cancelable: true});
            this.props.navigation.replace("DonorDrawer");
        }).finally(() => {
            this.setModalVisibility(false)
        })
    }

    render() {
        const {latitude: effortLatitude, longitude: effortLongitude} = this.state.effortCoordinates

        return (
            <>
            { this.state.effortDataInitialized && 
            <ScrollView style={{padding: 10}}>
                <View style={{marginBottom: 15}}>
                    <Text style={{fontWeight: "bold"}}>Donation Details</Text>
                    <TextInput
                        placeholder="Enter details of your donation (e.g. contents, quantity)" 
                        value={this.state.donationDetails}
                        multiline={true}
                        error={false}
                        onChangeText={(text) => { 
                            this.setState({
                                ...this.state,
                                donationDetails: text
                            })
                        }}
                    />
                </View>
                
                <View style={{marginBottom: 15}}>
                    <Text style={{fontWeight: "bold"}}>Vehicle Type</Text>
                    <RadioButton.Group 
                        onValueChange={
                            value => {
                                this.setState({
                                    ...this.state,
                                    vehicleType: value
                                })
                            }
                        } 
                        value={this.state.vehicleType}
                    >
                        <RadioButton.Item label="Motorcycle" value="motorcycle" />
                        <RadioButton.Item label="Car or Van" value="car" />
                    </RadioButton.Group>
                </View>       
                
                <View style={{marginBottom: 15}}>
                    <Text style={{fontWeight: "bold"}}>House Number/Address</Text>
                    <TextInput
                        placeholder="Enter your home address"
                        value={this.state.fullAddress}
                        multiline={true}
                        error={false}
                        onChangeText={(text) => { 
                            this.setState({
                                ...this.state,
                                fullAddress: text
                            })
                        }}
                    />
                </View>

                <View style={{marginBottom: 15}}>
                    <Text style={{fontWeight: "bold"}}>Pick-up Location</Text>
                    <View
                        style={styles.mapContainer}
                    >
                        <MapView
                            style={styles.map}
                            onRegionChange={this.onRegionChange}
                            initialRegion={{
                                latitude: effortLatitude,
                                longitude: effortLongitude,
                                latitudeDelta: 0.002,
                                longitudeDelta: 0.001,
                            }}
                            onMapReady={() => {}}
                        >

                            <Marker
                                key={'m1'}
                                coordinate={{latitude: effortLatitude, longitude: effortLongitude}}
                                title={`${this.state.title && this.state.title}`}
                            />

                            { this.state.pathPolylines && 
                                <Polyline
                                    coordinates={this.state.pathPolylines}
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

                        <View
                            style={styles.pointerContainer}
                        >
                            <Image
                                style={styles.pointer}
                                resizeMode='contain'
                                source={{uri: 'https://firebasestorage.googleapis.com/v0/b/realifs-prototype.appspot.com/o/assets%2Flocator-fit.png?alt=media&token=1cf279c2-81a0-44c7-9220-132271f3bf87'}}
                            />
                        </View>

                    </View>
                    <Text>Selected Address: {`${this.state.pickupGeocodeAddress || 'No address selected'}`}</Text>
                    <Text>Distance: {`${Math.floor((this.state.distance / 1000) * 10) / 10} km`}</Text>
                </View>

                <View style={{marginBottom: 15}}>
                    <Text style={{fontWeight: "bold"}}>Payment Method</Text>
                    <RadioButton.Group 
                        onValueChange={
                            value => {
                                this.setState({
                                    ...this.state,
                                    paymentMethod: value
                                })
                            }
                        } 
                        value={this.state.paymentMethod}
                    >
                        <RadioButton.Item label="Online Payment" value="online" />
                        <RadioButton.Item label="Cash on Delivery" value="cod" />
                    </RadioButton.Group>
                </View>

                <Surface
                    style={styles.bottomContainer}
                >
                    <Text style={styles.costText}>COST: {`P${this.state.cost}`}</Text>
                    
                    <Button
                        style={styles.nextButton}
                        mode="contained"
                        compact={true}
                        disabled={!this.state.canSubmit}
                        onPress={() => {
                            this.storeFetchRequest();
                        }}
                    >PROCEED</Button>
                    
                </Surface>
                
                <Modal 
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Please wait...</Text>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
            }
            </>
        )
    }
}

const styles = StyleSheet.create({
    map: {
      height: 200
    },

    mapContainer: {
        display: 'flex'
    },

    pointerContainer: {
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute'
    },

    pointer: {
        width: '40%', 
        height: '40%'
    },

    bottomContainer: {
        backgroundColor: 'default',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },

    costText: {
        fontWeight: '900',
        fontSize: 24
    },

    nextButton: {
        margin: 20,
        width: 100
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 0,
        backgroundColor: "rgba(0,0,0,0.5)"
    },

    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 5,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },

    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },

    buttonOpen: {
        backgroundColor: "#F194FF",
    },

    buttonClose: {
        backgroundColor: "#2196F3",
    },

    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
})
