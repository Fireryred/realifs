import React, { Component } from 'react'
import { ScrollView, StyleSheet, View, Image } from 'react-native'

import MapView, { Marker, Polyline, Overlay, PROVIDER_GOOGLE, Callout} from 'react-native-maps';

import firestore from '@react-native-firebase/firestore';


import { TextInput, Button, Text, Surface, Card, Title, ActivityIndicator, Colors, Switch } from 'react-native-paper'
import { TouchableOpacity } from 'react-native-gesture-handler';
export class Efforts extends Component {
    constructor() {
        super();

        this.state = {
            isListView: false,
            efforts: {},
            searchString: "",
        }

        this.markersRef = []
        this.mapviewRef = React.createRef()
    }

    componentDidMount() {
        this.getEfforts()
          .catch(error => {
              console.log(error)
          })
    }

    // NOT IN USE
    autoAdjustMapZoom = () => {
        let {mapviewRef} = this.state;

        setTimeout(() => {this.state.mapviewRef.fitToSuppliedMarkers(["0"]) }, 0)
    }

    toggleViewSwitch = () => {
        this.setState({
            ...this.state,
            isListView: !this.state.isListView
        })
    }

    async getEfforts() {
        let efforts = {}

        console.log('Getting donation efforts: ');
        let loadedEfforts = await firestore().collection('donation_efforts').where("isDeleted", "==", false).get();

        loadedEfforts.forEach( doc => {
            efforts[doc.id] = doc.data()
            // console.log(doc.id)
        })

        this.setState({
            ...this.state,
            efforts: {...efforts}
        })
    }

    render() {
        let { isListView, efforts, searchString } = this.state;

        return (
            <View>
                <Surface 
                    style={styles.switchContainer}
                >
                    <Text>Map View</Text>
                    <Switch 
                        value={isListView}
                        onValueChange={this.toggleViewSwitch}
                    ></Switch>
                    <Text>List View</Text>
                </Surface>
                { !this.state.efforts && <ActivityIndicator animating={true} color={Colors.red800} /> }
                { isListView &&
                    <ScrollView 
                        style={styles.listViewContainer}
                    >
                        <Surface
                            style={styles.searchBarContainer}
                        >
                            <TextInput
                            mode="outlined"
                            dense={true}
                            style={styles.searchBar}
                            placeholder='Search'
                            value={searchString}
                            onChangeText={(text) => { 
                                this.setState({
                                    ...this.state,
                                    searchString: text
                                })
                            }}
                        />
                        </Surface>
                        
                        {
                        Object.entries(efforts).filter((item) => { 
                            console.log(item[1].title)
                            return item[1]?.title.toLowerCase().includes(searchString.trim().toLowerCase())
                        }).map( (item, key) => {
                            return (
                                <EffortItem
                                    key={key}
                                    effortData={item}
                                    parentProps={this.props}
                                ></EffortItem>
                            )
                        } ) }
                    </ScrollView>
                }
                { !isListView &&
                    <View
                        style={styles.mapContainer}
                    >
                        <MapView
                            style={styles.map}
                            onRegionChange={()=>{}}
                            onRegionChangeComplete={() => {
                                // // console.log(this['marker0']?.current)
                                // this['marker0']?.current?.showCallout();
                                // this['marker1']?.current?.showCallout();
                                Object.entries(this.markersRef).forEach( (marker, index) => {
                                    console.log(index)
                                    if(marker.current){
                                        setTimeout(() => {marker.current.showCallout()}, 0);
                                    }
                                })
                            }}
                            initialRegion={{
                                latitude: 14.55979830686066,
                                longitude: 121.00805163217159,
                                latitudeDelta: 0.3,
                                longitudeDelta: 0.3,
                            }}
                            ref={this.mapRef}
                        >
                            { Object.entries(efforts).map( (item, key) => {
                                let effortId = item[0];
                                let title = item[1].title;
                                let description = item[1].description;
                                let latitude = item[1].location.latitude;
                                let longitude = item[1].location.longitude;

                                let markerName = `marker${key}`;
                                this[markerName] = React.createRef()

                                return (
                                    <Marker
                                        key={key}
                                        coordinate={{latitude: latitude, longitude: longitude}}
                                        title={title}
                                        description={description}
                                        ref={this[markerName]}
                                        onPress={() => {
                                            // this[markerName].current.hideCallout();
                                            this.props.navigation.navigate("EffortDetails", {effortId: effortId})
                                        }}
                                        // image={'https://firebasestorage.googleapis.com/v0/b/realifs-prototype.appspot.com/o/assets%2Flocator.png?alt=media&token=9f0f36d7-c692-46f1-8d22-e8a63a93e414'}
                                    >
                                        <View
                                            style={styles.markerContainer}
                                        >
                                        <Surface 
                                            style={styles.markerTextContainer}
                                        >
                                            <Text style={styles.markerText}>{title}</Text>
                                        </Surface>
                                        <Image
                                            style={styles.pointer}
                                            resizeMode='contain'
                                            source={{uri: 'https://firebasestorage.googleapis.com/v0/b/realifs-prototype.appspot.com/o/assets%2Flocator.png?alt=media&token=9f0f36d7-c692-46f1-8d22-e8a63a93e414'}}
                                        />
                                        </View>
                                        <Callout tooltip={true}>
                                            <Text> </Text>
                                        </Callout>
                                    </Marker>
                                )
                            }) }

                        </MapView>
                    </View>
                }
            </View>

        )
    }
}

class EffortItem extends Component {
    componentDidMount() {

    }

    render() {
        let effortId = this.props.effortData[0];
        let effortData = this.props.effortData[1];
        return (
            <Surface>
                <Card>
                    <Card.Title title={effortData.title || 'cannot get'}></Card.Title>
                    <Card.Content>
                        <Text>{effortData.description}</Text>
                        <Button
                            mode={'contained'}
                            onPress={() => {
                                this.props.parentProps.navigation.navigate("EffortDetails", {effortId: effortId})
                            }}

                        >VIEW</Button>
                    </Card.Content>
                </Card>
            </Surface>
        )
    }
}

class RequestFetch extends Component {

}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },

    mapContainer: {
        display: 'flex',
        height: '100%'
    },

    switchContainer: {
        width: '100%',
        margin: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 999999,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0)'
    },

    pointer: {
        width: 40, 
        height: 40
    },

    markerContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },

    markerTextContainer: {
        padding: 5,
        borderRadius: 5,
        backgroundColor: 'rgba(140, 140, 140, 1)',
        maxWidth: 200,
        
    },

    listViewContainer: {
    },

    markerText: {
        color: 'white',
    },

    searchBarContainer: {
        display: 'flex',
        marginTop: 35,
        paddingLeft: 20,
        paddingRight: 20,
    },

    searchBar: {
        // height: 10
    }

})

export default Efforts
