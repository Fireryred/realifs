import { Text, StyleSheet, View, ScrollView } from 'react-native'
import React, { Component } from 'react'

export default class PrivacyPolicy extends Component {
  render() {
    return (
      <ScrollView style={{padding: 10}}>
        <Text style={{fontWeight: "bold", fontSize: 40}}>Privacy Policy</Text>
        <Text style={{paddingBottom: 40}}>
        {`
REALIFS is committed to protect and respect your personal data privacy. We are at the forefront of not only implementing but complying with the Data Privacy Act of 2012. We will provide individuals a Personal Information Collection Statement in an appropriate format and manner whenever we collect personal data from them (i.e. in the manual form or web page that collects personal data, or in a notice posted at the reception area of REALIFS events where participants’ personal data is collected through attendance sheets).
REALIFS’ Privacy Notice For processing inquiries and requests

Personal Data Collected
We collect the following personal information from you when you manually or electronically submit to us your inquiries or requests:
Name
Contact information, preferably email
Valid IDs
Certificates

REALIFS uses Google Analytics Statistics, a third-party service to analyze the web traffic data for us. This service use cookies. Data generated is not shared with any other party. The following web traffic data are analyzed:
Your IP address
The pages and internal links accessed on our site
The date and time you visited the site
Geolocation
Your operating system
Web browser type

Use
The collected personal information is utilized solely for documentation and processing purposes within REALIFS and is not shared with any outside parties. They enable REALIFS to properly address the inquiries and requests, forward them to appropriate internal units for action and response, and provide clients with appropriate updates and advisories in a legitimate format and in an orderly and timely manner.

Protection Measures
Only authorized REALIFS personnel has access to these personal information, the exchange of which will be facilitated through email and hard copy. They will be stored in a database for two years (after inquiries, requests are acted upon) after which physical records shall be disposed of through shredding, while digital files shall be anonymized.

Access and Correction
You have the right to ask for a copy of any personal information we hold about you.`}
        </Text>
      </ScrollView>
    )
  }
}