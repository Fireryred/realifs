import React, { Component } from 'react'
import { StyleSheet, View, StatusBar, SafeAreaView, ScrollView, Image, Dimensions, Alert } from 'react-native'

import firestore from '@react-native-firebase/firestore';

import { TextInput, Button, Text, Checkbox, Surface, Subheading, RadioButton, Portal, Provider, Title, Headline, FAB, DefaultTheme} from 'react-native-paper'

import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class EffortDetails extends Component {
    constructor() {
        super();

        this.state = {
            effortId: null,
            title: null,
            description: null,
            csoID: null,
            creationDate: null,
            startDateTime: null,
            endDateTime: null,
            effortCoordinates: null,
            geocodeAddress: null,
            city: null,
            imageUrl: null,
            csoData: {
                email: null,
                organizationName: null,
                username: null,
            },
            effortDataFetched: false,
            csoDataFetched: false,
            dimensions: {
                window: Dimensions.get("window"),
                screen: Dimensions.get("screen"),
            },
        }
    }
    componentDidMount() {
        console.log('Got prop:', JSON.stringify(this.props.route.params.effortId, null, 2))
        this.setState({
            ...this.state,
            effortId: this.props.route.params.effortId
        }, () => {
            this.loadEffortData()
                .catch((err) => {
                    console.log("error loading effort", err);
                    this.props.navigation.replace("DonorDrawer")
                })
        })

        Dimensions.addEventListener("change", (({window, screen}) => {
            this.setState({
                ...this.state,
                dimensions: {
                    window,
                    screen,
                }
            })
        }))
    }

    loadEffortData = async () => {
        let doc = await firestore().collection("donation_efforts").doc(this.props.route.params.effortId).get();
        let effort = doc.data();

        console.log("effort", effort);

        this.setState({
            ...this.state,
            title: effort.title,
            description: effort.description,
            csoID: effort.csoID,
            creationDate: effort.creationDate,
            startDateTime: effort.startDateTime,
            endDateTime: effort.endDateTime,
            effortCoordinates: effort.location,
            geocodeAddress: effort.geocodeAddress,
            city: effort.city,
            imageUrl: effort.imageUrl,
            effortDataFetched: true,
        }, () => {
            console.log("effort state", this.state);
            this.loadCSOData()
                .catch((err) => {
                    console.log("error getting cso data", err)
                    this.props.navigation.replace("DonorDrawer")
                })
        })
    }

    loadCSOData = async () => {
        let {csoID} = this.state;
        let doc = await firestore().collection("users").doc(csoID).get();
        let csoData = doc.data();

        this.setState({
            ...this.state,
            csoData: {...csoData},
            csoDataFetched: true,
        }, () => console.log(csoData))
    }

    checkAvailability() {
        let { startDateTime, endDateTime } = this.state;
        let result = true;

        let start = new firestore.Timestamp(
            startDateTime.seconds,
            startDateTime.nanoseconds,
          ).toDate()
        let end = new firestore.Timestamp(
            endDateTime.seconds,
            endDateTime.nanoseconds,
          ).toDate()
        
        let startHour = start.getHours();
        let startMins = end.getMinutes();
        
        let endHour = new firestore.Timestamp(
            endDateTime.seconds,
            endDateTime.nanoseconds,
          ).toDate().getHours();
        let endMins = new firestore.Timestamp(
            endDateTime.seconds,
            endDateTime.nanoseconds,
          ).toDate().getMinutes();

        let nowHour = new Date().getHours();
        let nowMins = new Date().getMinutes();

        let startInMins = ((startHour + 1) * 60 + startMins) - 60;
        let endInMins = ((endHour + 1) * 60 + endMins) - 60;
        let nowInMins = ((nowHour + 1) * 60 + nowMins) - 60;

        if(startInMins < endInMins) {
            console.log("startInMins", startInMins);
            console.log("1440", (24*60));
            console.log("nowInMins", nowInMins);
            console.log("0", "0");
            console.log("endInMins", endInMins);
            // For times that is within the 24-hour clock
            if(nowInMins >= startInMins && nowInMins <= endInMins) {
                console.log("Available")
            } else {
                let formattedStart = (((start.getHours() + 11) % 12 + 1) + `:${(start.getMinutes() < 10 ? '0':'') + start.getMinutes()} ` + (start.getHours() <= 11 ? "AM" : "PM"));
                let formattedEnd = (((end.getHours() + 11) % 12 + 1) + `:${(start.getMinutes() < 10 ? '0':'') + start.getMinutes()} ` + (end.getHours() <= 11 ? "AM" : "PM"));
                Alert.alert(undefined, `CSO Administrator is not available to recieve at this time. \n\nAvailability: ${formattedStart} - ${formattedEnd}`);
                result = false;
            }
        } else {
            console.log("startInMins", startInMins);
            console.log("1440", (24*60));
            console.log("nowInMins", nowInMins);
            console.log("0", "0");
            console.log("endInMins", endInMins);
            // For times that goes over the 24-hour clock
            if(((nowInMins >= startInMins) && (nowInMins <= 24 * 60)) || ((nowInMins >= 0) && (nowInMins <= endInMins))) {
                console.log("Available")
            } else {
                let formattedStart = (((start.getHours() + 11) % 12 + 1) + `:${(start.getMinutes() < 10 ? '0':'') + start.getMinutes()} ` + (start.getHours() <= 11 ? "AM" : "PM"));
                let formattedEnd = (((end.getHours() + 11) % 12 + 1) + `:${(start.getMinutes() < 10 ? '0':'') + start.getMinutes()} ` + (end.getHours() <= 11 ? "AM" : "PM"));
                Alert.alert(undefined, `CSO Administrator is not available to recieve at this time. \n\nAvailability: ${formattedStart} - ${formattedEnd}`);
                result = false;
            }
        }

        return result;
    }

    render() {
        let { effortId, effortCoordinates, geocodeAddress, city, csoID, effortDataFetched, csoDataFetched } = this.state;
        let { title, description, creationDate, startDateTime, endDateTime, imageUrl } = this.state;
        let {organizationName} = this.state.csoData;

        return ( effortDataFetched && csoDataFetched &&
            <>
            <ScrollView style={styles.container}>
                <View style={styles.segment}>
                    <Text style={{ color: '#fff' }}>Effort Details</Text>
                    <Headline style={{fontSize: 30}}>{title}</Headline>
                    <Text>{"By "}
                        <Text style={{textDecorationLine: "underline", color: "blue"}} onPress={() => { this.props.navigation.navigate("CSOInfo", { csoID }) }}>{organizationName + " "}</Text>
                        <MaterialCommunityIcons color="blue" name="check-decagram"></MaterialCommunityIcons>
                    </Text>
                </View>
                <View style={styles.segment}>
                    <Text style={{color: "#666666", fontWeight: "bold"}}>DESCRIPTION</Text>
                    <Text>{description}</Text>
                </View>
                
                <View style={{...styles.segment, }}>
                    <Text style={{color: "#666666", fontWeight: "bold"}}>MEDIA</Text>
                    {imageUrl.map && imageUrl.map((value, index) => {
                        return (<Image key={index} resizeMode="cover" style={{ marginBottom: 15, height: this.state.dimensions?.window?.width / 2, width: null, backgroundColor: "rgba(0,0,0,.1)" }} source={{uri: value}} />)
                    })}
                    
                </View>

                <View style={{...styles.segment, display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 100}}>
                    <Text style={{color: "#666666", fontWeight: "bold"}}>FOR ONLINE CASH DONATIONS</Text>
                    <Text style={{textDecorationLine: "underline", color: "blue"}} onPress={() => { this.props.navigation.navigate("CSOInfo", { csoID }) }}>View CSO Information Page</Text>
                </View>

                {/* <View style={{...styles.segment, display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Text style={{color: "#666666", fontWeight: "bold", textAlign: "center"}}>FOR IN-KIND DONATIONS</Text>
                    <Button
                        mode="contained"
                        onPress={() => {
                            if(!this.checkAvailability()) {
                                return;
                            }
                            this.props.navigation.navigate("RequestFetch", { effortId, effortCoordinates, geocodeAddress, city, title })
                        }}
                    >DONATE ITEMS ❤</Button>
                </View>
                 */}
                
            </ScrollView>
            <FAB
                    small
                    label="DONATE ❤"
                    style={{
                        color: "white",
                        position: 'absolute',
                        margin: 16,
                        right: 0,
                        bottom: 0,
                        backgroundColor: DefaultTheme.colors.primary,
                    }}
                    onPress={() => {
                        if(!this.checkAvailability()) {
                            return;
                        }
                        this.props.navigation.navigate("RequestFetch", { effortId, effortCoordinates, geocodeAddress, city, title })
                    }}
                />
            </>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    segment: {
        marginBottom: 20,
        display: "flex"
    }
})
