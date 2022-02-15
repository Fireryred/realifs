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
    await firestore()
      .collection('fetch_requests')
      .doc(data[1])
      .update({status: 'delivered'});
  }
  render() {
    const {toTrack, data} = this.props;
    const {requestData, effortName} = data[1];
    const {donorName} = this.state;
    return (
      <ScrollView>
        <Card>
          {requestData.status !== 'delivered' ? (
            <Card.Content>
              <Text>DONATION BY</Text>
              <View>
                <Image></Image>
                <Text>{donorName}</Text>
                <Text>FROM {requestData.pickupCity.toUpperCase()}</Text>
                <Text>{this.formatDate(requestData.creationDate)}</Text>
              </View>
              <Text>STATUS: IN {requestData.status.toUpperCase()}</Text>
              <View>
                <Text>Details</Text>
                <Text>Effort: {effortName}</Text>
                <Text>{requestData.donationDetails}</Text>
              </View>

              <View>
                <Button onPress={() => toTrack(data[0])}>TRACK</Button>
                <Button
                  disabled={requestData.status === 'pickup' ? true : false}
                  onPress={() => this.updateStatus()}>
                  I RECIEVED
                </Button>
              </View>
            </Card.Content>
          ) : (
            <Card.Content>
              <Text>
                {donorName} | {requestData.pickupCity}
              </Text>
              <Text>{effortName}</Text>
              <View>
                <Text>{requestData.donationDetails}</Text>
                <Text>{this.formatDate(requestData.creationDate)}</Text>
              </View>
            </Card.Content>
          )}
        </Card>
      </ScrollView>
    );
  }
}

export default CSOIncomingDonation;
