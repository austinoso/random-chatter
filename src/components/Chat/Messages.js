import { withStyles, Typography } from "@material-ui/core";
import React, { Component } from "react";

import { withFirebase } from "../Firebase";

const styles = (theme) => ({
  root: {
    margin: 15,
    marginTop: 50,
    marginBottom: 90,
  },
});

class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] };
  }

  componentDidMount = () => {
    this.subToChatmessages();
  };

  componentWillUnmount = () => {
    this.unsubToChatMessages();
    this.props.leaveChat();
  };

  subToChatmessages = () => {
    const { firebase, chat } = this.props;

    firebase.chatMessages(chat.uid).on("child_added", (data) => {
      const messageObject = { content: data.val().content, uid: data.key };
      console.log(messageObject);
      this.setState({ messages: this.state.messages.concat(messageObject) });
    });
  };

  unsubToChatMessages = () => {
    const { firebase, chat } = this.props;

    firebase.chatMessages(chat.uid).off();
  };

  render = () => {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Typography>This Chat is now live... say Hello!</Typography>
        {this.state.messages.length > 0 &&
          this.state.messages.map((message) => (
            <div key={message.uid}>{message.content}</div>
          ))}
      </div>
    );
  };
}

export default withStyles(styles)(withFirebase(Messages));
