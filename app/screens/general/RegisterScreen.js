import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'

import { TextInput, Button, Text } from 'react-native-paper'

export default class RegisterScreen extends Component {
    render() {
        return (
            <View 
                style={styles.container}
            >
                <Button
                    title="Register as Donor"
                    mode="outlined"
                    contentStyle={styles.portalButton}
                    onPress={() => {this.props.navigation.navigate("DonorRegistrationScreen")}}
                >Register as Donor</Button>
                <Button
                    title="Register as Fetcher"
                    mode="outlined"
                    contentStyle={styles.portalButton}
                    onPress={() => {this.props.navigation.navigate("RiderRegistrationScreen")}}
                >Register as Fetcher</Button>
                <Button
                    title="Register as CSO Administrator"
                    mode="outlined"
                    contentStyle={styles.portalButton}
                    onPress={() => {this.props.navigation.navigate("CSORegistrationScreen")}}
                >Register as CSO Administrator</Button>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        flexDirection: 'column',
        alignItems: 'stretch', 
        justifyContent: 'space-evenly',
        padding: 10
    },
    portalButton: {
        height: 80,
        flexDirection: 'column',
        alignItems: 'center' 
    }
})
