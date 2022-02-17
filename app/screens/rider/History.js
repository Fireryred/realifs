import React, {Component} from 'react';
import {Text, ScrollView} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import FetcherHistory from '../../components/FetcherHistory';

export class History extends Component {
  constructor() {
    super();
    this.state = {
      completed: {},
      cancelled: {},
    };
  }
  componentDidMount() {
    this.props.navigation.getParent().setOptions({title: 'History'});

    let unsubscribe = this.props.navigation.addListener('tabPress', e => {
      // Prevent default action
      // e.preventDefault();
      this.props.navigation.getParent().setOptions({title: 'History'});
    });
    this.getFetchRequests();
  }
  async getFetchRequests() {
    const completed = {},
      cancelled = {};
    await firestore()
      .collection('fetch_requests')
      .where('status', 'in', ['delivered', 'cancelled'])
      .where('fetcherId', '==', auth().currentUser.uid)
      .get()
      .then(query => {
        query.forEach(doc => {
          switch (doc.data().status) {
            case 'delivered':
              completed[doc.id] = doc.data();
              break;

            case 'cancelled':
              cancelled[doc.id] = doc.data();
              break;
          }
        });
      });
    this.setState({completed, cancelled});
  }
  render() {
    const {completed, cancelled} = this.state;
    return (
      <ScrollView>
        <Text>Completed</Text>
        {Object.entries(completed).map((request, key) => (
          <FetcherHistory data={request} key={key} />
        ))}
        <Text>Cancelled</Text>
        {Object.entries(cancelled).map((request, key) => (
          <FetcherHistory data={request} key={key} />
        ))}
      </ScrollView>
    );
  }
}

export default History;
