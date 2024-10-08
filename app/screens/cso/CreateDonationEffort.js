import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {Subheading, Surface, TextInput, Button, Title, Text} from 'react-native-paper';

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
      imageWebURL: '',
      title: '',
      description: '',
      address: '',
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
      geocodeAddress: null,
      city: '',
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
        date.type = 'date';
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
        date.type = 'date';
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
    await this.requestPermissionStorage().catch(error => console.error(error));

    let file = await DocumentPicker.pick({
      allowMultiSelection: true,
      type: [DocumentPicker.types.images],
      copyTo: 'documentDirectory',
    });
    let url = [];

    for(let image of file) {
      if(image.size > 5242880) {
        Alert.alert(undefined, "Invalid file size, please select images up to 5mb in file size.");
        return;
      }
    }

    file.forEach(async images => {
      let pathToFile = `${images.fileCopyUri}`;
      let filenameSplitLength = images.name.split('.').length ?? 0;
      let filetype = images.name.split('.')[filenameSplitLength - 1] ?? '';
      let uploadFilename = this.generateRandomHex() + filetype;
      let firebaseStorageRef = storage().ref(
        `DonationEffort/${uploadFilename}`,
      );
      // Upload to Firebase Storage
      await firebaseStorageRef
        .putFile(pathToFile, {
          cacheControl: 'no-store',
        })
        .catch(error => {
          console.log(error);
        });

      url.push(
        await storage()
          .ref(`DonationEffort/${uploadFilename}`)
          .getDownloadURL(),
      );
      this.setState({
        imageName: `${
          url.length != 0 ? `${file.length} Files Selected` : 'CHOOSE FILE'
        }`,
        imageWebURL: url,
      });
    });
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
    this.getAddressWithLatlng(region.latitude, region.longitude);
  };

  getAddressWithLatlng(lat, lng) {
    let uri = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDAdKi6it1aJYQ9GUVDIPQAG4s6P_UyCjw`;

    fetch(uri).then(res => {
      res.json().then(json => {
        console.log(`${uri}\nResult: `, Object.entries(json).length);

        for (let item of json.results) {
          this.setState({
            ...this.state,
            geocodeAddress: item['formatted_address'],
          });

          for (let comp of item['address_components']) {
            if (comp.types.includes('locality')) {
              this.setState({
                ...this.state,
                city: comp.long_name,
              });
            }
          }

          break;
        }
      });
    });
  }

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
      geocodeAddress,
      city,
    } = this.state;
    return (
      <ScrollView style={{padding: 10}}>
        <View>
          <View>
            <Text style={{fontWeight: "bold", marginTop: 15,}}>Title</Text>
            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={text => this.setState({title: text})}></TextInput>
          </View>
        </View>
        <View>
          <View>
          <Text style={{fontWeight: "bold", marginTop: 15,}}>Description</Text>
            <TextInput
              placeholder="Write Description..."
              multiline={true}
              value={description}
              onChangeText={text => this.setState({description: text})}
            />
          </View>
        </View>
        <View>
          <View>
          <Text style={{fontWeight: "bold", marginTop: 15,}}>Full Address</Text>
            <TextInput
              placeholder="House number, Street, Village, City, Region"
              value={address}
              onChangeText={text => this.setState({address: text})}></TextInput>
          </View>
          <View>
            
          </View>
        </View>
        <View
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              flexDirection: "row",
              marginTop: 15,
            }}
          >
            <View
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
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
              <Text>Start Date</Text>
              <Button
                mode="outlined"
                title={start.date.toDateString()}
                onPress={() => this.show('startDate')}
              >{start.date.toDateString()}</Button>
              <Text style={{marginTop: 15,}}>End Date</Text>
              <Button
                mode="outlined"
                title={end.date.toDateString()}
                onPress={() => this.show('endDate')}
              >{end.date.toDateString()}</Button>
            </View>
            <View
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text>Availability</Text>
              <Button
                mode="outlined"
                onPress={() => this.show('startTime')}
              >{(((start.date.getHours() + 11) % 12 + 1) + `:${(start.date.getMinutes() < 10 ? '0':'') + start.date.getMinutes()} ` + (start.date.getHours() <= 11 ? "AM" : "PM"))}</Button>
              <Text>-TO-</Text>
              <Button
                mode="outlined"
                onPress={() => this.show('endTime')}
              >{(((end.date.getHours() + 11) % 12 + 1) + `:${(start.date.getMinutes() < 10 ? '0':'') + start.date.getMinutes()} ` + (end.date.getHours() <= 11 ? "AM" : "PM"))}</Button>
            </View>
          </View>
        <View>
          <View>
          <Text style={{fontWeight: "bold", marginTop: 15}}>Add Images</Text>
          <Text style={{fontStyle: "italic", color: "gray", }}>Please select .jpeg .jpg .png images up to 5mb in file size.</Text>
            <Surface>
              <Button
                mode="outlined"
                compact={true}
                onPress={() => {
                  this.pickFile().catch(error => {
                    if (DocumentPicker.isCancel(error)) {
                    } else {
                      console.log('Error with file upload: ', error);
                    }
                  });
                }}
              >{imageName}</Button>
            </Surface>
          </View>
        </View>
        <View>
          
        </View>

        <Text style={{fontWeight: "bold", marginTop: 15}}>Pick Location</Text>
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
        <Text>Selected Location: {geocodeAddress}</Text>
        <Button
          mode="contained"
          style={{marginVertical: 25}}
          title="Create Donation Effort"
          onPress={() => {
            if(!title || title == "" || !description || description == "" || !address || address == "") {
              Alert.alert(undefined, "Please fill up the necessary fields.");
              return;
            }
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
                csoID: auth().currentUser.uid,
                geocodeAddress: geocodeAddress,
                city: city,
                isDeleted: false,
              })
              .then(() => {
                Alert.alert(
                  'Donation effort created',
                  "You can check your donation effort's status in the dashboard",
                  undefined,
                  {cancelable: true},
                );
              })
              .catch(err => {
                Alert.alert(
                  'There was an error processing your request',
                  'Please try again',
                  undefined,
                  {cancelable: true},
                );
                console.log('error creating donation effort', err);
              })
              .finally(() => {
                this.props.navigation.replace('CSODrawer');
              });
          }}
        >Create</Button>
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
