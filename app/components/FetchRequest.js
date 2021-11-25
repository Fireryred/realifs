import React, {Component} from 'react';
import {Button, Image, Text, View} from 'react-native';
class FetchRequest extends React.Component {
  render() {
    return (
      <View>
        <View>
          <Text>FETCH REQUEST BY</Text>
          <View>
            <Image></Image>
            <Text></Text>
            <Text></Text>
          </View>
          <View>
            <View>
              <Text>POINT A (PICK-UP)</Text>
              <Text></Text>
            </View>
            <View>
              <Text>POINT B (DROP-OFF)</Text>
              <Text></Text>
            </View>
          </View>
          <View>
            <Text></Text>
            <Button title="TAKE" onPress={() => this.props.toMaps()} />
          </View>
        </View>
      </View>
    );
  }
}

export default FetchRequest;
