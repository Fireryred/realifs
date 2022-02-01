import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  Button,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {Subheading, Surface, TextInput} from 'react-native-paper';

import MapView from 'react-native-maps';
import DocumentPicker from 'react-native-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export class CreateDonationEffort extends Component {
  constructor() {
    super();
    this.state = {
      imageName: 'CHOOSE FILE',
      imageWebURL:
        'https://firebasestorage.googleapis.com/v0/b/realifs-prototype.appspot.com/o/DonationEffort%2F3a62433d1fc9f871jpg?alt=media&token=8adca4a3-c214-4942-b59c-1e027e8b0cc3',
      title: 'Test',
      description: 'Desc',
      address: 'Address',
      end: {
        show: false,
        date: new Date(),
        type: 'date',
      },
      start: {
        show: false,
        date: new Date(),
        type: 'date',
      },
      loc: {
        latitude: 14.581647,
        longitude: 121.086127,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
    };
  }

  handleStart = (event, selectedDate) => {
    const {start} = this.state;
    const date = {...start};
    date.show = false;
    date.date = selectedDate || date.date;
    this.setState({start: {...date}});
    console.log(start);
  };

  handleEnd = (event, selectedDate) => {
    const {end} = this.state;
    const date = {...end};
    date.show = false;
    date.date = selectedDate || date.date;
    this.setState({end: {...date}});
    console.log(end);
  };

  show = type => {
    const {start, end} = this.state;
    let date = {};

    switch (type) {
      case 'startDate':
        console.log(start);
        date = {...start};
        date.show = true;
        this.setState({start: {...date}});
        console.log(start);
        break;

      case 'startTime':
        date = {...start};
        date.type = 'time';
        date.show = true;
        this.setState({start: {...date}});
        break;

      case 'endDate':
        date = {...end};
        date.show = true;
        this.setState({end: {...date}});
        console.log(end);
        break;

      case 'endTime':
        date = {...end};
        date.type = 'time';
        date.show = true;
        this.setState({end: {...date}});
        break;
    }
  };

  async pickFile() {
    let granted = await this.requestPermissionStorage().catch(error =>
      console.error(error),
    );

    let file = await DocumentPicker.pick({
      type: [DocumentPicker.types.images],
      copyTo: 'documentDirectory',
    });

    let pathToFile = `${file[0].fileCopyUri}`;
    let filenameSplitLength = file[0].name.split('.').length ?? 0;
    let filetype = file[0].name.split('.')[filenameSplitLength - 1] ?? '';
    let uploadFilename = this.generateRandomHex() + filetype;
    let firebaseStorageRef = storage().ref(`DonationEffort/${uploadFilename}`);

    // Upload to Firebase Storage
    let result = await firebaseStorageRef
      .putFile(pathToFile, {
        cacheControl: 'no-store',
      })
      .catch(error => {
        console.log(error);
      });

    const url = await storage()
      .ref(`DonationEffort/${uploadFilename}`)
      .getDownloadURL();
    const imageUrl = url.valueOf();
    this.setState({imageName: file[0].name, imageWebURL: {imageUrl}});
    console.log(url.valueOf());
  }

  async requestPermissionStorage() {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Permission Granted');
      return true;
    } else {
      console.log('Permission Denied');
      return false;
    }
  }

  generateRandomHex(length = 16) {
    return [...Array(length)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join('');
  }

  onRegionChange = region => {
    this.setState({loc: {...region}});
    console.log(this.state.loc);
  };

  render() {
    const {
      start,
      end,
      title,
      description,
      address,
      imageName,
      imageWebURL,
      loc,
    } = this.state;
    return (
      <ScrollView>
        <View>
          <View>
            <Subheading>TITLE</Subheading>
            <TextInput
              placeholder="Title"
              value={title}
              onChange={text =>
                this.setState({title: text.nativeEvent.text})
              }></TextInput>
          </View>
          <View>
            {start.show && (
              <DateTimePicker
                value={start.date}
                mode={start.type}
                onChange={this.handleStart}
              />
            )}
            {end.show && (
              <DateTimePicker
                value={end.date}
                mode={end.type}
                onChange={this.handleEnd}
              />
            )}
            <Subheading>START DATE</Subheading>
            <Button
              title={start.date.toDateString()}
              onPress={() => this.show('startDate')}
            />
          </View>
        </View>
        <View>
          <View>
            <Subheading>DESCRIPTION</Subheading>
            <TextInput
              placeholder="Write Description..."
              multiline={true}
              value={description}
              onChange={text =>
                this.setState({description: text.nativeEvent.text})
              }
            />
          </View>
          <View>
            <Subheading>END DATE</Subheading>
            <Button
              title={end.date.toDateString()}
              onPress={() => this.show('endDate')}
            />
          </View>
        </View>
        <View>
          <View>
            <Subheading>FULL ADDRESS</Subheading>
            <TextInput
              placeholder="House number, Street, Village, City, Region"
              value={address}
              onChange={text =>
                this.setState({address: text.nativeEvent.text})
              }></TextInput>
          </View>
          <View>
            <Subheading>AVAILABILITY</Subheading>
            <Button
              title={start.date.toLocaleTimeString()}
              onPress={() => this.show('startTime')}
            />
          </View>
        </View>
        <View>
          <View>
            <Subheading>ADDPHOTO</Subheading>
            <Surface>
              <Button
                mode="outlined"
                title={imageName}
                onPress={() => {
                  this.pickFile().catch(error => {
                    if (DocumentPicker.isCancel(error)) {
                    } else {
                      console.log('Error with file upload: ', error);
                    }
                  });
                }}
              />
            </Surface>
          </View>
        </View>
        <View>
          <Text>-TO-</Text>
          <Button
            title={end.date.toLocaleTimeString()}
            onPress={() => this.show('endTime')}
          />
        </View>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={loc}
            onRegionChangeComplete={this.onRegionChange}></MapView>
          <View style={styles.pointerContainer}>
            <Image
              style={styles.pointer}
              resizeMode="contain"
              source={{
                uri: 'https://firebasestorage.googleapis.com/v0/b/realifs-prototype.appspot.com/o/assets%2Flocator-fit.png?alt=media&token=1cf279c2-81a0-44c7-9220-132271f3bf87',
              }}
            />
          </View>
        </View>
        <Button
          title="Create Donation Effort"
          onPress={() => {
            let collectionRef = firestore()
              .collection('donation_efforts')
              .add({
                creationDate: firestore.Timestamp.now(),
                title: title,
                description: description,
                address: address,
                startDateTime: firestore.Timestamp.fromDate(start.date),
                endDateTime: firestore.Timestamp.fromDate(end.date),
                imageUrl: imageWebURL,
                location: new firestore.GeoPoint(loc.latitude, loc.longitude),
                csoID: auth().currentUser.uid
              })
              .then(() => {
                Alert.alert(
                  'Donation effort created',
                  "You can check your donation effort's status in the dashboard",
                  undefined,
                  {cancelable: true},
                );
              })
              .catch((err) => {
                Alert.alert(
                  'There was an error processing your request',
                  "Please try again",
                  undefined,
                  {cancelable: true},
                );
                console.log("error creating donation effort", err)
              })
              .finally(() => {
                this.props.navigation.replace("CSODrawer");
              });
          }}
        />
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  map: {
    height: 200,
  },
  mapContainer: {
    display: 'flex',
  },
  pointerContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  pointer: {
    width: '40%',
    height: '40%',
  },
});
