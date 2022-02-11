import React, {Component} from 'react';
import {Text, View} from 'react-native';

import WebView from 'react-native-webview';

import auth from '@react-native-firebase/auth';

export class FetcherWalletProcess extends Component {
  constructor() {
    super();

    this.state = {
      checkout_url: null,
    };
  }
  componentDidMount() {
    const {params} = this.props.route;
    const fetcherId = auth().currentUser.uid;
    const amount = parseInt(params.amount);

    let cost = amount ? parseInt(params.amount) * 100 : null;
    let balance = parseInt(params.balance) + amount;
    let status = 'success';

    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Basic cGtfdGVzdF9jRDVpb0wyZVJqTlJYWmlTa05SaDk5dzU6IA==',
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount: cost,
            redirect: {
              success:
                `https://us-central1-realifs-prototype.cloudfunctions.net/fetcherWalletSuccess?` +
                `fetcherId=${fetcherId}&` +
                `status=${status}&` +
                `action=${params.action}&` +
                `amount=${amount}&` +
                `balance=${balance}`,
              failed:
                'https://us-central1-realifs-prototype.cloudfunctions.net/fetchRequestPaymentFailed',
            },
            type: 'gcash',
            currency: 'PHP',
          },
        },
      }),
    };

    fetch('https://api.paymongo.com/v1/sources', options)
      .then(response => {
        if (!response) {
          console.log('res failed');
        }
        console.log('res', response);
        return response.json();
      })
      .then(response => {
        console.log(JSON.stringify(response, null, 2));
        if (!response.data.attributes) {
          throw new Error('source failed');
        }
        console.log('json', response.data.attributes.redirect.data);
        this.setState({
          ...this.state,
          checkout_url: response.data.attributes.redirect.checkout_url,
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    let {checkout_url} = this.state;

    return (
      <>
        {!checkout_url && <Text>Please wait...</Text>}
        {checkout_url && (
          <WebView
            source={{
              uri: checkout_url,
            }}
            style={{marginTop: 20}}
            onNavigationStateChange={e => {
              console.log(e);
            }}
          />
        )}
      </>
    );
  }
}

export default FetcherWalletProcess;
