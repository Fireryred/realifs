import React, {Component} from 'react';
import {View, Image, PermissionsAndroid, ScrollView, Dimensions} from 'react-native';
import { Caption, Text, Button, TextInput, } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';

import DateTimePicker from '@react-native-community/datetimepicker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

class ViewDonationEffort extends Component {
  constructor() {
    super();
    this.state = {
      end: {
        show: false,
        date: new Date(),
        type: 'date',
      },
      cend: {},
      start: {
        show: false,
        date: new Date(),
        type: 'date',
      },
      cstart: {},
      editMode: false,
      title: '',
      ctitle: '',
      description: '',
      cdescription: '',
      cimageWebUrl: '',
      imageWebUrl: '',
      imageName: 'CHOOSE IMAGE',
      dimensions: {
        window: Dimensions.get("window"),
        screen: Dimensions.get("screen"),
    },
    };
  }
  componentDidMount() {
    const {data} = this.props.route.params;
    console.log(data[1].imageUrl);
    this.setState({
      title: data[1].title,
      description: data[1].description,
      imageWebUrl: data[1].imageUrl,
    });
    this.formatDate();
  }

  formatDate() {
    const {startDateTime, endDateTime} = this.props.route.params.data[1];

    const startDate = new firestore.Timestamp(
      startDateTime.seconds,
      startDateTime.nanoseconds,
    ).toDate();
    const endDate = new firestore.Timestamp(
      endDateTime.seconds,
      endDateTime.nanoseconds,
    ).toDate();

    const {start, end} = this.state;
    let editStart = {...start};
    let editEnd = {...end};

    editStart.date = startDate;
    editEnd.date = endDate;

    this.setState({start: {...editStart}, end: {...editEnd}});
  }

  formatTime = date => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  };

  formatDateString = date => {
    const month = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const cdate = `${
      month[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
    return cdate;
  };

  show = type => {
    const {start, end} = this.state;
    let date = {};

    switch (type) {
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

  async handleSave() {
    const {data} = this.props.route.params;
    const {title, description, start, end, imageWebUrl} = this.state;
    await firestore()
      .collection('donation_efforts')
      .doc(data[0])
      .update({
        title: title,
        description: description,
        startDateTime: start.date,
        endDateTime: end.date,
        imageUrl: imageWebUrl,
      })
      .then(() => {
        console.log('update donation effort');
        this.setState({editMode: false});
      });
  }

  async pickFile() {
    await this.requestPermissionStorage().catch(error => console.error(error));

    let file = await DocumentPicker.pick({
      allowMultiSelection: true,
      type: [DocumentPicker.types.images],
      copyTo: 'documentDirectory',
    });
    let url = [];
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
          url.length != 0 ? `${file.length} Files Selected` : 'CHOOSE IMAGE'
        }`,
        imageWebUrl: url,
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

  render() {
    const {data} = this.props.route.params;
    const {
      start,
      cstart,
      end,
      cend,
      editMode,
      title,
      ctitle,
      description,
      cdescription,
      imageWebUrl,
      cimageWebUrl,
      imageName,
    } = this.state;
    return (
      <ScrollView style={{padding: 10}}>
        {!editMode ? (
          <View>
            <View style={{display: "flex", alignItems: "flex-end"}}>
              {!data[1].isDeleted && (
                <Button
                mode="outlined"
                  title="edit"
                  onPress={() =>
                    this.setState({
                      editMode: true,
                      cstart: start,
                      cend: end,
                      ctitle: title,
                      cdescription: description,
                      cimageWebUrl: imageWebUrl,
                    })
                  }>
                  Edit
                </Button>
              )}
            </View>
            <Caption>Title</Caption>
            <Text style={{color: 'black'}}>{title}</Text>
            
            <Caption>Description</Caption>
            <Text style={{color: 'black'}}>{description}</Text>

            <Caption>Start Date</Caption>
            <Text style={{color: 'black'}}>
              {this.formatDateString(start.date)}
            </Text>
            <Caption>End Date</Caption>
            <Text style={{color: 'black'}}>
              {this.formatDateString(end.date)}
            </Text>

            <Caption>Availability</Caption>
            <Text style={{color: 'black'}}>{`${this.formatTime(start.date)} - ${this.formatTime(end.date)}`}</Text>

            <Caption>Media</Caption>
            {imageWebUrl.map &&
              imageWebUrl.map((value, index) => {
                return (
                  <Image
                    key={index}
                    source={{uri: value}}
                    resizeMode="cover" 
                    style={{ marginBottom: 15, height: this.state.dimensions?.window?.width / 2, width: null, backgroundColor: "rgba(0,0,0,.1)" }}
                  />
                );
              })}
          </View>
        ) : (
          <View>
            
            <Caption>Title</Caption>
            <TextInput
              style={{color: 'black'}}
              value={title}
              onChangeText={text => this.setState({title: text})}
            />
            <Caption>Description</Caption>
            <TextInput
              multiline={true}
              numberOfLines={6}
              style={{color: 'black'}}
              value={description}
              onChangeText={text => this.setState({description: text})}
            />

            <Caption>Start Date</Caption>
            <Text style={{color: 'black'}}>
              {this.formatDateString(start.date)}
            </Text>
            <Caption>End Date</Caption>
            <Text style={{color: 'black'}}>End Date:</Text>
            <View style={{display: "flex", flexDirection: "row"}}>
              <Button
                mode="outlined"
                title={this.formatDateString(end.date)}
                onPress={() => this.show('endDate')}
              >{this.formatDateString(end.date)}</Button>
            </View>

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
            <Caption>Availabilty</Caption>
            <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
              <Button
                mode="contained"
                title={this.formatTime(start.date)}
                onPress={() => this.show('startTime')}
              >{this.formatTime(start.date)}</Button>
              <Text style={{color: 'black'}}> to </Text>
              <Button
                mode="contained"
                title={this.formatTime(end.date)}
                onPress={() => this.show('endTime')}
              >{this.formatTime(end.date)}</Button>
            </View>
            <Caption>Media</Caption>
            <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start"}}>
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
                }}>{imageName}</Button>
              </View>

            <View style={{display: "flex", flexDirection: "row", marginTop: 25, justifyContent: "space-evenly"}}>
            <Button
              mode="contained"
              title="Cancel"
              color="gray"
              dark={true}
              onPress={() =>
                this.setState({
                  editMode: false,
                  start: cstart,
                  end: cend,
                  title: ctitle,
                  description: cdescription,
                  imageWebUrl: cimageWebUrl,
                })
              }
            >Cancel</Button>
            <Button mode="contained" title="Save" color="green" onPress={() => this.handleSave()}>SAVE</Button>
            </View>
          </View>
        )}
      </ScrollView>
    );
  }
}

export default ViewDonationEffort;
