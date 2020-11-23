import React, { Component } from "react";

import { withFirebase } from "../Firebase";

class MessageBox extends Component {
  constructor(props) {
    super(props);

    this.state = { content: "" };
  }

  handleChange = (event) => {
    this.setState({ content: event.target.value });
  };

  handleSubmit = (event) => {
    const { chatId, firebase } = this.props;
    const newMessage = firebase.chatMessages(chatId).push();

    newMessage.set({
      content: this.state.content,
    });

    this.setState({ content: "" });
    event.preventDefault();
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}></form>
        <textarea value={this.state.content} onChange={this.handleChange} />
        <button onClick={this.handleSubmit}>Send</button>
      </div>
    );
  }
}

export default withFirebase(MessageBox);
