import React, { Component } from "react";

import { withFirebase } from "../Firebase";
import MessageBox from "./Messagebox";

class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] };
  }

  componentDidMount = () => {
    const { firebase, chat } = this.props;
    console.log(chat.uid);

    firebase.chatMessages(chat.uid).on("child_added", (data) => {
      const messageObject = { content: data.val().content, uid: data.key };
      this.setState({ messages: this.state.messages.concat(messageObject) });
    });
  };

  componentWillUnmount = () => {
    const { firebase, chat } = this.props;

    firebase.chatMessages(chat.uid).off();
  };

  getMessages = () => {
    const messages = [];
    this.state.messages.forEach((message) => {
      messages.push(<li key={message.uid}>{message.content}</li>);
    });

    return messages;
  };

  render = () => {
    return (
      <div>
        <h1>This is a chat, currently {this.state.status} </h1>
        <ul>{this.getMessages()}</ul>
        {this.props.chat.active && <MessageBox chatId={this.props.chat.uid} />}
      </div>
    );
  };
}

export default withFirebase(ChatRoom);
