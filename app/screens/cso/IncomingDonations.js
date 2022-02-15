import React, {Component} from 'react';
import {Text, View, Button} from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CSOIncomingDonation from '../../components/CSOIncomingDonation';

export class IncomingDonations extends Component {
  constructor() {
    super();
    this.state = {pickup: {}, transit: {}, delivered: {}};
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
    await firestore()
      .collection('fetch_requests')
      .where('effortId', '==', effortId)
      .where('status', '!=', 'waiting')
      .get()
      .then(query => {
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
      });
    this.setState({pickup, transit, delivered});
  }
  toTrack = effortId => {
    this.props.navigation.navigate('TrackFetcher', {effortId: effortId});
  };
  render() {
    const {pickup, transit, delivered} = this.state;
    return (
      <View>
        <Text> Incoming Donations </Text>
        {Object.entries(transit).map((efforts, key) => (
          <CSOIncomingDonation
            data={efforts}
            key={key}
            toTrack={this.toTrack}
          />
        ))}
        {Object.entries(pickup).map((efforts, key) => (
          <CSOIncomingDonation
            data={efforts}
            key={key}
            toTrack={this.toTrack}
          />
        ))}
        <Text>Recieved</Text>
        {Object.entries(delivered).map((efforts, key) => (
          <CSOIncomingDonation
            data={efforts}
            key={key}
            toTrack={this.toTrack}
          />
        ))}
      </View>
    );
  }
}

export default IncomingDonations;
