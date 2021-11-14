import React, { Component } from 'react'
import { Text, View } from 'react-native'

export class Efforts extends Component {
    componentDidMount() {
        this.props.navigation.getParent().setOptions({title: 'Efforts'});

        let unsubscribe = this.props.navigation.addListener('tabPress', (e) => {
            // Prevent default action
            // e.preventDefault();
            this.props.navigation.getParent().setOptions({title: 'Efforts'});
          });
    }

    render() {
        return (
            <View>
                <Text> Efforts </Text>
            </View>

        )
    }
}

export default Efforts
