/*
  Contains actions for the currently logged in user.
*/

import firebase from "firebase";
import { auth, db } from "../utils/firebase";
import { isEmail } from "../utils/index";

import ActionTypes from "./actionTypes";
import User from "../models/User";

const UserActions = ActionTypes.User;
const Console = console;

// USER GET actions
export const userGetInitiated = (uid : string) : any => {
  return {
    type: UserActions.GettingUser,
    user: uid
  };
};

export const userGetFailed = (uid : string, error : any) : any => {
  return {
    type: UserActions.GettingUserFailed,
    user: uid,
    error
  };
};

export const userGetSuccessful = (user : User) : any => {
  return {
    type: UserActions.GotUser,
    user
  };
};

export const doUserGet = () : any => {
  return (dispatch : any) => {
    auth.onAuthStateChanged((user : any) => {
      if (user) {
        let uid = auth.currentUser.uid;
        dispatch(userGetInitiated(uid));

        db.collection("users")
          .doc(uid)
          .get()
          .then((doc : any) => {
              if(doc.exists) {
                let user = new User(doc.data());
                dispatch(userGetSuccessful(user));
              } else {
                dispatch(userGetFailed(uid, { message: `No user found with uid: ${uid}.`}));
              }
            })
            .catch((error : any) => {
              dispatch(userGetFailed(uid, error));
            })
      }
    });
  };
};

// USER UPDATE actions
export const userUpdateInitiated = (uid : string, newData : any) : any => {
  return {
    type: UserActions.UpdatingUser,
    user: uid,
    data: newData
  };
};

export const userUpdateFailed = (uid : string, newData : any, error : any) : any => {
  return {
    type: UserActions.UpdatingUserFailed,
    user: uid,
    dat: newData,
    error
  };
};

export const userUpdated = (uid : string, newData : any) : any => {
  return {
    type: UserActions.UpdatedUser,
    user: uid,
    data: newData
  };
};

export const reauthenticationInitiated = (uid : string) : any => {
  return {
    type: UserActions.ReauthenticatingUser,
    user: uid
  }
}

export const reauthenticationSuccess = (uid : string) : any => {
  return {
    type: UserActions.ReauthenticatedUser,
    user: uid
  }
}

export const reauthenticationFailed = (uid : string, error : any) : any => {
  return {
    type: UserActions.ReauthentcatingUserFailed,
    user: uid,
    error
  }
}

export const authEmailUpdateInitiated = (uid : string) : any => {
  return {
    type: UserActions.UpdatingUserEmail,
    user: uid
  };
}

export const authEmailUpdated = (uid : string) : any => {
  return {
    type: UserActions.UpdatedUserEmail,
    user: uid
  };
}

export const authEmailUpdateFailed = (uid : string, error : any) : any => {
  return {
    type: UserActions.UpdatingUserEmailFailed,
    user: uid,
    error
  };
}

export const doUserUpdate = (newData : any, uid : any, refresh : boolean = false) : any => {
  let user = auth.currentUser;
  uid = uid || user.uid;

  return (dispatch : any) => {
    dispatch(userUpdateInitiated(uid, newData));

    db.collection("users")
      .doc(uid)
      .update(newData)
      .then(() => {
        dispatch(userUpdated(uid, newData));

        // dispatch user get to update props
        // with new user data
        if (refresh)
          dispatch(doUserGet());
      })
      .catch((error : any) => {
        return dispatch(userUpdateFailed(uid, newData, error));
      })
  };
};

export const doUserEmailUpdate = (email : string) : any => {
  let user = auth.currentUser;
  let uid = user.uid;

  return (dispatch : any) => {
    if (!isEmail(email))
      return dispatch(authEmailUpdateFailed(uid, { message: "Invalid email provided." }));

    dispatch(userUpdateInitiated(uid, { email }));
    dispatch(authEmailUpdateInitiated(uid));

    user.updateEmail(email)
      .then(() => {
        dispatch(authEmailUpdated(uid));

        // update user in db
        doUserUpdate({email}, uid);
      })
      .catch((error : any) => {
        Console.log(error)
        return dispatch(userUpdateFailed(uid, { email }, error));
      })
  }
}

export const doUserEmailUpdateWithReauthentication = (email : string, password : string) : any => {
  let user = auth.currentUser;
  let uid = user.uid;

  return (dispatch : any) => {
    if (!isEmail(email))
      return dispatch(userUpdateFailed(uid, { email }, { message: "Invalid email provided." }));

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
            doUserUpdate({ email }, uid);
          })
          .catch((error : any) => {
            return dispatch(userUpdateFailed(uid, {email}, error));
          })
      })
      .catch((error : any) => {
        return dispatch(reauthenticationFailed(uid, error));
      })
  }
}