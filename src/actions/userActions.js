/*
  Contains actions for the currently logged in user.
*/

import * as types from "./actionTypes";
import firebase from "firebase";
import { auth, db } from "../utils/firebase";

const Console = console;

// USER GET actions

export const userGetInitiated = uid => {
  return {
    type: types.USER_GET_INITIATED,
    user: uid
  };
};

export const userGetFailed = (uid, error) => {
  return {
    type: types.USER_GET_FAILED,
    user: uid,
    error
  };
};

export const userGetSuccessful = user => {
  return {
    type: types.USER_GET_SUCCESS,
    user
  };
};

export const doUserGet = () => {
  return dispatch => {
    auth.onAuthStateChanged(user => {
      if (user) {
        let uid = auth.currentUser.uid;
        dispatch(userGetInitiated(uid));
                
        db.collection("user")
          .doc(uid)
          .get()
          .then(doc => {
            if(doc.exists) {
              dispatch(userGetSuccessful(doc.data()));
            } else {
              dispatch(userGetFailed(uid, `No user found with uid: ${uid}.`));
            }
          })
          .catch(error => {
            dispatch(userGetFailed(uid, error));
          })
      }
    });
  };
};

// USER UPDATE actions

export const userUpdateInitiated = (uid, data) => {
  return {
    type: types.USER_UPDATE_INITIATED,
    user: uid,
    data
  };
};

export const userUpdateFailed = (uid, data, error) => {
  return {
    type: types.USER_UPDATE_FAILED,
    user: uid,
    data,
    error
  };
};

export const userUpdated = (uid, data) => {
  return {
    type: types.USER_UPDATED,
    user: uid,
    data
  };
};

export const reauthenticationInitiated = uid => {
  return {
    type: types.USER_REAUTHENTICATION_INITIATED,
    user: uid
  }
}

export const reauthenticationSuccess = uid => {
  return {
    type: types.USER_REAUTHENTICATED,
    user: uid
  }
}

export const reauthenticationFailed = (uid, error) => {
  return {
    type: types.USER_REAUTHENTICATION_FAILED,
    user: uid,
    error
  }
}

export const authEmailUpdateInitiated = uid => {
  return {
    type: types.USER_AUTH_EMAIL_UPDATE_INITIATED,
    user: uid
  };
}

export const authEmailUpdated = uid => {
  return {
    type: types.USER_AUTH_EMAIL_UPDATED,
    user: uid
  };
}

export const authEmailUpdateFailed = (uid, error) => {
  return {
    type: types.USER_AUTH_EMAIL_UPDATE_FAILED,
    user: uid,
    error
  };
}

export const doUserUpdate = (data) => {
  let user = auth.currentUser;
  let uid = user.uid;

  return dispatch => {
    dispatch(userUpdateInitiated(uid, data));

    db.collection("user")
      .doc(uid)
      .update(data)
      .then(() => {
        dispatch(userUpdated(uid, data));

        // dispatch user get to update props
        // with new user data
        return dispatch(doUserGet(uid));
      })
      .catch(error => {
        return dispatch(userUpdateFailed(uid, data, error));
      })
  };
};

export const doUserEmailUpdate = email => {
  let user = auth.currentUser;
  let uid = user.uid;

  return dispatch => {
    dispatch(userUpdateInitiated(uid, {email}));
    dispatch(authEmailUpdateInitiated(uid));

    user.updateEmail(email)
      .then(() => {
        dispatch(authEmailUpdated(uid));

        // update user in db
        db.collection("user")
          .doc(uid)
          .update({ email })
          .then(() => {
            dispatch(userUpdated(uid, { email }));
          })
          .catch(error => {
            Console.log(error)
            return dispatch(userUpdateFailed(uid, { email }, error));
          })
      })
      .catch(error => {
        Console.log(error)
        return dispatch(userUpdateFailed(uid, { email }, error));
      })
  }
}

export const doUserEmailUpdateWithReauthentication = (email, password) => {
  let user = auth.currentUser;
  let uid = user.uid;

  return dispatch => {
    dispatch(userUpdateInitiated(uid, {email}));

    dispatch(reauthenticationInitiated(uid));

    let credential = firebase.auth.EmailAuthProvider.credential(user.email, password);
    user.reauthenticateWithCredential(credential)
      .then(() => {
        dispatch(reauthenticationSuccess(uid));
        dispatch(authEmailUpdateInitiated(uid));

        user.updateEmail(email)
          .then(() => {
            dispatch(authEmailUpdated(uid));

            // update user in db
            db.collection("user")
              .doc(uid)
              .update({email})
              .then(() => {
                dispatch(userUpdated(uid, {email}));
              })
              .catch(error => {
                return dispatch(userUpdateFailed(uid, {email}, error));
              })
          })
          .catch(error => {
            return dispatch(userUpdateFailed(uid, {email}, error));
          })
      })
      .catch(error => {
        return dispatch(reauthenticationFailed(uid, error));
      })
  }
}

export const doUserUpdateWithoutGet = (data) => {
  let user = auth.currentUser;
  let uid = user.uid;

  return dispatch => {
    dispatch(userUpdateInitiated(uid, data));

    db.collection("user")
      .doc(uid)
      .update(data)
      .then(() => {
        dispatch(userUpdated(uid, data));
      })
      .catch(error => {
        return dispatch(userUpdateFailed(uid, data, error));
      })
  };
};