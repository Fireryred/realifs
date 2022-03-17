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
      hasMore: true,
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
      .limit(5)
      .get();
    query.forEach(doc => {
      request[doc.id] = {effortName: effortName, requestData: doc.data()};
      last = doc.data().creationDate;
    });
    this.setState({request, last}, () => this.checkHasMore());
  }

  async handleLazyLoading() {
    const {data, effortName} = this.props.route.params;
    const {last} = this.state;
    let lastData = {},
      requests = this.state.request;
    let query = await firestore()
      .collection('fetch_requests')
      .where('effortId', '==', data)
      .where('status', '==', 'delivered')
      .orderBy('creationDate')
      .startAfter(last)
      .limit(5)
      .get();
    query.forEach(doc => {
      request[doc.id] = {effortName: effortName, requestData: doc.data()};
      lastData = doc.data().creationDate;
    });
    this.setState({request: {...requests}, last: lastData}, () =>
      this.checkHasMore(),
    );
  }

  async checkHasMore() {
    const {data} = this.props.route.params;
    const {last} = this.state;
    let lastData = {};
    let hasMore = true;

    const donationEfforts = await firestore()
      .collection('fetch_requests')
      .where('effortId', '==', data)
      .where('status', '==', 'delivered')
      .orderBy('creationDate')
      .startAfter(last)
      .limit(1)
      .get();
    donationEfforts.forEach(doc => {
      lastData = doc.data().creationDate;
    });

    if (Object.keys(lastData).length === 0 && lastData.constructor === Object) {
      console.log(lastData);
      hasMore = false;
    }

    this.setState({hasMore});
  }

  render() {
    const {request, hasMore} = this.state;
    return (
      <ScrollView>
        {Object.entries(request).map((efforts, key) => (
          <CSOIncomingDonation data={efforts} key={key} />
        ))}
        {hasMore && (
          <Button onPress={() => this.handleLazyLoading()}>Load More</Button>
        )}
      </ScrollView>
    );
  }
}

export default ViewDonation;
