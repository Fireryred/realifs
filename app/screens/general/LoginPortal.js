import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'

import { TextInput, Button, Text, DefaultTheme } from 'react-native-paper'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class LoginPortal extends Component {
    render() {
        return (
            <View 
                style={styles.container}
            >
                <Button
                    labelStyle={{fontSize: 30}}
                    icon="hand-heart"
                    title="Login as Donor"
                    mode="outlined"
                    contentStyle={styles.portalButton}
                    onPress={() => {this.props.navigation.navigate("DonorLoginScreen")}}
                >
                    <Text style={{fontSize: 16, fontWeight: "bold", color: DefaultTheme.colors.primary}}>Login as Donor</Text>
                </Button>
                <Button
                    labelStyle={{fontSize: 30}}
                    icon="truck-delivery"
                    title="Login as Fetcher"
                    mode="outlined"
                    contentStyle={styles.portalButton}
                    onPress={() => {this.props.navigation.navigate("RiderLoginScreen")}}
                >
                    <Text style={{fontSize: 16, fontWeight: "bold", color: DefaultTheme.colors.primary}}>Login as Fetcher</Text>
                </Button>
                <Button
                    labelStyle={{fontSize: 30}}
                    icon="account-group"
                    title="Login as CSO Administrator"
                    mode="outlined"
                    contentStyle={styles.portalButton}
                    onPress={() => {this.props.navigation.navigate("CSOLoginScreen")}}
                >
                    <Text style={{fontSize: 16, fontWeight: "bold", color: DefaultTheme.colors.primary}}>Login as CSO Administrator</Text>
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
        alignItems: 'center',
    }
})
