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
      console.log(error);
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

  async updateDonoEff() {
    const {data} = this.props;
    await firestore()
      .collection('donation_efforts')
      .doc(data[0])
      .update({isDeleted: true});
  }
  render() {
    const {data, gotoDono} = this.props;
    const {noOfDeliveries, date} = this.state;
    let button = data[1].isDeleted ? 'View' : 'Edit';
    return (
      <View>
        <Card>
          <Card.Content>
            <Text>{data[1].title}</Text>
            <Text>STARTED {date}</Text>
            <Text>Address: {data[1].geocodeAddress}</Text>
            <Text>DELIVERIES RECIEVED: {noOfDeliveries}</Text>
            {!data[1].isDeleted && (
              <Button title="delete" onPress={() => this.updateDonoEff()}>
                Delete
              </Button>
            )}
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
