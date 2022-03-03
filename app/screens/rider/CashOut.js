import React, {Component} from 'react';
import {Alert, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export class CashOut extends Component {
  constructor() {
    super();
    this.state = {
      amount: '',
    };
  }

  handleCashOut = () => {
    const {balance} = this.props.route.params;
    const amount = parseInt(this.state.amount * 100);
    let balance = isNaN(balance) ? 0 : parseInt(balance);
    if (this.state.amount === '' || amount <= 0 || amount % 1 !== 0) {
      Alert.alert('Please enter a valid amount');
    } else if (balance < amount) {
      Alert.alert(`You only have ₱${balance / 100} in your account`);
    } else {
      balance = balance - amount;
      this.updateDB(amount, balance);
      Alert.alert(`Cash-out request sent`, '', [
        {
          text: 'OK',
          onPress: () => this.props.navigation.goBack(),
        },
      ]);
    }
  };
  async updateDB(amount, balance) {
    const date = firestore.Timestamp.now();
    const fetcherId = auth().currentUser.uid;
    await firestore()
      .collection('transaction')
      .add({fetcherId, amount, date, status: 'pending', action: 'cashOut'});
    await firestore().collection('users').doc(fetcherId).update({balance});
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          padding: 10,
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 18}}>Cash-out Amount</Text>
        <TextInput
          value={this.state.amount}
          keyboardType="numeric"
          onChangeText={text => this.setState({amount: text})}
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Button
            style={{margin: 10}}
            mode="contained"
            color="gray"
            dark={true}
            title="CANCEL"
            onPress={() => this.props.navigation.goBack()}>
            CANCEL
          </Button>
          <Button
            style={{margin: 10}}
            mode="contained"
            color="orange"
            dark={true}
            title="CASH-IN"
            onPress={this.handleCashOut}>
            CASH-OUT
          </Button>
        </View>
      </View>
    );
  }
}
export default CashOut;
