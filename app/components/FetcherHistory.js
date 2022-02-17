import React, {Component} from 'react';
import {View} from 'react-native';
import {Card, Text} from 'react-native-paper';

import firestore from '@react-native-firebase/firestore';
class FetcherHistory extends Component {
  constructor() {
    super();
  }
  componentDidMount() {
    console.log(this.props);
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
    ].toUpperCase()} ${date.getDate()}, ${date.getFullYear()} | ${this.formatTime(
      date,
    )}`;
  }
  render() {
    const {data} = this.props;
    return (
      <View style={{margin: 5}}>
        <Card>
          <Card.Content>
            <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
              <Text style={{flex: 7, fontWeight: "bold", fontSize: 18}}>{data[1].donationDetails}</Text>
              <Text style={{flex: 3, textAlign: "right", fontSize: 18}}>₱{data[1].cost}</Text>
            </View>
            
            <Text style={{marginBottom: 10}}><Text style={{color: "gray"}}>Status: </Text> { data[1].status.charAt(0).toUpperCase() + data[1].status.slice(1)}</Text>

            <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
              <Text style={{flex: 1}}><Text style={{color: "gray"}}>From: </Text>{data[1].pickupAddress}</Text>
              <Text style={{flex: 1}}><Text style={{color: "gray"}}>To: </Text>{data[1].dropoffAddress}</Text>
            </View>
            
            
            <Text style={{color: "gray"}}>{this.formatDate(data[1].creationDate)}</Text>
          </Card.Content>
        </Card>
      </View>
    );
  }
}

export default FetcherHistory;
