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
const db = firebase.database();

export const signInInitiated = () => {
  return { 
    type: types.SIGN_IN_AUTHORIZING, 
    user: null 
  };
}

export const gettingSignedInUser = () => {
  return {
    type: types.SIGN_IN_GETTING_USER,
    user: null
  }
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

export const signOutInitiated = user => {
  return {
    type: types.SIGN_OUT_AUTHORIZING,
    user
  }
}

export const signOutDone = () => {
  return {
    type: types.SIGNED_OUT,
    user: null
  }
}

export const signOutFailed = error => {
  return {
    type: types.SIGN_OUT_FAILED,
    error,
    user: null
  }
}

export const doSignIn = (email, password) => {
  return dispatch => {
    dispatch(signInInitiated());

    auth.signInWithEmailAndPassword(email, password)
      .then(user => {
        dispatch(gettingSignedInUser());

        // get user
        db.ref(`users/${user.uid}`)
          .once("value")
          .then(snapshot => {
            let user = snapshot.val()

            // set cookie
            cookies.set("ssid", user, { path: "/", maxAge: 60 * 60 * 24 });

            dispatch(signInDone(user));

            // redirect to homepage
            if(user.isAdmin) {
              history.push("/admin/dashboard");
            } else {
              history.push("/");
            }
          })
      })
      .catch(error => {
        dispatch(signInFailed(error));
      })
  }
}

export const doSignOut = user => {
  return dispatch => {
    dispatch(signOutInitiated(user));

    auth.signOut()
      .then(() => {
        // destroy cookie
        cookies.remove("ssid", { path: "/" });

        dispatch(signOutDone());

        // redirect to homepage
        history.push("/");
      })
      .catch(error => {
        dispatch(signOutFailed(error));
      })
  }
}