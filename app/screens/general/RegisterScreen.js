import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'

import { TextInput, Button, Text, DefaultTheme } from 'react-native-paper'

export default class RegisterScreen extends Component {
    render() {
        return (
            <View 
                style={styles.container}
            >
                <Button
                    labelStyle={{fontSize: 30}}
                    icon="hand-heart"
                    title="Register as Donor"
                    mode="outlined"
                    contentStyle={styles.portalButton}
                    onPress={() => {this.props.navigation.navigate("DonorRegistrationScreen")}}
                >
                    <Text style={{fontSize: 16, fontWeight: "bold", color: DefaultTheme.colors.primary}}>Register as Donor</Text>
                </Button>
                <Button
                    labelStyle={{fontSize: 30}}
                    icon="truck-delivery"
                    title="Register as Fetcher"
                    mode="outlined"
                    contentStyle={styles.portalButton}
                    onPress={() => {this.props.navigation.navigate("RiderRegistrationScreen")}}
                >
                    <Text style={{fontSize: 16, fontWeight: "bold", color: DefaultTheme.colors.primary}}>Register as Fetcher</Text>
                </Button>
                <Button
                    labelStyle={{fontSize: 30}}
                    icon="account-group"
                    title="Register as CSO Administrator"
                    mode="outlined"
                    contentStyle={styles.portalButton}
                    onPress={() => {this.props.navigation.navigate("CSORegistrationScreen")}}
                >
                    <Text style={{fontSize: 16, fontWeight: "bold", color: DefaultTheme.colors.primary}}>Register as CSO Administrator</Text>
                </Button>
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
        justifyContent: "center",
        alignItems: 'center' 
    }
})
