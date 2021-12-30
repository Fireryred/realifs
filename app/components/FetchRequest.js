import React, {Component} from 'react';
import {Button, Image, Text, View} from 'react-native';
class FetchRequest extends React.Component {
  render() {
    return (
      <View>
        <View>
          <Text style={{color: 'black'}}>FETCH REQUEST BY</Text>
          <View>
            <Image></Image>
            <Text style={{color: 'black'}}></Text>
            <Text style={{color: 'black'}}></Text>
          </View>
          <View>
            <View>
              <Text style={{color: 'black'}}>POINT A (PICK-UP)</Text>
              <Text style={{color: 'black'}}></Text>
            </View>
            <View>
              <Text style={{color: 'black'}}>POINT B (DROP-OFF)</Text>
              <Text style={{color: 'black'}}></Text>
            </View>
          </View>
          <View>
            <Text style={{color: 'black'}}></Text>
            <Button title="TAKE" onPress={() => this.props.toMaps()} />
          </View>
        </View>
      </View>
    );
  }
}

export default FetchRequest;
