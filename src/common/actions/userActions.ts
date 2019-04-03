/*
  Contains actions for the currently logged in user.
*/

import firebase from "firebase";
import { auth, db } from "../utils/firebase";
import { isEmail } from "../utils/index";

import ActionTypes from "./actionTypes";
import User from "../models/User";
import iAction from "../imodels/iAction";
import iError from "../imodels/iError";

const UserActions = ActionTypes.User;
const Console = console;

// USER GET actions
export const userGetInitiated = (id : string) : iAction => {
  return {
    type: UserActions.GettingUser,
    id
  };
};

export const userGetFailed = (id : string, error : iError) : iAction => {
  return {
    type: UserActions.GettingUserFailed,
    id, error
  };
};

export const userGetSuccessful = (user : User) : iAction => {
  return {
    type: UserActions.GotUser,
    user
  };
};

export const doUserGet = () : any => {
  return (dispatch : Function) => {
    auth.onAuthStateChanged((user : any) => {
      if (user) {
        let uid = auth.currentUser.uid;
        dispatch(userGetInitiated(uid));

        db.collection("users")
          .doc(uid)
          .get()
          .then((doc : firebase.firestore.QueryDocumentSnapshot) => {
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
export const userUpdateInitiated = (uid : string, newData : any) : iAction => {
  return {
    type: UserActions.UpdatingUser,
    id: uid,
    data: newData
  };
};

export const userUpdateFailed = (uid : string, newData : any, error : iError) : iAction => {
  return {
    type: UserActions.UpdatingUserFailed,
    id: uid,
    data: newData,
    error
  };
};

export const userUpdated = (uid : string, newData : any) : iAction => {
  return {
    type: UserActions.UpdatedUser,
    id: uid,
    data: newData
  };
};

export const reauthenticationInitiated = (uid : string) : iAction => {
  return {
    type: UserActions.ReauthenticatingUser,
    id: uid
  }
}

export const reauthenticationSuccess = (uid : string) : iAction => {
  return {
    type: UserActions.ReauthenticatedUser,
    id: uid
  }
}

export const reauthenticationFailed = (uid : string, error : iError) : iAction => {
  return {
    type: UserActions.ReauthentcatingUserFailed,
    id: uid,
    error
  }
}

export const authEmailUpdateInitiated = (uid : string) : iAction => {
  return {
    type: UserActions.UpdatingUserEmail,
    id: uid
  };
}

export const authEmailUpdated = (uid : string) : iAction => {
  return {
    type: UserActions.UpdatedUserEmail,
    id: uid
  };
}

export const authEmailUpdateFailed = (uid : string, error : iError) : iAction => {
  return {
    type: UserActions.UpdatingUserEmailFailed,
    id: uid,
    error
  };
}

export const doUserUpdate = (newData : any, uid : any, refresh : boolean = false) : any => {
  let user = auth.currentUser;
  uid = uid || user.uid;

  return (dispatch : Function) => {
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

  return (dispatch : Function) => {
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

  return (dispatch : Function) => {
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