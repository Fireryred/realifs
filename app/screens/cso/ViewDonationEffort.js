import React, {Component} from 'react';
import {View, Text, Image, Button} from 'react-native';
import {TextInput} from 'react-native-paper';

import DateTimePicker from '@react-native-community/datetimepicker';
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
    };
  }
  componentDidMount() {
    const {data} = this.props.route.params;
    this.setState({title: data[1].title, description: data[1].description});
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
    const {title, description, start, end} = this.state;
    await firestore()
      .collection('donation_efforts')
      .doc(data[0])
      .update({
        title: title,
        description: description,
        startDateTime: start.date,
        endDateTime: end.date,
      })
      .then(() => {
        console.log('update donation effort');
        this.setState({editMode: false});
      });
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
    } = this.state;
    return (
      <>
        {!editMode ? (
          <View>
            <Image
              source={{uri: data[1].imageUrl}}
              style={{minWidth: 100, minHeight: 100}}
            />
            <Text style={{color: 'black'}}>{title}</Text>
            {!data[1].isDeleted && (
              <Button
                title="edit"
                onPress={() =>
                  this.setState({
                    editMode: true,
                    cstart: start,
                    cend: end,
                    ctitle: title,
                    cdescription: description,
                  })
                }>
                Edit
              </Button>
            )}
            <Text style={{color: 'black'}}>Descritpion:</Text>
            <Text style={{color: 'black'}}>{description}</Text>

            <Text style={{color: 'black'}}>Start Date:</Text>
            <Text style={{color: 'black'}}>
              {this.formatDateString(start.date)}
            </Text>
            <Text style={{color: 'black'}}>End Date:</Text>
            <Text style={{color: 'black'}}>
              {this.formatDateString(end.date)}
            </Text>

            <Text style={{color: 'black'}}>Availability:</Text>
            <Text style={{color: 'black'}}>{this.formatTime(start.date)}</Text>
            <Text style={{color: 'black'}}>To</Text>
            <Text style={{color: 'black'}}>{this.formatTime(end.date)}</Text>
          </View>
        ) : (
          <View>
            <Image
              source={{uri: data[1].imageUrl}}
              style={{minWidth: 100, minHeight: 100}}
            />
            <TextInput
              style={{color: 'black'}}
              value={title}
              onChangeText={text => this.setState({title: text})}
            />
            <Text style={{color: 'black'}}>Descritpion:</Text>
            <TextInput
              style={{color: 'black'}}
              value={description}
              onChangeText={text => this.setState({description: text})}
            />

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
            <Text style={{color: 'black'}}>Start Date:</Text>
            <Text style={{color: 'black'}}>
              {this.formatDateString(start.date)}
            </Text>
            <Text style={{color: 'black'}}>End Date:</Text>
            <Button
              title={this.formatDateString(end.date)}
              onPress={() => this.show('endDate')}
            />

            <Text style={{color: 'black'}}>Availability:</Text>
            <Button
              title={this.formatTime(start.date)}
              onPress={() => this.show('startTime')}
            />
            <Text style={{color: 'black'}}>To</Text>
            <Button
              title={this.formatTime(end.date)}
              onPress={() => this.show('endTime')}
            />
            <Button
              title="Cancel"
              onPress={() =>
                this.setState({
                  editMode: false,
                  start: cstart,
                  end: cend,
                  title: ctitle,
                  description: cdescription,
                })
              }
            />
            <Button title="Save" onPress={() => this.handleSave()} />
          </View>
        )}
      </>
    );
  }
}

export default ViewDonationEffort;
