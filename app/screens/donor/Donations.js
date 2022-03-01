import React, { Component } from 'react'
import { View, Modal, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native'

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import { TextInput, Button, Text, Surface, Card, Title, ActivityIndicator, Colors, } from 'react-native-paper'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { DefaultTheme as PaperDefaultTheme, Provider as PaperProvider } from 'react-native-paper';


export class Donations extends Component {
    constructor() {
        super();

        this.state = {
            donations: null,
            modalVisible: false,
            refreshing: false,
        }
    }

    componentDidMount() {
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

    setRefreshing = (isRefreshing) => {
        this.setState({
            ...this.setState,
            refreshing: isRefreshing,
        })
    }

    render() {
        let {donations, modalVisible} = this.state;

        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={() => {console.log(this.state.refreshing); this.getDonations(); this.setRefreshing(false)}}
                    />}
            >
                { !donations && <ActivityIndicator animating={true} color={Colors.red800} /> }
                { donations &&
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
                            <Text style={styles.modalText}>Please wait..</Text>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        )
    }
}

class DonationItem extends Component {
    constructor() {
        super();
        this.state = {
            donationId: null,
            donationData: null,
            effortData: null,
        }
    }
    componentDidMount() {
        this.setState({
            ...this.state,
            donationId: this.props.donationData[0],
            donationData: this.props.donationData[1],
        }, () => {
            console.log("effortid", this.state.donationData?.effortId);
            firestore().collection("donation_efforts").doc(this.state.donationData?.effortId).get().then(doc => {
                let effortData = doc.data();
                if(effortData) {
                    console.log("nice", effortData);
                    this.setState({
                        ...this.state,
                        effortData: effortData,
                    })
                }
                
            })
        })

        
    }
    formatPaymentMethod(paymentMethod) {
        let result = paymentMethod;

        result = paymentMethod == "online" ? "Online Payment" : "COD";

        return result;
    }
    render() {
        let donationId = this.props.donationData[0];
        let donationData = this.props.donationData[1];
        return (
            <Surface>
                <Card>
                    <Card.Title title={donationData.donationDetails || 'No description'}></Card.Title>
                    <Card.Content>
                        <Text>Sent to: {this.state.effortData?.title}</Text>
                        <Text>Status: { donationData.status.charAt(0).toUpperCase() + donationData.status.slice(1)}</Text>
                        <Text style={{color: "gray"}}>{`Fee: ₱${donationData.cost} (${this.formatPaymentMethod(donationData.paymentMethod)})`}</Text>
                        <Surface
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                alignItems: "center",
                            }}
                        >
                            <Button
                                style={{marginRight: 10}}
                                color="orange"
                                dark={true}
                                compact={true}
                                mode="contained"
                                disabled={donationData.status == "waiting" || donationData.status == "delivered" || donationData.status == "cancelled" ? true : false}
                                onPress={() => {
                                    this.props.parentProps.navigation.navigate("TrackFetcher", {effortId: donationId})
                                }}
                            >TRACK</Button>
                            <Button
                                style={{marginRight: 10}}
                                color="red"
                                compact={true}
                                mode="contained"
                                disabled={donationData.status == "waiting" || donationData.status == "pickup" ? false : true}
                                onPress={() => {
                                    this.props.parentContext.setModalVisibility(true);

                                    if(donationData?.paymentMethod == "online") {
                                        firestore().collection("refund_requests").add({
                                            amount: parseInt(donationData.cost) * 100,
                                            fetchRequestID: donationId,
                                            donorID: donationData.donorID,
                                            date: firestore.Timestamp.now(),
                                            status: "pending",
                                        }).then(() => {
                                            firestore().collection("fetch_requests").doc(donationId).update({
                                                status: "cancelled"
                                            }).then(() => {
                                                console.log("Successfully cancelled request")
                                            }).catch((err) => {
                                                console.log("cancel error update status", err)
                                            })
                                        }).catch((err) => {
                                            console.log("cancel error refund request", err)
                                        }).finally(() => {
                                            this.props.parentContext.setModalVisibility(false);
                                            this.props.parentContext.getDonations();
                                        })
                                        
                                    }
                                    else if(donationData?.paymentMethod == "cod") {
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
                                    }
                                    else {
                                        Alert.alert("There is an error processing your request. Please try again");
                                    }
                                }}
                            >CANCEL</Button>
                            
                            <TouchableOpacity 
                                style={{
                                    opacity: (donationData.status == "waiting" || donationData.status == "delivered" || donationData.status == "cancelled" ? .3 : 1),
                                    marginRight: 10,
                                    height: 40, 
                                    width: 40, 
                                    padding: 0, 
                                    borderRadius: 40,
                                    backgroundColor: PaperDefaultTheme.colors.primary,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                                disabled={donationData.status == "waiting" || donationData.status == "delivered" || donationData.status == "cancelled" ? true : false}
                                onPress={() => {
                                    this.props.parentProps.navigation.navigate("Chat", {fetchRequestId: donationId, fetcherId: donationData.fetcherId})
                                }}
                            >
                                <MaterialIcons name="chat" size={25} color="gold"/>
                            </TouchableOpacity>

                            
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
