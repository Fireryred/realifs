import React, {Component} from 'react';
import {View, Alert} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
class CashIn extends Component {
  constructor() {
    super();
    this.state = {
      amount: '',
    };
  }

  handleCashIn = () => {
    const amount = parseInt(this.state.amount * 100);
    const balance = parseInt(this.props.route.params.balance);
    if (amount <= 0 || amount === '' || amount % 1 !== 0) {
      Alert.alert('Please enter a valid amount');
    } else if (amount < 10000) {
      Alert.alert('Please enter a minimum amount of \u20B1100');
    } else {
      this.props.navigation.reset({
        index: 1,
        routes: [
          {name: 'RiderDrawer'},
          {
            name: 'FetcherWalletProcess',
            params: {
              action: 'cashIn',
              balance,
              amount,
            },
          },
        ],
      });
    }
  };
  render() {
    return (
      <View
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          padding: 10,
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 18}}>Cash-in Amount</Text>
        <TextInput
          mode="outlined"
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
            color="green"
            title="CASH-IN"
            onPress={this.handleCashIn}>
            CASH-IN
          </Button>
        </View>
      </View>
    );
  }
}

export default CashIn;
