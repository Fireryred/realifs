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
      <View style={{flex: 1, display: "flex", justifyContent: "flex-end", padding: 20}}>
        <View>
          <View style={{marginBottom: 20, display: "flex", alignItems: "flex-end", textAlign: "right"}}>
            <Text style={{color: 'black', fontWeight: "bold", fontSize: 30}}>₱{balance}</Text>
            <Text style={{color: 'black'}}>Current Balance</Text>
          </View>
          
          <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
            <Button mode="contained" title="CASH-IN" onPress={this.toCashIn} style={{marginRight: 10}} contentStyle={{height: 50, backgroundColor: "#1D9C08"}}>
              CASH-IN
            </Button>
            <Button mode="contained" title="CASH-OUT" onPress={this.toCashOut} contentStyle={{height: 50, backgroundColor: "#EEAB00"}}>
              CASH-OUT
            </Button>
          </View>
          
        </View>
        
      </View>
    );
  }
}

export default Wallet;
