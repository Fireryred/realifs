import React, {Component} from 'react';
import {Text, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Button} from 'react-native-paper';

export class Wallet extends Component {
  constructor() {
    super();
    this.state = {balance: 0};
  }
  componentDidMount() {
    this.getBalance();
    this.props.navigation.getParent().setOptions({title: 'Wallet'});

    let unsubscribe = this.props.navigation.addListener('tabPress', e => {
      // Prevent default action
      // e.preventDefault();
      this.props.navigation.getParent().setOptions({title: 'Wallet'});
    });
  }
  async getBalance() {
    await firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .get()
      .then(doc => this.setState({balance: doc.data().balance}));
  }
  render() {
    const {balance} = this.state;
    return (
      <View>
        <Text style={{color: 'black'}}> REALIFS Fetcher Wallet </Text>
        <Text style={{color: 'black'}}>₱{balance}</Text>
        <Text style={{color: 'black'}}>Current Balance</Text>
        <Button title="CASH-IN">CASH-IN</Button>
        <Button title="CASH-OUT">CASH-OUT</Button>
      </View>
    );
  }
}

export default Wallet;
