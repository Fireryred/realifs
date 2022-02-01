import React, { Component } from 'react'
import { View, Modal, StyleSheet } from 'react-native'

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import { TextInput, Button, Text, Surface, Card, Title, ActivityIndicator, Colors, } from 'react-native-paper'

export class Donations extends Component {
    constructor() {
        super();

        this.state = {
            donations: {},
            modalVisible: false,
        }
    }

    componentDidMount() {
        this.props.navigation.getParent().setOptions({title: 'Donation'});

        this.getDonations();
    }

    setModalVisibility = (visibilityBool = false) => {
        this.setState({
            ...this.state,
            modalVisible: visibilityBool
        })
    }

    getDonations = async () => {
        let donations = {};
        let loadedDonations = await firestore().collection("fetch_requests").where("donorID", "==", auth().currentUser.uid).get();

        loadedDonations.forEach( doc => {
            donations[doc.id] = doc.data()
            console.log(doc.id)
        })

        this.setState({
            ...this.state,
            donations: {...donations}
        })
    }

    render() {
        let {donations, modalVisible} = this.state;

        return (
            <View>
                { !donations && <ActivityIndicator animating={true} color={Colors.red800} /> }
                {
                    Object.entries(donations).map( (item, key) => {
                        return (
                            <DonationItem
                                key={key}
                                donationData={item}
                                parentProps={this.props}
                                parentContext={this}
                            ></DonationItem>
                        )
                    } )
                }
                <Modal 
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Please wait...</Text>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

class DonationItem extends Component {
    render() {
        let donationId = this.props.donationData[0];
        let donationData = this.props.donationData[1];
        return (
            <Surface>
                <Card>
                    <Card.Title title={donationData.donationDetails || 'No description'}></Card.Title>
                    <Card.Content>
                        <Text>Sent to: {'DONATION_EFFORT'}</Text>
                        <Text>Status: { donationData.status.charAt(0).toUpperCase() + donationData.status.slice(1)}</Text>
                        <Surface
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                alignItems: "center"
                            }}
                        >
                            {/* <Button
                                color="orange"
                                dark={true}
                                compact={true}
                                mode="contained"
                            >TRACK</Button> */}
                            <Button
                                color="red"
                                compact={true}
                                mode="contained"
                                disabled={donationData.status == "waiting" || donationData.status == "pickup" ? false : true}
                                onPress={() => {
                                    this.props.parentContext.setModalVisibility(true);

                                    firestore().collection("fetch_requests").doc(donationId).update({
                                        status: "cancelled"
                                    }).then(() => {
                                        console.log("Successfully cancelled request")
                                    }).catch((err) => {
                                        console.log("cancel error", err)
                                    }).finally(() => {
                                        this.props.parentContext.setModalVisibility(false);
                                        this.props.parentContext.getDonations();
                                    })
                                }}
                            >CANCEL</Button>
                        </Surface>
                        
                    </Card.Content>
                </Card>
            </Surface>
        )
    }
}

const styles = StyleSheet.create({
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

    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
})

export default Donations
