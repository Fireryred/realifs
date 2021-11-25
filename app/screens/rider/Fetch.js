import React, {Component} from 'react';
import {View} from 'react-native';
import FetchRequest from '../../components/FetchRequest';

export class Fetch extends Component {
  componentDidMount() {
    this.props.navigation.getParent().setOptions({title: 'Fetch'});

    let unsubscribe = this.props.navigation.addListener('tabPress', e => {
      // Prevent default action
      // e.preventDefault();
      this.props.navigation.getParent().setOptions({title: 'Fetch'});
    });
  }
  toMaps = () => {
    alert('button boop');
    this.props.navigation.navigate('Maps');
  };

  render() {
    return (
      <View>
        <FetchRequest toMaps={this.toMaps} />
      </View>
    );
  }
}

export default Fetch;
