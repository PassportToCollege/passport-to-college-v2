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
};

export const gettingSignedInUser = () => {
  return {
    type: types.SIGN_IN_GETTING_USER,
    user: null
  };
};

export const signInDone = user => {
  return {
    type: types.SIGNED_IN,
    user
  };
};

export const signInFailed = (error) => {
  return {
    type: types.SIGN_IN_FAILED,
    error,
    user: null
  };
};

export const doSignIn = (email, password) => {
  return dispatch => {
    dispatch(signInInitiated());

    auth.signInWithEmailAndPassword(email, password)
      .then(user => {
        dispatch(gettingSignedInUser());

        // get user
        db.collection("user")
          .doc(user.uid)
          .get()
          .then(doc => {
            if (doc.exists) {
              let user = doc.data();

              // set cookie
              cookies.set("ssid", user.uid, { path: "/", maxAge: 60 * 60 * 24 });
              
              dispatch(signInDone(user.uid));

              // redirect to homepage
              if (user.isAdmin) {
                history.push("/admin/dashboard");
              } else {
                history.push("/");
              }
            } else {
              console.log("no user data found.");
            }
          })
        })
        .catch(error => {
          console.log(error)
          dispatch(signInFailed(error));
      })
  };
};

export const signOutInitiated = user => {
  return {
    type: types.SIGN_OUT_AUTHORIZING,
    user
  };
};

export const signOutDone = () => {
  return {
    type: types.SIGNED_OUT,
    user: null
  };
};

export const signOutFailed = error => {
  return {
    type: types.SIGN_OUT_FAILED,
    error,
    user: null
  };
};

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
  };
};

export const accountCreationInitialized = data => {
  return {
    type: types.ACCOUNT_CREATION_INITIATED,
    data
  };
};

export const accountCreated = data => {
  return {
    type: types.ACCOUNT_CREATED,
    data
  };
};

export const accountCreationFailed = (data, error) => {
  return {
    type: types.ACCOUNT_CREATION_FAILED,
    data, 
    error
  };
};

export const addingDataToUserDbs = data => {
  return {
    type: types.ACCOUNT_CREATION_ADDING_TO_USER_DBS,
    data
  };
}

export const addingDataToUserDbsFailed = data => {
  return {
    type: types.ACCOUNT_CREATION_ADDING_TO_USER_DBS_FAILED,
    data
  };
}

export const doAccountCreate = (data) => {
  return dispatch => {
    dispatch(accountCreationInitialized(data));

    auth.createUserWithEmailAndPassword(data.email, data.password)
      .then(user => {
        // create user data object
        let userData = {
          email: data.email,
          isAdmin: data.isAdmin || false,
          isApplicant: data.isApplicant || false,
          isStudent: data.isStudent || false,
          isStaff: data.isStaff || false
        };

        let name = data.name.split(" ");
        
        if (name.length === 3) {
          userData.name = {
            first: name[0],
            middle: name[1],
            last: name[2],
            full: [name[0], name[2]].join(" ")
          }
        } else {
          userData.name = {
            first: name[0],
            last: name[1],
            full: data.name
          }
        }

        let batch = db.batch();
        let userRef = db.collection("user").doc(user.uid);

        batch.set(userRef, userData);

        if (data.isApplicant)
          batch.set(db.collection("application").doc(user.uid), {});
        
        if (data.isStudent)
          batch.set(db.collection("student").doc(user.uid), {});

        dispatch(addingDataToUserDbs(data));

        batch.commit()
          .then(() => {
            dispatch(accountCreated(data));
          })
          .catch(error => {
            console.log(error);
            dispatch(addingDataToUserDbsFailed(data, error));
          })
      })
      .catch(error => {
        console.log(error);
        dispatch(accountCreationFailed(data, error));
      })
  };
};