import React, {Component} from 'react';
import {Text, View, Button, ScrollView} from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CSODashboard from '../../components/CSODashboard';

export class Dashboard extends Component {
  constructor() {
    super();
    this.state = {efforts: {active: {}, inactive: {}}};
  }
  componentDidMount() {
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

  gotoCreateDono() {
    this.props.navigation.navigate('CreateDonationEffort');
  }

  gotoViewDono = data => {
    this.props.navigation.navigate('ViewDonationEffort', {data: data});
  };

  async getDonationEfforts() {
    let active = {};
    let inactive = {};
    const donationEfforts = await firestore()
      .collection('donation_efforts')
      .where('csoID', '==', auth().currentUser.uid)
      .orderBy('isDeleted', 'asc')
      .get();
    donationEfforts.forEach(doc => {
      if (doc.data().isDisabled) {
        inactive[doc.id] = doc.data();
      } else {
        active[doc.id] = doc.data();
      }
    });
    this.setState({efforts: {active: {...active}, inactive: {...inactive}}});
  }
  render() {
    const {efforts} = this.state;
    return (
      <ScrollView>
        <View>
          <Text> Dashboard </Text>
          <Button title="create" onPress={() => this.gotoCreateDono()}>
            +CREATE
          </Button>
          <Text>Active Donation</Text>
          {Object.entries(efforts.active).map((efforts, key) => (
            <CSODashboard
              data={efforts}
              key={key}
              gotoDono={this.gotoViewDono}
            />
          ))}
          <Text>Finished Donation</Text>
          {Object.entries(efforts.inactive).map((efforts, key) => (
            <CSODashboard
              data={efforts}
              key={key}
              gotoDono={this.gotoViewDono}
            />
          ))}
        </View>
      </ScrollView>
    );
  }
}

export default Dashboard;
