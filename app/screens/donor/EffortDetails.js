import React, { Component } from 'react'
import { StyleSheet, View, StatusBar, SafeAreaView } from 'react-native'

import { Text, Button} from 'react-native-paper'

import firestore from '@react-native-firebase/firestore';

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
            city: null
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
            city: effort.city
        }, () => {
            console.log("effort state", this.state);
        })
    }

    render() {
        let {effortId, effortCoordinates, geocodeAddress, city} = this.state

        return (
            <View>
                <Text style={{ color: '#fff' }}>Effort Details</Text>
                {Object.entries(this.state).map((value, index) => { return <><Text>{value.toString()}</Text></> })}
                <Button
                    onPress={() => {
                        this.props.navigation.navigate("RequestFetch", {effortId, effortCoordinates, geocodeAddress, city})
                    }}
                >Request Fetch</Button>
            </View>

        )
    }
}

const styles = StyleSheet.create({

})
