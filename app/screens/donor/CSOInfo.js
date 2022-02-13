import React, { Component } from 'react'
import { StyleSheet, View, StatusBar, SafeAreaView, ScrollView, Image, Dimensions } from 'react-native'

import firestore from '@react-native-firebase/firestore';

import { TextInput, Button, Text, Checkbox, Surface, Subheading, RadioButton, Portal, Provider, Title, Headline} from 'react-native-paper';

import { organizationImg } from '../../assets';
import { floor } from 'react-native-reanimated';

export default class CSOInfo extends Component {
    constructor() {
        super();

        this.state = {
            csoID: null,
            organizationName: null,
            about: null,
            account_type: null,
            bankNumbers: null,
            dataFetched: false,
            dimensions: {
                window: null,
                screen: null,
            }
        }
    }
    componentDidMount() {
        console.log('Got prop:', JSON.stringify(this.props.route.params.csoID, null, 2))
        this.setState({
            ...this.state,
            csoID: this.props.route.params.csoID,
        }, () => {
            this.loadCSOData()
                .catch((err) => {
                    console.log("error loading CSO data", err);
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

    loadCSOData = async () => {
        let doc = await firestore().collection("users").doc(this.props.route.params.csoID).get();
        let csoData = doc.data();

        console.log("cso data", csoData);

        this.setState({
            ...this.state,
            organizationName: csoData.organizationName,
            about: csoData.about,
            account_type: csoData.account_type,
            bankNumbers: csoData.bankNumbers,
        }, () => {
            console.log("csoData state", this.state);
        })
    }

    render() {
        return (
            <ScrollView>
                <Image  style={{height: 100, width: this.state?.dimensions?.screen?.width}} source={organizationImg} />
                <View style={styles.container} >
                    <View style={styles.segment}>
                        <Text style={{fontSize: 40, fontWeight: 'bold'}}>{this.state.organizationName}</Text>
                    </View>

                    <View style={styles.segment}>
                        <Text style={{color: "#666666", fontWeight: "bold"}}>ABOUT THE ORGANIZATION</Text>
                        <Text>{this.state.about}</Text>
                    </View>

                    <View style={styles.segment}>
                        <Text style={{color: "#666666", fontWeight: "bold"}}>BANK/E-WALLET NUMBERS</Text>
                        <Text>{(this.state.bankNumbers + "").replace(`\\n`, `\n`)}</Text>
                    </View>
                </View>
                
            </ScrollView>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    segment: {
        marginBottom: 20,
        display: "flex"
    }
})
