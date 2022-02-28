import React, {Component} from 'react';
import {View, ScrollView, RefreshControl} from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CSOIncomingDonation from '../../components/CSOIncomingDonation';

import { Caption, Text, Button } from 'react-native-paper';
export class IncomingDonations extends Component {
  constructor() {
    super();
    this.state = {pickup: {}, transit: {}, delivered: {}, refreshing: false};
  }
  componentDidMount() {
    this.getDonationEffortId().catch(error => console.error(error));
    this.props.navigation.getParent().setOptions({title: 'Incoming Donations'});

    let unsubscribe = this.props.navigation.addListener('tabPress', e => {
      // Prevent default action
      // e.preventDefault();
      this.props.navigation
        .getParent()
        .setOptions({title: 'Incoming Donations'});
    });
  }
  async getDonationEffortId() {
    this.setState({
      ...this.state,
      pickup: {},
      transit: {},
      delivered: {},
    })
    await firestore()
      .collection('donation_efforts')
      .where('csoID', '==', auth().currentUser.uid)
      .get()
      .then(query => {
        query.forEach(doc => {
          this.getFetchRequest(doc.id, doc.data().title);
        });
      });
  }

  async getFetchRequest(effortId, effortName) {
    let pickup = {},
      transit = {},
      delivered = {};
    let query = await firestore()
      .collection('fetch_requests')
      .where('effortId', '==', effortId)
      .where('status', '!=', 'waiting')
      .get()

    query.forEach(doc => {
      switch (doc.data().status) {
        case 'pickup':
          pickup[doc.id] = {
            effortName: effortName,
            requestData: doc.data(),
          };
          break;

        case 'transit':
          transit[doc.id] = {
            effortName: effortName,
            requestData: doc.data(),
          };
          break;

        case 'delivered':
          delivered[doc.id] = {
            effortName: effortName,
            requestData: doc.data(),
          };
          break;
      }
    });
      
    this.setState({ 
      pickup: {...this.state.pickup, ...pickup}, 
      transit: {...this.state.transit, ...transit}, 
      delivered: {...this.state.delivered, ...delivered}
    });
  }
  toTrack = effortId => {
    this.props.navigation.navigate('TrackFetcher', {effortId: effortId});
  };

  setRefreshing = (isRefreshing) => {
    this.setState({
      ...this.setState,
      refreshing: isRefreshing,
    })
  }

  render() {
    const {pickup, transit, delivered} = this.state;
    console.log("transit object", transit)
    return (
      <ScrollView style={{padding: 10}} refreshControl={
        <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => {
              console.log(this.state.refreshing); 
              this.getDonationEffortId().catch(error => console.error(error)); 
              this.setRefreshing(false)}
            }
        />}>
        <Text style={{fontSize: 18, color: "black", fontWeight: "bold", marginVertical: 10}}>INCOMING DONATIONS</Text>
        {Object.entries(transit).map((efforts, key) => (
          <CSOIncomingDonation
            data={efforts}
            key={key}
            getDonationEffortId={this.getDonationEffortId.bind(this)}
            toTrack={this.toTrack}
          />
        ))}
        {Object.entries(pickup).map((efforts, key) => (
          <CSOIncomingDonation
            data={efforts}
            key={key}
            getDonationEffortId={this.getDonationEffortId.bind(this)}
            toTrack={this.toTrack}
          />
        ))}
        <Text style={{fontSize: 18, color: "black", fontWeight: "bold", marginVertical: 10}}>RECEIVED</Text>
        {Object.entries(delivered).map((efforts, key) => (
          <CSOIncomingDonation
            data={efforts}
            key={key}
            toTrack={this.toTrack}
          />
        ))}
        
      </ScrollView>
    );
  }
}

export default IncomingDonations;
