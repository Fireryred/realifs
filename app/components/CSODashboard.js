import React, {Component} from 'react';
import {View} from 'react-native';
import {Button, Card, Text} from 'react-native-paper';

import firestore from '@react-native-firebase/firestore';
class CSODashboard extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    this.getNoOfDeliveries().catch(error => {
      console.log(errorr);
    });
    this.formatDate();
  }

  async getNoOfDeliveries() {
    let noOfDeliveries = 0;
    const {data} = this.props;

    const deliveries = await firestore()
      .collection('fetch_requests')
      .where('effortId', '==', data[0])
      .where('status', '==', 'delivered')
      .get();
    deliveries.forEach(doc => {
      noOfDeliveries += 1;
    });

    this.setState({noOfDeliveries: noOfDeliveries});
  }

  formatDate() {
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
    const {data} = this.props;
    const fdate = data[1].startDateTime;
    const date = new firestore.Timestamp(
      fdate.seconds,
      fdate.nanoseconds,
    ).toDate();
    const cdate = `${month[
      date.getMonth()
    ].toUpperCase()} ${date.getDate()}, ${date.getFullYear()}`;
    this.setState({date: cdate});
  }

  render() {
    const {data, gotoDono} = this.props;
    const {noOfDeliveries, date} = this.state;
    let button = data[1].isDelivered ? 'View' : 'Edit';
    return (
      <View>
        <Card>
          <Card.Content>
            <Text>{data[1].title}</Text>
            <Text>STARTED {date}</Text>
            <Text>Address: {data[1].geocodeAddress}</Text>
            <Text>DELIVERIES RECIEVED: {noOfDeliveries}</Text>
            <Button title={button} onPress={() => gotoDono(data)}>
              {button}
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }
}

export default CSODashboard;
