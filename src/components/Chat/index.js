import React, { Component } from "react";

import { withFirebase } from "../Firebase";

const INITIAL_STATE = {
  chatId: "",
  messages: [],
};

class ChatRoomBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    const { firebase } = this.props;

    firebase.user(firebase.auth.currentUser.uid).once("value", (user) => {
      this.setState({ chatId: user.val().currentChatId });
    });
  }

  onStartClicked = () => {
    const { firebase } = this.props;

    firebase.firstChat().once("value", (snapshot) => {
      const chatObject = snapshot.val();
      if (chatObject) {
        const chat = chatObject[Object.keys(chatObject)[0]];
        console.log("test1");
        if (!chat.joiningUser) {
          console.log("test2");
          this.addCurrentUserToChat(Object.keys(chatObject)[0]);
        } else {
          console.log("test3");
          this.makeChat();
        }
      } else {
        this.makeChat();
      }
    });
  };

  render() {
    return (
      <div>
        <h1>This is a chat</h1>
        <StartEndChatButton
          onStartClicked={this.onStartClicked}
          chatId={this.state.chatId}
        />
      </div>
    );
  }

  /* ### HELPER METHODS ### */

  makeChat = () => {
    const { firebase } = this.props;
    const newChat = firebase.chats().push();
    const userId = firebase.auth.currentUser.uid;

    newChat
      .set({
        startingUser: {
          userId,
        },
      })
      .then(() => {
        const chatId = newChat.getKey();
        firebase.user(userId).update({
          currentChatId: chatId,
        });

        this.setState({ chatId });
      });
  };

  addCurrentUserToChat = (chat) => {
    const { firebase } = this.props;
    const userId = firebase.auth.currentUser.uid;

    firebase.chat(chat).update({
      joiningUser: {
        userId,
      },
    });

    firebase.user(userId).update({
      currentChatId: chat,
    });
  };
}

const StartEndChatButton = (props) => {
  return !props.chatId ? (
    <button onClick={props.onStartClicked}>Start Chat</button>
  ) : (
    <button onClick={props.onStartClicked}>End Chat</button>
  );
};

export default withFirebase(ChatRoomBase);
