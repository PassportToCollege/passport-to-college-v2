// initialize firebase
import firebase from "firebase";

var config = {};

if (process.env.ENVIRONMENT === "production") {
  config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
  };
} else {
  config = {
    apiKey: "AIzaSyB66B4bUvEVKl-ZMQYXo1gqXCUCvrm2z-w",
    authDomain: "passport-to-college-dev.firebaseapp.com",
    databaseURL: "https://passport-to-college-dev.firebaseio.com",
    projectId: "passport-to-college-dev",
    storageBucket: "passport-to-college-dev.appspot.com",
    messagingSenderId: "907519699435"
  };
}

if (!firebase.apps.length)
  firebase.initializeApp(config);

export const auth = firebase.auth();
export const db = firebase.database();
export const storage = firebase.storage();