import React, { Component } from "react";

import { withFirebase } from "../Firebase";

class ChatButton extends Component {
  onStartClicked = async () => {
    const { firebase } = this.props;
    const inactiveChats = await firebase.getInactiveChats();

    if (inactiveChats.empty) {
      this.createNewChat();
    } else {
      inactiveChats.forEach((doc) => this.addCurrentUserToChat(doc.id));
    }
  };

  onEndClicked = () => {
    const { firebase, chat, leaveChat } = this.props;

    firebase
      .user(chat.startingUser.uid)
      .update({
        currentChatId: null,
      })
      .then(() => {
        if (!!chat.joiningUser)
          firebase.user(chat.joiningUser.uid).update({
            currentChatId: null,
          });
        firebase
          .chat(chat.uid)
          .delete()
          .then(() => {
            leaveChat();
          });
      });
  };

  createNewChat = () => {
    const { firebase, setCurrentChat } = this.props;
    const userId = firebase.auth.currentUser.uid;

    firebase
      .addChat({
        startingUser: {
          uid: userId,
        },
        active: false,
      })
      .then((chat) => {
        firebase.user(userId).update({
          currentChatId: chat.id,
        });

        setCurrentChat(chat.id);
      });
  };

  addCurrentUserToChat = (chatId) => {
    const { firebase, setCurrentChat } = this.props;
    const userId = firebase.auth.currentUser.uid;

    firebase.chat(chatId).update({
      joiningUser: {
        uid: userId,
      },
      active: true,
    });

    firebase.user(userId).update({
      currentChatId: chatId,
    });

    setCurrentChat(chatId);
  };

  render = () => {
    const { chat } = this.props;

    return !chat ? (
      <button onClick={this.onStartClicked}>Start Chat</button>
    ) : (
      <button onClick={this.onEndClicked}>End Chat</button>
    );
  };
}

export default withFirebase(ChatButton);
