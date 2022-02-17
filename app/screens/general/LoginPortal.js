import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'

import { TextInput, Button, Text } from 'react-native-paper'

export default class LoginPortal extends Component {
    render() {
        return (
            <View 
                style={styles.container}
            >
                <Button
                    title="Login as Donor"
                    mode="outlined"
                    contentStyle={styles.portalButton}
                    onPress={() => {this.props.navigation.navigate("DonorLoginScreen")}}
                >Login as Donor</Button>
                <Button
                    title="Login as Fetcher"
                    mode="outlined"
                    contentStyle={styles.portalButton}
                    onPress={() => {this.props.navigation.navigate("RiderLoginScreen")}}
                >Login as Fetcher</Button>
                <Button
                    title="Login as CSO Administrator"
                    mode="outlined"
                    contentStyle={styles.portalButton}
                    onPress={() => {this.props.navigation.navigate("CSOLoginScreen")}}
                >Login as CSO Administrator</Button>
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
