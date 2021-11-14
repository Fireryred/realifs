import React, { Component } from 'react'
import { Text, View } from 'react-native'

export class Donations extends Component {
    componentDidMount() {
        this.props.navigation.getParent().setOptions({title: 'Donation'});

        let unsubscribe = this.props.navigation.addListener('tabPress', (e) => {
            // Prevent default action
            // e.preventDefault();
            this.props.navigation.getParent().setOptions({title: 'Donations'});
          });
    }

    render() {
        return (
            <View>
                <Text> Donations </Text>
            </View>
        )
    }
}

export default Donations
