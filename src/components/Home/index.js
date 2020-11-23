import React, { Component } from "react";

import { withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import ChatRoom from "../Chat";
import ChatButton from "./chatButton";

const INITAL_STATE = {
  currentChat: false,
  unsub: "NO CONNECTED CHAT",
};

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITAL_STATE };
  }

  componentDidMount = () => {
    this.getUsersCurrentChat();
  };

  componentWillUnmount = () => {
    if (this.chatConnection) this.chatConnection();
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

  render() {
    return (
      <div>
        <h1>Home Page</h1>
        <p>The Home Page is accessible by every signed in user.</p>
        {!!this.state.currentChat.uid && (
          <ChatRoom chat={this.state.currentChat} />
        )}
        <ChatButton
          chat={this.state.currentChat}
          setCurrentChat={this.startListeningToChat}
          leaveChat={this.leaveChat}
        />
      </div>
    );
  }
}

const condition = (authUser) => !!authUser;

export default withFirebase(withAuthorization(condition)(HomePage));
