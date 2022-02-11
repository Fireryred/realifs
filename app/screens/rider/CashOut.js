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
    console.log(this.props);
    let balance = this.props.route.params.balance;
    const {amount} = this.state;
    if (amount === '' || amount <= 0) {
      Alert.alert('Please enter a valid amount');
    } else if (balance < amount) {
      Alert.alert(`You only have ${balance} in your account`);
    } else {
      balance = balance - amount;
      this.updateDB(amount, balance);
      Alert.alert(`Cash-out request sent`, '', {
        text: 'OK',
        onPress: () => this.props.navigation.goBack(),
      });
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
      <View>
        <Text>CASH-OUT AMOUNT</Text>
        <TextInput
          value={this.state.amount}
          keyboardType="numeric"
          onChange={text => this.setState({amount: text.nativeEvent.text})}
        />

        <View>
          <Button title="CANCEL" onPress={() => this.props.navigation.goBack()}>
            CANCEL
          </Button>
          <Button title="CASH-OUT" onPress={this.handleCashOut}>
            CASH-OUT
          </Button>
        </View>
      </View>
    );
  }
}
export default CashOut;
