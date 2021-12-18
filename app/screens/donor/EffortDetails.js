import React, { Component } from 'react'
import { StyleSheet, View, StatusBar, SafeAreaView } from 'react-native'

import { Text, Button} from 'react-native-paper'

export default class EffortDetails extends Component {
    componentDidMount() {
        console.log('Got prop:', JSON.stringify(this.props.route.params.effortId, null, 2))
    }

    render() {
        let effortId = this.props.route.params.effortId;

        return (
            <View>
                <Text style={{ color: '#fff' }}>Effort Details</Text>
                <Button
                    onPress={() => {
                        this.props.navigation.navigate("RequestFetch", {effortId: effortId})
                    }}
                >Request Fetch</Button>
            </View>

        )
    }
}

const styles = StyleSheet.create({

})
