import React, { Component } from 'react'
import { Text, View } from 'react-native'

export class Dashboard extends Component {
    componentDidMount() {
        this.props.navigation.getParent().setOptions({title: 'Dashboard'});

        let unsubscribe = this.props.navigation.addListener('tabPress', (e) => {
            // Prevent default action
            // e.preventDefault();
            this.props.navigation.getParent().setOptions({title: 'Dashboard'});
          });
    }

    render() {
        return (
            <View>
                <Text> Dashboard </Text>
            </View>
        )
    }
}

export default Dashboard
