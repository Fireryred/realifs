import React, {Component} from 'react';
import {Text, View, Button} from 'react-native';
import {Card} from 'react-native-paper';

export class Dashboard extends Component {
  componentDidMount() {
    this.props.navigation.getParent().setOptions({title: 'Dashboard'});

    let unsubscribe = this.props.navigation.addListener('tabPress', e => {
      // Prevent default action
      // e.preventDefault();
      this.props.navigation.getParent().setOptions({title: 'Dashboard'});
    });
  }
  gotoCreateDono() {
    this.props.navigation.navigate('CreateDonationEffort');
  }
  render() {
    return (
      <View>
        <View>
          <Text> Dashboard </Text>
          <Button title="create" onPress={() => this.gotoCreateDono()}>
            +CREATE
          </Button>
        </View>
      </View>
    );
  }
}

export default Dashboard;
