import React, {Component} from 'react';
import {Alert, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default class CashOut extends Component {
  constructor() {
    super();
    this.state = {
      amount: '',
      mobileNumber: '',
    };
  }

  componentDidMount() {
    this.setState({mobileNumber: this.props.route.params.mobileNumber});
  }

  handleCashOut() {
    const {balance} = this.props.route.params;
    const {amount} = this.state;
    if (amount === '' || amount <= 0) {
      Alert.alert('Please enter a valid amount');
    } else if (balance < amount) {
      Alert.alert(`You only have ${balance} in your account`);
    } else {
      this.updateMobileNumber();
      this.props.navigation.reset({
        index: 1,
        routes: [
          {name: 'RiderDrawer'},
          {
            name: 'FetcherWalletProcess',
            params: {
              action: 'cashOut',
              balance,
              amount,
            },
          },
        ],
      });
    }
  }
  async updateMobileNumber() {
    await firestore().collection('users').doc(auth().currentUser.uid).update({
      mobileNumber: this.state.mobileNumber,
    });
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

        <Text>CASH-OUT AMOUNT</Text>
        <TextInput
          value={this.state.mobileNumber}
          keyboardType="numeric"
          onChange={text =>
            this.setState({mobileNumber: text.nativeEvent.text})
          }
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
