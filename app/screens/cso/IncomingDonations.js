import React, { Component } from 'react'
import { Text, View } from 'react-native'

export class IncomingDonations extends Component {
    componentDidMount() {
        this.props.navigation.getParent().setOptions({title: 'Incoming Donations'});

        let unsubscribe = this.props.navigation.addListener('tabPress', (e) => {
            // Prevent default action
            // e.preventDefault();
            this.props.navigation.getParent().setOptions({title: 'Incoming Donations'});
          });
    }

    render() {
        return (
            <View>
                <Text> Incoming Donations </Text>
            </View>
        )
    }
}

export default IncomingDonations
