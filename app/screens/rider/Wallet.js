import React, {Component} from 'react';
import {Text, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Button} from 'react-native-paper';

export class Wallet extends Component {
  constructor() {
    super();
    this.state = {balance: 0, mobileNumber: ''};
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
      .then(doc =>
        this.setState({
          balance: doc.data().balance,
          mobileNumber: doc.data().mobileNumber,
        }),
      );
  }
  toCashIn = () => {
    this.props.navigation.navigate('CashIn', {...this.state});
  };
  toCashOut = () => {
    this.props.navigation.navigate('CashOut', {...this.state});
  };
  render() {
    const {balance} = this.state;
    return (
      <View>
        <Text style={{color: 'black'}}> REALIFS Fetcher Wallet </Text>
        <Text style={{color: 'black'}}>₱{balance}</Text>
        <Text style={{color: 'black'}}>Current Balance</Text>
        <Button title="CASH-IN" onPress={this.toCashIn}>
          CASH-IN
        </Button>
        <Button title="CASH-OUT" onPress={this.toCashOut}>
          CASH-OUT
        </Button>
      </View>
    );
  }
}

export default Wallet;
