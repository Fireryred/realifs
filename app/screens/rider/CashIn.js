import React, {Component} from 'react';
import {View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
class CashIn extends Component {
  constructor() {
    super();
    this.state = {
      amount: '',
    };
  }

  handleCashIn = () => {
    const amount = this.state.amount * 100;
    const balance = this.props.route.params.balance * 100;
    if (amount <= 0 || amount === '') {
      Alert.alert('Please enter a valid amount');
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
      <View>
        <Text>CASH-IN AMOUNT</Text>
        <TextInput
          keyboardType="numeric"
          onChangeText={text => this.setState({amount: text})}
        />
        <View>
          <Button title="CANCEL" onPress={() => this.props.navigation.goBack()}>
            CANCEL
          </Button>
          <Button title="CASH-IN" onPress={this.handleCashIn}>
            CASH-IN
          </Button>
        </View>
      </View>
    );
  }
}

export default CashIn;
