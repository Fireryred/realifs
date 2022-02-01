import React, { Component } from 'react'
import { Text, View } from 'react-native'
import WebView from 'react-native-webview'

export class PayFetchRequest extends Component {
    constructor() {
        super();

        this.state = {
            checkout_url: null
        }
    }
    componentDidMount() {
        let cost = this.props.route.params.cost || null;
        cost = cost ? parseInt(cost) * 100 : null;

        let fetchRequestID = this.props.route.params.fetchRequestID
        console.log("fetchRequestID", fetchRequestID)

        console.log("Cents: ", cost, "Peso", cost / 100)

        if(cost) {
            const options = {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: 'Basic cGtfdGVzdF9jRDVpb0wyZVJqTlJYWmlTa05SaDk5dzU6IA=='
                },
                body: JSON.stringify({
                  data: {
                    attributes: {
                      amount: cost,
                      redirect: {success: `https://us-central1-realifs-prototype.cloudfunctions.net/fetchRequestPaymentSuccess?fetchRequestID=${fetchRequestID}`, failed: 'https://us-central1-realifs-prototype.cloudfunctions.net/fetchRequestPaymentFailed'},
                      type: 'gcash',
                      currency: 'PHP'
                    }
                  }
                })
              };
              
              fetch('https://api.paymongo.com/v1/sources', options)
                .then(response => {
                    if(!response) {
                        console.log("res failed")
                    }
                    console.log("res", response);    
                    return response.json()  
                })
                .then(response => {
                    console.log(JSON.stringify(response, null, 2))
                    if(!response.data.attributes) {
                        throw new Error("source failed")
                    }
                    console.log("json", response.data.attributes.redirect.data);    
                    this.setState({ 
                        ...this.state,
                        checkout_url: response.data.attributes.redirect.checkout_url
                    })
                })
                .catch(err => console.error(err));
        }
        
    }
    render() {
        let { checkout_url } = this.state; 

        return (
            <>
            { !checkout_url &&
                <Text>Please wait...</Text>
            }
            { checkout_url && 
            <WebView
                source={{
                    uri: checkout_url
                }}
                style={{ marginTop: 20 }}
                onNavigationStateChange={(e) => {
                    console.log(e)
                }}
            />
            }
            </>
        )
    }
}

export default PayFetchRequest
