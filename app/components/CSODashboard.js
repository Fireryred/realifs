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
    const endDate = data[1].endDateTime.toDate();

    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    //retain hours and minutes of endDate
    yesterday.setHours(endDate.getHours());
    yesterday.setMinutes(endDate.getMinutes());

    const fyesterday = firestore.Timestamp.fromDate(yesterday);
    await firestore()
      .collection('donation_efforts')
      .doc(data[0])
      .update({isDeleted: true, endDateTime: fyesterday});
  }
  render() {
    const {data, gotoDono} = this.props;
    const {noOfDeliveries, date} = this.state;
    let button = data[1].isDeleted ? 'View' : 'Edit';
    return (
      <View style={{marginBottom: 5}}>
        <Card style={{margin: 3}}>
          <Card.Content>
            <View style={{marginBottom: 5}}>
              <Text style={{fontWeight: 'bold', fontSize: 18}}>
                {data[1].title}
              </Text>
            </View>

            <View style={{marginBottom: 15}}>
              <Text style={{color: 'gray'}}>STARTED {date}</Text>
            </View>

            <View style={{marginBottom: 15}}>
              <Text>Address: {data[1].geocodeAddress}</Text>
            </View>

            <View style={{marginBottom: 15}}>
              <Text style={{color: 'gray', textAlign: 'right'}}>
                Deliveries Received: {noOfDeliveries}
              </Text>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              {!data[1].isDeleted && (
                <Button
                  mode="outlined"
                  color="red"
                  title="delete"
                  onPress={() => this.updateDonoEff()}>
                  Delete
                </Button>
              )}
              <Button
                mode="outlined"
                style={{marginLeft: 10}}
                title={button}
                onPress={() => gotoDono(data)}>
                {button}
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  }
}

export default CSODashboard;
