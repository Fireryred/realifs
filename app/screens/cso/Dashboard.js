import React, {Component} from 'react';
import {View, ScrollView} from 'react-native';

import {Text, Button} from 'react-native-paper';

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
      <ScrollView style={{padding: 10}}>

          <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <Text style={{flex: 7, fontWeight: "bold", fontSize: 24}}>Donation Efforts</Text>
            <View style={{flex: 3, alignItems: "flex-end"}}>
              <Button style={{borderRadius: 50}} mode="contained" title="create" onPress={() => this.gotoCreateDono()}>
                + CREATE
              </Button>
            </View>
          </View>
          
          <Text style={{color: "gray", fontWeight: "bold", marginVertical: 10}}>ACTIVE</Text>
          {Object.entries(efforts.active).map((efforts, key) => (
            <CSODashboard
              data={efforts}
              key={key}
              gotoDono={this.gotoViewDono}
            />
          ))}
          <Text style={{color: "gray", fontWeight: "bold", marginVertical: 10}}>FINISHED</Text>
          {Object.entries(efforts.inactive).map((efforts, key) => (
            <CSODashboard
              data={efforts}
              key={key}
              gotoDono={this.gotoViewDono}
            />
          ))}

      </ScrollView>
    );
  }
}

export default Dashboard;
