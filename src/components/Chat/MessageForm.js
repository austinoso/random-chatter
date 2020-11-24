import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withFirebase } from "../Firebase";
import { FormControl, TextField, AppBar, Toolbar } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  appBar: {
    top: "auto",
    bottom: 0,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  form: {
    width: "100%",
  },
}));

const MessageForm = ({ chat, firebase }) => {
  const [content, setContent] = useState("");
  const classes = useStyles();

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = (event) => {
    const newMessage = firebase.chatMessages(chat.uid).push();

    newMessage.set({
      content,
    });

    setContent("");
    event.preventDefault();
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <form onSubmit={handleSubmit} className={classes.form}>
          <FormControl fullWidth variant="outlined">
            <TextField
              disabled={!chat.active}
              value={content}
              variant="outlined"
              onChange={handleChange}
              label="Send Message"
              size="small"
            />
          </FormControl>
        </form>
      </Toolbar>
    </AppBar>
  );
};

export default withFirebase(MessageForm);
