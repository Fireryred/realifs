import React, {Component} from 'react';
import {Alert, ScrollView} from 'react-native';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';

import FetchRequest from '../../components/FetchRequest';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export class Fetch extends Component {
  constructor() {
    super();
    this.state = {
      balance: 0,
      data: {},
      donorDetails: {},
      exists: false,
      requests: {},
    };
  }
  componentDidMount() {
    if (ReactNativeForegroundService.is_running) {
      ReactNativeForegroundService.stop();
    }
    this.props.navigation.getParent().setOptions({title: 'Fetch'});

    let unsubscribe = this.props.navigation.addListener('tabPress', e => {
      // Prevent default action
      // e.preventDefault();
      this.props.navigation.getParent().setOptions({title: 'Fetch'});
    });
    this.getBalance().catch(error => {
      console.error(error);
    });
    this.checkRiderStatus().catch(error => {
      console.error();
    });
    this.getRequests().catch(error => {
      console.error();
    });
  }
  async checkRiderStatus() {
    let data = {};
    let exists = false;
    let donor = {};
    const fetchRequest = await firestore()
      .collection('fetch_requests')
      .where('fetcherId', '==', auth().currentUser.uid)
      .where('status', 'in', ['pickup', 'transit'])
      .get();
    fetchRequest.forEach(doc => {
      if (doc.exists) {
        data = [doc.id, doc.data()];
        firestore()
          .collection('users')
          .doc(doc.data().donorID)
          .get()
          .then(doc => {
            exists = doc.exists;
            donor = doc;
            this.setState({
              data: {...data},
              donorDetails: {...donor},
              exists: exists,
            });
          });
      }
    });
  }

  async getRequests() {
    const requests = {};
    const fetchRequest = await firestore()
      .collection('fetch_requests')
      .where('status', '==', 'waiting')
      .get();
    fetchRequest.forEach(doc => {
      requests[doc.id] = doc.data();
    });
    this.setState({requests: {...requests}});
  }

  toMaps = (data, donorDetails) => {
    console.log(this.state.balance);
    this.updateStatus(data);
    data[1].status = 'pickup';
    console.log(data);
    this.props.navigation.navigate('Maps', {
      data: data,
      donorDetails: donorDetails,
    });
  };
  checkBalance = (data, donorDetails) => {
    const {balance, exists} = this.state;
    if (
      !exists &&
      data[1].cost * 0.2 > balance &&
      data[1].paymentMethod === 'cod'
    ) {
      Alert.alert("Doesn't have enough balance to accept this");
    } else {
      this.toMaps(data, donorDetails);
    }
  };
  async updateStatus(data) {
    await firestore()
      .collection('fetch_requests')
      .doc(data[0])
      .update({status: 'pickup', fetcherId: auth().currentUser.uid})
      .then(() => console.log('Status Updated to pickup'));
  }

  async getBalance() {
    await firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .get()
      .then(doc => {
        console.log(doc.data().balance);
        this.setState({balance: doc.data().balance});
      });
  }
  render() {
    const {requests, data, donorDetails, exists} = this.state;
    if (exists) {
      this.toMaps(data, donorDetails);
    }
    return (
      <ScrollView>
        {Object.entries(requests).map((request, key) => (
          <FetchRequest data={request} key={key} toMaps={this.checkBalance} />
        ))}
      </ScrollView>
    );
  }
}

export default Fetch;
