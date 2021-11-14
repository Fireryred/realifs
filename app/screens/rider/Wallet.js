import React, { Component } from 'react'
import { Text, View } from 'react-native'

export class Wallet extends Component {
    componentDidMount() {
        this.props.navigation.getParent().setOptions({title: 'Wallet'});

        let unsubscribe = this.props.navigation.addListener('tabPress', (e) => {
            // Prevent default action
            // e.preventDefault();
            this.props.navigation.getParent().setOptions({title: 'Wallet'});
          });
    }

    render() {
        return (
            <View>
                <Text> Wallet </Text>
            </View>

        )
    }
}

export default Wallet
