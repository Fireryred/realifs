import { Text, StyleSheet, View } from 'react-native'
import React, { Component } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class Chat extends Component {
    constructor() {
        super();

        this.state = {
            messages: null,
            fetchRequestId: null,
        }
    }

    componentWillMount() {
        this.setState({
            ...this.setState,
            fetchRequestId: this.props.route.params.fetchRequestId,
        }, () => {console.log(this.state)})
    }

    componentDidMount() {
        this.getChats();
        this.setMessages([
        {
            _id: null,
            text: null,
            createdAt: null,
            user: {
                _id: null,
                name: null,
                avatar: null,
            },
        },
        ])
    }

    getChats = async () => {
        // let chats = await firestore().collection("chats").get();
        let fetcherId = this.props.route.params.fetcherId;
        
        const unsubscribe = firestore().collection('chats').where("fetchRequestId", "==", this.state.fetchRequestId).orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
            this.setMessages(
                snapshot?.docs?.map((doc, index) => ({
                    _id: doc.data()?._id,
                    createdAt: doc.data()?.createdAt.toDate(),
                    text: doc.data()?.text,
                    user: doc.data()?.user,
                }))
            );
        }, err => {
            console.log("error getting chats", err);
        })        
    }

    setMessages = (messages) => {
        this.setState({
            ...this.state,
            messages: messages,
        }, () => {
            console.log(this.state.messages);
        })

    }

    onSend = (messages = []) => {
        let previousMessages = this.state.messages;
        messages = GiftedChat.append(previousMessages, messages);
        this.setMessages(messages);
        firestore().collection('chats').add({
            _id: messages[0]._id,
            createdAt: messages[0].createdAt,
            text: messages[0].text,
            user: messages[0].user,
            fetchRequestId: this.state.fetchRequestId,
        })
    }

    render() {
        let {messages} = this.state;
         
        return (
            <View style={{flex:1}}>
                <GiftedChat
                isKeyboardInternallyHandled={false}
                    messages={messages}
                    showAvatarForEveryMessage={true}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: auth()?.currentUser?.uid,
                        name: auth()?.currentUser?.displayName,
                        avatar: auth()?.currentUser?.photoURL
                    }}
                    
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({})