import React, {Component} from 'react';
import {View, Text, ScrollView} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import CSOIncomingDonation from '../../components/CSOIncomingDonation';
import {Button} from 'react-native-paper';
class ViewDonation extends Component {
  constructor() {
    super();
    this.state = {
      last: {},
      request: {},
    };
  }
  componentDidMount() {
    this.getDonationEfforts();
  }
  async getDonationEfforts() {
    const {data, effortName} = this.props.route.params;
    let last = {},
      request = {};
    let query = await firestore()
      .collection('fetch_requests')
      .where('effortId', '==', data)
      .where('status', '==', 'delivered')
      .orderBy('creationDate')
      .limit(10)
      .get();
    query.forEach(doc => {
      request[doc.id] = {effortName: effortName, requestData: doc.data()};
      last = doc.data().creationDate;
    });
    this.setState({request, last});
  }
  async handleLazyLoading() {
    const {data, effortName} = this.props.route.params;
    const {last, request} = this.state;
    let lastData = {},
      requests = {};
    let query = await firestore()
      .collection('fetch_requests')
      .where('effortId', '==', data)
      .where('status', '==', 'delivered')
      .orderBy('creationDate')
      .startAfter(last)
      .limit(10)
      .get();
    query.forEach(doc => {
      request[doc.id] = {effortName: effortName, requestData: doc.data()};
      lastData = doc.data().creationDate;
    });
    console.log(requests);
    this.setState({request: {...request, ...requests}, last: lastData});
  }
  render() {
    const {request} = this.state;
    return (
      <ScrollView>
        <Text>View Donation</Text>
        {Object.entries(request).map((efforts, key) => (
          <CSOIncomingDonation data={efforts} key={key} />
        ))}
        <Button onPress={() => this.handleLazyLoading()}>Load More</Button>
      </ScrollView>
    );
  }
}

export default ViewDonation;
