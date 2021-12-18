import React, { Component } from 'react'
import { View } from 'react-native'

import firestore from '@react-native-firebase/firestore';

import { TextInput, Button, Text, Surface, Card, Title, ActivityIndicator, Colors } from 'react-native-paper'
export class Efforts extends Component {
    constructor() {
        super();

        this.state = {
            efforts: {}
        }
    }

    componentDidMount() {
        this.getEfforts()
          .catch(error => {
              console.log(error)
          })
    }

    async getEfforts() {
        let efforts = {}

        console.log('Getting donation efforts: ');
        let loadedEfforts = await firestore().collection('donation_efforts').get();

        loadedEfforts.forEach( doc => {
            efforts[doc.id] = doc.data()
            // console.log(doc.id)
        })

        this.setState({
            efforts: {...efforts}
        })
    }

    render() {
        let { efforts } = this.state;

        return (
            <View>
                { !this.state.efforts && <ActivityIndicator animating={true} color={Colors.red800} /> }
                {
                    Object.entries(efforts).map( (item, key) => {
                        return (
                            <EffortItem
                                key={key}
                                effortData={item}
                                parentProps={this.props}
                            ></EffortItem>
                        )
                    } )
                }
            </View>

        )
    }
}

class EffortItem extends Component {
    componentDidMount() {

    }

    render() {
        let effortId = this.props.effortData[0];
        let effortData = this.props.effortData[1];
        return (
            <Surface>
                <Card>
                    <Card.Title title={effortData.title || 'cannot get'}></Card.Title>
                    <Card.Content>
                        <Text>{effortData.description}</Text>
                        <Button
                            mode={'contained'}
                            onPress={() => {
                                this.props.parentProps.navigation.navigate("EffortDetails", {effortId: effortId})
                            }}

                        >VIEW</Button>
                    </Card.Content>
                </Card>
            </Surface>
        )
    }
}

class RequestFetch extends Component {

}

export default Efforts
