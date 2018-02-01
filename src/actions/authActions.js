import * as types from "./actionTypes";
import * as firebase from "firebase";
import Cookies from "universal-cookie";

import history from "../constants/history";

const cookies = new Cookies();

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

const auth = firebase.auth();

export const signInInitiated = () => {
  return { 
    type: types.SIGN_IN_AUTHORIZING, 
    user: null 
  };
}

export const signInDone = user => {
  return {
    type: types.SIGNED_IN,
    user
  };
}

export const signInFailed = (error) => {
  return {
    type: types.SIGN_IN_FAILED,
    error,
    user: null
  }
}

export const doSignIn = (email, password) => {
  return function(dispatch) {
    dispatch(signInInitiated());

    auth.signInWithEmailAndPassword(email, password)
      .then(user => {
        // set cookie
        cookies.set("ssid", user, { path: "/" });

        dispatch(signInDone(user));

        // redirect to homepage
        // TODO: Redirect based on role
        history.push("/");
      })
      .catch(error => {
        dispatch(signInFailed(error));
      })
  }
}