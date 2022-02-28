import React, {Component} from 'react';
import {View, Image, ScrollView} from 'react-native';
import {Button, Card, Text} from 'react-native-paper';

import firestore from '@react-native-firebase/firestore';

class CSOIncomingDonation extends Component {
  constructor() {
    super();
    this.state = {donorName: ''};
  }
  componentDidMount() {
    this.getDonorData();
  }
  formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
  formatDate(fdate) {
    const {status} = this.props.data[1].requestData;
    const month = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const date = new firestore.Timestamp(
      fdate.seconds,
      fdate.nanoseconds,
    ).toDate();
    return `${month[
      date.getMonth()
    ].toUpperCase()} ${date.getDate()}, ${date.getFullYear()} ${
      status !== 'delivered' ? `| ${this.formatTime(date)}` : ''
    }`;
  }
  async getDonorData() {
    const {requestData} = this.props.data[1];
    await firestore()
      .collection('users')
      .doc(requestData.donorID)
      .get()
      .then(doc =>
        this.setState({
          donorName: doc.data().firstname + ' ' + doc.data().lastname,
        }),
      );
  }
  async updateStatus() {
    const {data} = this.props;
    const {requestData} = data[1];
    let cost = requestData.cost * 100;
    let balance = 0;
    await firestore()
      .collection('users')
      .doc(requestData.fetcherId)
      .get()
      .then(async doc => {
        balance = doc.data().balance;
        if (requestData.paymentMethod === 'online') {
          cost = cost * 0.8;
          balance = balance + cost;
        } else if (requestData.paymentMethod === 'cod') {
          cost = cost * 0.2;
          balance = balance - cost;
        }
        await firestore().collection('users').doc(doc.id).update({balance});
      });
    await firestore()
      .collection('fetch_requests')
      .doc(data[0])
      .update({status: 'delivered'});
    await firestore()
      .collection('transaction')
      .add({
        action: `${requestData.paymentMethod}CsoRecieved`,
        amount: cost,
        date: firestore.Timestamp.now(),
        fetcherId: requestData.fetcherId,
        status: 'success',
      });
    console.log("reloading")
    this.props.getDonationEffortId();
  }
  render() {
    const {toTrack, data} = this.props;
    const {requestData, effortName} = data[1];
    const {donorName} = this.state;
    return (
      <View>
        <Card style={{margin: 3}}>
          {requestData.status !== 'delivered' ? (
            <Card.Content>
              <View style={{display: "flex", flexDirection: "row", marginBottom: 10}}>
                <View style={{flex: 1}}>
                  <Text style={{fontWeight: "bold", color: "gray"}}>Donation By</Text>
                  <View style={{paddingLeft: 15}}>
                    <Image></Image>
                    <Text style={{fontWeight: "bold", fontSize: 16}}>{donorName}</Text>
                    <Text style={{fontWeight: "bold", fontSize: 12}}>FROM {requestData.pickupCity.toUpperCase()}</Text>
                    <Text style={{color: "gray", fontSize: 12}}>{this.formatDate(requestData.creationDate)}</Text>
                  </View>
                </View>

                <View style={{flex: 1}}>
                  <Text style={{textAlign: "right"}}>STATUS: {requestData.status.toUpperCase()}</Text>
                </View>
              </View>
              
              <View style={{marginBottom: 10}} >
                <Text style={{fontWeight: "bold", color: "gray"}}>Details</Text>
                <View style={{paddingLeft: 10}}>
                  <Text style={{fontWeight: "bold"}}>{effortName}</Text>
                  <Text>{requestData.donationDetails}</Text>
                </View>
                
              </View>

              <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
                <Button mode="contained" color="orange" dark={true} onPress={() => toTrack(data[0])} style={{marginRight: 10}}>TRACK</Button>
                <Button
                  mode="contained"
                  color="green"
                  disabled={requestData.status === 'pickup' ? true : false}
                  onPress={() => this.updateStatus()}>
                  RECIEVED
                </Button>
              </View>
            </Card.Content>
          ) : (
            <Card.Content>
              <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10}}>
                <View style={{ flex: 5}}>
                  <Text>{donorName} | {requestData.pickupCity} City</Text>
                </View>
                <View style={{ flex: 5}}>
                  <Text style={{ color: "gray", textAlign: "right"}}>{this.formatDate(requestData.creationDate)}</Text>
                </View>
              </View>

              <Text style={{fontWeight: "bold"}}>{effortName}</Text>
              <Text style={{ flex: 7, color: "gray"}}>{requestData.donationDetails}</Text>
            </Card.Content>
          )}
        </Card>
      </View>
    );
  }
}

export default CSOIncomingDonation;
