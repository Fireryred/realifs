import React, {Component} from 'react';
import {Image, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';

import {Button, Text, Card} from 'react-native-paper';
class FetchRequest extends React.Component {
  constructor() {
    super();
    this.state = {
      donorData: {},
      date: '',
    };
  }
  componentDidMount() {
    this.getUserData();
    this.formatDate();
  }
  async getUserData() {
    const {data} = this.props;
    await firestore()
      .collection('users')
      .doc(data[1].donorID)
      .get()
      .then(doc => {
        this.setState({donorData: {...doc.data()}});
      });
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
  formatDate() {
    const month = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const {data} = this.props;
    const fdate = data[1].creationDate;
    const date = new firestore.Timestamp( //converting firestore timestamp to javascript date
      fdate.seconds,
      fdate.nanoseconds,
    ).toDate();
    const cdate = `${
      month[date.getMonth()]
    } ${date.getDate()},${date.getFullYear()} | ${this.formatTime(date)}`;
    this.setState({date: cdate});
  }
  render() {
    const {data, toMaps} = this.props;
    const {donorData, date} = this.state;
    return (
      <View
        style={{
          padding: 10,
          paddingBottom: 0,
        }}>
        <Card>
          <Card.Content>
            <Text style={{color: 'black', fontWeight: 'bold'}}>
              FETCH REQUEST BY: <Text style={{color: 'black'}}>
                {donorData.firstname} {donorData.lastname}
              </Text>
            </Text>
            <View>
              <Image></Image>
              <Text style={{color: 'black'}}>{date}</Text>
            </View>
            <View>
              <Text
                style={{color: "gray"}}
              >{"Details: "}{data[1].donationDetails == "" || !data[1].donationDetails ? "No description" : data[1].donationDetails}
              </Text>
            </View>
            <View
              style={{
                marginTop: 20,
                marginBottom: 20,
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={{color: 'black'}}>POINT A (PICK-UP)</Text>
                <Text style={{color: 'black'}}>{data[1].pickupCity} City</Text>
              </View>
              <View>
                <Text style={{color: 'black'}}>POINT B (DROP-OFF)</Text>
                <Text style={{color: 'black'}}>{data[1].dropoffCity} City</Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: 20,
                }}>{`\u20B1${data[1].cost} (${
                Math.floor((data[1].distance / 1000) * 10) / 10
              }KM)`}</Text>
              <Button
                title="TAKE"
                mode="contained"
                onPress={() => toMaps(data, donorData)}>
                TAKE
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  }
}

export default FetchRequest;
