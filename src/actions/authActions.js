import axios from "axios";
import * as types from "./actionTypes";
import { auth, db } from "../utils/firebase";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const EMAIL_API = process.env.REACT_APP_EMAIL_API;

// @SIGN IN
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

        const uid = user.uid;

        // get user
        db.collection("users")
          .doc(uid)
          .get()
          .then(doc => {
            if (doc.exists) {
              let user = doc.data();

              // set cookie
              const d = {
                uid,
                isAdmin: user.isAdmin || false,
                isApplicant: user.isApplicant || false,
                isStaff: user.isStaff || false,
                isStudent: user.isStudent || false,
                createdAt: new Date()
              };
              cookies.set("ssid", d, { path: "/", maxAge: 60 * 60 * 24 });
              
              user.uid = uid;
              dispatch(signInDone(user));
            }
          })
        })
        .catch(error => {
          dispatch(signInFailed(error));
      })
  };
};

// @SIGN OUT
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
      })
      .catch(error => {
        dispatch(signOutFailed(error));
      })
  };
};

// @ACCOUNT CREATION
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

export const sendEmailConfirmationEmailInitated = email => {
  return {
    type: types.EMAIL_CONFIRMATION_SEND_INITIATED,
    email
  };
};

export const sendEmailConfirmationEmailSent = email => {
  return {
    type: types.EMAIL_CONFIRMATION_SENT,
    email
  };
};

export const sendEmailConfirmationEmailFailed = (error, email) => {
  return {
    type: types.EMAIL_CONFIRMATION_SEND_FAILED,
    email, error
  };
};

export const doAccountCreate = (data) => {
  return dispatch => {
    dispatch(accountCreationInitialized(data));

    auth.createUserWithEmailAndPassword(data.email, data.password)
      .then(user => {
        // create user data object
        let userData = {
          uid: user.uid,
          email: data.email,
          isAdmin: data.isAdmin || false,
          isApplicant: data.isApplicant || false,
          isStudent: data.isStudent || false,
          isStaff: data.isStaff || false,
          emailConfirmed: false
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
        let userRef = db.collection("users").doc(user.uid);

        batch.set(userRef, userData);

        if (data.isApplicant) {
          batch.set(db.collection("applications").doc(user.uid), {
            uid: user.uid, 
            user: userData,
            state: "draft", 
            startedOn: new Date() 
          });
        }
        
        if (data.isStudent) {
          batch.set(db.collection("students").doc(user.uid), {
            uid: user.uid, 
            user: userData 
          });
        }

        dispatch(addingDataToUserDbs(data));

        batch.commit()
          .then(() => {
            dispatch(accountCreated(data));

            // send welcome and confirmation email
            // to applicants
            if (data.isApplicant) {
              dispatch(sendEmailConfirmationEmailInitated(data.email));
  
              // send email with api
              axios.get(`${EMAIL_API}/s/welcome/${user.uid}`)
                .then(() => {
                  dispatch(sendEmailConfirmationEmailSent(data.email));
  
                  // sign user in after 2 seconds
                  setTimeout(() => {
                    dispatch(doSignIn(data.email, data.password));
                  }, 2000);
                })
                .catch(error => {
                  dispatch(sendEmailConfirmationEmailFailed(error, data.email));
                })
            }

            // sign user in after 2 seconds
            setTimeout(() => {
              dispatch(doSignIn(data.email, data.password));
            }, 2000);
          })
          .catch(error => {
            dispatch(addingDataToUserDbsFailed(data, error));
          })
      })
      .catch(error => {
        dispatch(accountCreationFailed(data, error));
      })
  };
};

// @REMOVE ERRORS
export const removeAuthErrors = () => {
  return {
    type: types.REMOVE_AUTH_ERRORS
  }
}

// @SEND RESET PASSWORD EMAIL
export const resetPasswordEmailSendInitiated = email => {
  return {
    type: types.RESET_PASSWORD_EMAIL_INITIATED,
    email
  };
};

export const resetPasswordEmailSendFailed = (error, email) => {
  return {
    type: types.RESET_PASSWORD_EMAIL_FAILED,
    email, error
  };
};

export const resetPasswordEmailSent = email => {
  return {
    type: types.RESET_PASSWORD_EMAIL_SENT,
    email
  };
};

export const doResetPasswordEmailSend = email => {
  return dispatch => {
    dispatch(resetPasswordEmailSendInitiated(email));

    // send password reset email
    auth.sendPasswordResetEmail(email)
      .then(() => {
        dispatch(resetPasswordEmailSent(email));
      })
      .catch(error => {
        dispatch(resetPasswordEmailSendFailed(error, email));
      });

  }
}

// @SEND EMAIL CONFIRMATION
export const doSendEmailConfirmation = (uid, email) => {
  return dispatch => {
    dispatch(sendEmailConfirmationEmailInitated(email));

    // send email with api
    axios.get(`${EMAIL_API}/s/confirm-email/${uid}`)
      .then(() => {
        dispatch(sendEmailConfirmationEmailSent(email));
      })
      .catch(error => {
        dispatch(sendEmailConfirmationEmailFailed(error, email));
      });
  };
};