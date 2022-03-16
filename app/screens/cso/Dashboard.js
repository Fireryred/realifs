import React, {Component} from 'react';
import {View, ScrollView, RefreshControl} from 'react-native';

import {Text, Button, ToggleButton} from 'react-native-paper';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CSODashboard from '../../components/CSODashboard';

export class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      isDeleted: false,
      lastEffort: {},
      efforts: {},
      refreshing: false,
    };
  }
  componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      'focus',
      () => {
        this.getDonationEfforts();
      },
    );
    this.props.navigation.getParent().setOptions({title: 'Dashboard'});

    let unsubscribe = this.props.navigation.addListener('tabPress', e => {
      // Prevent default action
      // e.preventDefault();
      this.props.navigation.getParent().setOptions({title: 'Dashboard'});
    });

    this.getDonationEfforts().catch(error => {
      console.error(error);
    });
  }
  componentDidUpdate() {
    this.getDonationEfforts();
  }
  componentWillUnmount() {
    this.willFocusSubscription();
  }

  gotoCreateDono() {
    this.props.navigation.navigate('CreateDonationEffort');
  }

  gotoViewDono = data => {
    this.props.navigation.navigate('ViewDonationEffort', {data: data});
  };

  gotoViewDonos = (data, effortName) => {
    this.props.navigation.navigate('ViewDonation', {
      data: data,
      effortName: effortName,
    });
  };

  async getDonationEfforts() {
    let effort = {};
    let last = {};
    const {isDeleted} = this.state;
    const donationEfforts = await firestore()
      .collection('donation_efforts')
      .where('csoID', '==', auth().currentUser.uid)
      .where('isDeleted', '==', isDeleted)
      .orderBy('startDateTime', 'asc')
      .limit(10)
      .get();
    donationEfforts.forEach(doc => {
      effort[doc.id] = doc.data();
      last = doc.data().startDateTime;
    });
    this.setState({efforts: {...effort}, lastEffort: last});
  }

  async handleLazyLoading() {
    let effort = this.state.efforts;
    let last = {};
    const {isDeleted, lastEffort} = this.state;
    const donationEfforts = await firestore()
      .collection('donation_efforts')
      .where('csoID', '==', auth().currentUser.uid)
      .where('isDeleted', '==', isDeleted)
      .orderBy('startDateTime', 'asc')
      .startAfter(lastEffort)
      .limit(10)
      .get();
    donationEfforts.forEach(doc => {
      effort[doc.id] = doc.data();
      last = doc.data().startDateTime;
    });

    this.setState({efforts: {...effort}, lastEffort: last});
  }

  setRefreshing = isRefreshing => {
    this.setState({
      ...this.setState,
      refreshing: isRefreshing,
    });
  };

  render() {
    const {efforts, isDeleted} = this.state;
    return (
      <ScrollView
        style={{padding: 10}}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => {
              console.log(this.state.refreshing);
              this.getDonationEfforts().catch(error => console.error(error));
              this.setRefreshing(false);
            }}
          />
        }>
        <View
          style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{flex: 7, fontWeight: 'bold', fontSize: 24}}>
            Donation Efforts
          </Text>
          <View style={{flex: 3, alignItems: 'flex-end'}}>
            <Button
              style={{borderRadius: 50}}
              mode="contained"
              title="create"
              onPress={() => this.gotoCreateDono()}>
              + CREATE
            </Button>
          </View>
        </View>
        <ToggleButton.Row
          onValueChange={value => this.setState({isDeleted: value})}
          value={isDeleted}>
          <ToggleButton
            value={false}
            icon={() => (
              <Text
                style={{
                  color: 'gray',
                  fontWeight: 'bold',
                  marginVertical: 10,
                }}>
                ACTIVE
              </Text>
            )}
          />
          <ToggleButton
            value={true}
            icon={() => (
              <Text
                style={{
                  color: 'gray',
                  fontWeight: 'bold',
                  marginVertical: 10,
                }}>
                INACTIVE
              </Text>
            )}
          />
        </ToggleButton.Row>
        {Object.entries(efforts).map((efforts, key) => (
          <CSODashboard
            data={efforts}
            key={key}
            gotoDono={this.gotoViewDono}
            gotoViewDonos={this.gotoViewDonos}
          />
        ))}
        <Button onPress={() => this.handleLazyLoading()}>Load More</Button>
      </ScrollView>
    );
  }
}

export default Dashboard;
