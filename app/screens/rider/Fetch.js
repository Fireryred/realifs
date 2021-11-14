import React, { Component } from 'react'
import { Text, View } from 'react-native'

export class Fetch extends Component {
    componentDidMount() {
        this.props.navigation.getParent().setOptions({title: 'Fetch'});

        let unsubscribe = this.props.navigation.addListener('tabPress', (e) => {
            // Prevent default action
            // e.preventDefault();
            this.props.navigation.getParent().setOptions({title: 'Fetch'});
          });
    }

    render() {
        return (
            <View>
                <Text> Fetch </Text>
            </View>

        )
    }
}

export default Fetch
