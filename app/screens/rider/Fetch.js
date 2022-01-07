import React, {Component} from 'react';
import {Button, ScrollView, View} from 'react-native';
import FetchRequest from '../../components/FetchRequest';
import firestore from '@react-native-firebase/firestore';

export class Fetch extends Component {
  constructor() {
    super();
    this.state = {
      requests: {},
    };
  }
  componentDidMount() {
    this.props.navigation.getParent().setOptions({title: 'Fetch'});

    let unsubscribe = this.props.navigation.addListener('tabPress', e => {
      // Prevent default action
      // e.preventDefault();
      this.props.navigation.getParent().setOptions({title: 'Fetch'});
    });
    this.getRequests().catch(error => {
      console.error();
    });
  }
  async getRequests() {
    const requests = {};
    const fetchRequest = await firestore().collection('fetch_requests').get();
    fetchRequest.forEach(doc => {
      requests[doc.id] = doc.data();
    });
    this.setState({requests: {...requests}});
  }

  toMaps = (data, donorDetails) => {
    this.props.navigation.navigate('Maps', {
      data: data,
      donorDetails: donorDetails,
    });
  };

  render() {
    const {requests} = this.state;
    return (
      <ScrollView>
        {Object.entries(requests).map((request, key) => (
          <FetchRequest data={request} key={key} toMaps={this.toMaps} />
        ))}
      </ScrollView>
    );
  }
}

export default Fetch;
