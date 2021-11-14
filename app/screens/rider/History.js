import React, { Component } from 'react'
import { Text, View } from 'react-native'

export class History extends Component {
    componentDidMount() {
        this.props.navigation.getParent().setOptions({title: 'History'});

        let unsubscribe = this.props.navigation.addListener('tabPress', (e) => {
            // Prevent default action
            // e.preventDefault();
            this.props.navigation.getParent().setOptions({title: 'History'});
          });
    }

    render() {
        return (
            <View>
                <Text> History </Text>
            </View>

        )
    }
}

export default History
