import React, { Component } from "react";

import { withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import ChatButton from "./chatButton";
import Messages from "./Messages";
import MessageForm from "./MessageForm";
import { AppBar } from "@material-ui/core";

const INITAL_STATE = {
  currentChat: false,
  unsub: "NO CONNECTED CHAT",
};

class ChatPage extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITAL_STATE };
  }

  componentDidMount = () => {
    this.getUsersCurrentChat();
  };

  componentWillUnmount = () => {
    if (this.chatConnection) this.state.unsub();
  };

  getUsersCurrentChat = async () => {
    const { firebase } = this.props;
    firebase
      .user(firebase.auth.currentUser.uid)
      .get()
      .then((doc) => {
        const { currentChatId } = doc.data();
        if (currentChatId) this.startListeningToChat(currentChatId);
      });
  };

  startListeningToChat = (chatId) => {
    const { firebase } = this.props;
    if (this.chatConnection) this.leaveChat();

    const unsub = firebase.chat(chatId).onSnapshot((doc) => {
      const chat = doc.data();
      this.setState({ currentChat: { uid: chatId, ...chat } });
    });

    this.setState({ unsub });
  };

  leaveChat = () => {
    this.state.unsub();

    this.setState(INITAL_STATE);
  };

  render = () => {
    const { currentChat } = this.state;

    return (
      <>
        <AppBar position="fixed">
          <ChatButton
            chat={currentChat}
            setCurrentChat={this.startListeningToChat}
            leaveChat={this.leaveChat}
          />
        </AppBar>
        {currentChat.active && (
          <Messages chat={currentChat} leaveChat={this.leaveChat} />
        )}
        <MessageForm chat={currentChat} />
      </>
    );
  };
}

const condition = (authUser) => !!authUser;

export default withFirebase(withAuthorization(condition)(ChatPage));
