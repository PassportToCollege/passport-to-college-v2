import * as types from "./actionTypes";
import { auth, db } from "../utils/firebase";
import Cookies from "universal-cookie";

import history from "../constants/history";

const cookies = new Cookies();

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
            cookies.set("ssid", user.uid, { path: "/", maxAge: 60 * 60 * 24 });

            dispatch(signInDone(user.uid));

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