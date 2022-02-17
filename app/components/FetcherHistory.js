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
      <View>
        <Card>
          <Card.Content>
            <Text>{data[1].donationDetails}</Text>
            <Text>{data[1].pickupAddress}</Text>
            <Text>{data[1].dropoffAddress}</Text>
            <Text>{data[1].cost}</Text>
            <Text>{this.formatDate(data[1].creationDate)}</Text>
          </Card.Content>
        </Card>
      </View>
    );
  }
}

export default FetcherHistory;
