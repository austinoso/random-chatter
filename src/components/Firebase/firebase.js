import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_STORAGE_BUCKET,
  appId: process.env.REACT_APP_ADDID,
  measurementId: process.env.REACT_APP_MEASUREMENTID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();
    this.firestore = app.firestore();
  }

  // ***** AUTH API *****

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = (password) =>
    this.auth.currentUser.updatePassword(password);

  // ***** USER API *****

  user = (uid) => this.firestore.collection("users").doc(uid);

  userCurrentChatId = (uid) => this.db.ref(`users/${uid}/currentChatId`);

  users = () => this.db.ref("users");

  // ***** CHAT API *****

  chat = (id) => this.firestore.collection("chats").doc(id);

  addChat = async (chatObject) =>
    await this.firestore.collection("chats").add(chatObject);

  getInactiveChats = async () => {
    const chatsRef = this.firestore.collection("chats");
    const chats = await chatsRef.where("active", "!=", true).limit(1).get();

    return chats;
  };

  firstChat = () => this.db.ref("chats").limitToLast(1);

  // *** MESSAGES API *****

  chatMessages = (chatId) => this.db.ref(`messages/${chatId}`);
}

export default Firebase;
