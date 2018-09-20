import axios from "axios";
import firebase from "firebase";
import moment from "moment";

import * as types from "./actionTypes";
import { isEmail } from "../utils";
import { auth, db } from "../utils/firebase";
import { User, SSID } from "../utils/utilityClasses";
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
      .then(userCredential => {
        dispatch(gettingSignedInUser());

        const { uid } = userCredential.user;

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

export const signInWithSocialInitiated = provider => {
  return {
    type: types.SIGN_IN_WITH_SOCIAL_INITIATED,
    provider
  };
};

export const signInWithSocialFailed = (error, provider) => {
  return {
    type: types.SIGN_IN_WITH_SOCIAL_FAILED,
    error, provider
  };
};

export const signedInWithSocial = user => {
  return {
    type: types.SIGNED_IN_WITH_SOCIAL,
    user
  };
};

export const doSignInWithSocial = (provider, options) => {
  return dispatch => {
    if ("string" !== typeof provider)
      return signInWithSocialFailed({ message: "provider type error" }, provider);

    dispatch(signInWithSocialInitiated(provider));
      
    options = options || {};
    
    let p;
    switch (provider) {
      case "google":
        p = new firebase.auth.GoogleAuthProvider();
        break;
      case "facebook":
        p = new firebase.auth.FacebookAuthProvider();
        break;
      default:
        return signInWithSocialFailed({ message: "unknown provider" }, provider)
    }

    return auth.signInWithPopup(p)
      .then(results => {
        db.collection("users")
          .doc(results.user.uid)
          .get()
          .then(snapshot => {
            if (snapshot.exists) {
              let user = snapshot.data();
              user.uid = results.user.uid;

              if (options.match && options.match !== user.uid) {
                return auth.signOut().then(() => {
                  return dispatch(signInWithSocialFailed({ message: "incorrect account signed in" }, provider));
                });
              }

              if (options.strict && !user[options.strict]) {
                return auth.signOut().then(() => {
                  return dispatch(signInWithSocialFailed({ message: "user type mismatch" }, provider));
                });
              }

              const userCookie = new SSID(user);
              userCookie.create();

              return dispatch(signedInWithSocial(user));
            }

            results.user.delete().then(() => {
              dispatch(signInWithSocialFailed({ message: "user not found" }, provider));
            });
          })
      })
      .catch(error => {
        return dispatch(signInWithSocialFailed(error, provider));
      });
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

export const addingDataToUserDbs = () => {
  return {
    type: types.ACCOUNT_CREATION_ADDING_TO_USER_DBS
  };
};

export const addingDataToUserDbsFailed = error => {
  return {
    type: types.ACCOUNT_CREATION_ADDING_TO_USER_DBS_FAILED,
    error
  };
};

export const addedDataToUserDbs = () => {
  return {
    type: types.ACCOUNT_CREATION_ADDED_TO_USER_DBS
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
      .then(userCredential => {
        const { user } = userCredential;
        
        // create user data object
        let userData = {
          uid: user.uid,
          email: data.email,
          isAdmin: data.isAdmin || false,
          isApplicant: data.isApplicant || false,
          isStudent: data.isStudent || false,
          isStaff: data.isStaff || false,
          emailConfirmed: data.emailConfirmed || false
        };

        if ("string" === typeof data.name) {
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
        } else if ("object" === typeof data.name) {
          userData.name = data.name;
        }

        let batch = db.batch();
        let userRef = db.collection("users").doc(user.uid);

        batch.set(userRef, userData);

        if (data.isApplicant) {
          batch.set(db.collection("applications").doc(user.uid), {
            uid: user.uid, 
            user: userData,
            state: {
              draft: true,
              pending: false,
              accepted: false,
              rejected: false
            }, 
            startedOn: new Date() 
          });
        }
        
        if (data.isStudent) {
          batch.set(db.collection("students").doc(user.uid), {
            uid: user.uid, 
            user: userData 
          });
        }

        // delete temp user if uid has temp
        if (data.uid && data.uid.indexOf("temp") > -1)
          batch.delete(db.collection("users").doc(data.uid));

        dispatch(addingDataToUserDbs());

        batch.commit()
          .then(() => {
            dispatch(addedDataToUserDbs());
            dispatch(accountCreated(data));

            // send welcome and confirmation email
            // to applicants
            if (data.isApplicant) {
              dispatch(sendEmailConfirmationEmailInitated(data.email));
  
              // send email with api
              axios.get(`${EMAIL_API}/s/welcome/${user.uid}`)
                .then(() => {
                  dispatch(sendEmailConfirmationEmailSent(data.email));
                })
                .catch(error => {
                  dispatch(sendEmailConfirmationEmailFailed(error, data.email));
                })
            }
          })
          .catch(error => {
            dispatch(addingDataToUserDbsFailed(error));
          })
      })
      .catch(error => {
        dispatch(accountCreationFailed(data, error));
      })
  };
};

export const signUpWithSocialInitiated = provider => {
  return {
    type: types.SIGN_UP_WITH_SOCIAL_INITIATED,
    provider
  };
};

export const signUpWithSocialFailed = (error, provider) => {
  return {
    type: types.SIGN_UP_WITH_SOCIAL_FAILED,
    error, provider
  };
};

export const signedUpWithSocial = provider => {
  return {
    type: types.SIGNED_UP_WITH_SOCIAL,
    provider
  };
};

export const doSignUpWithSocial = (provider, options) => {
  return dispatch => {
    if ("string" !== typeof provider)
      return signUpWithSocialFailed({ message: "provider type error" }, provider);

    dispatch(signUpWithSocialInitiated(provider));

    options = options || {};

    let p;
    switch (provider) {
      case "google":
        p = new firebase.auth.GoogleAuthProvider();
        break;
      case "facebook":
        p = new firebase.auth.FacebookAuthProvider();
        break;
      default:
        return signUpWithSocialFailed({ message: "unknown provider" }, provider)
    }

    return auth.signInWithPopup(p)
      .then(results => {
        db.collection("users")
          .doc(results.user.uid)
          .get()
          .then(snapshot => {
            if (snapshot.exists) {
              let data = snapshot.data();

              if (data.isAdmin || data.isApplicant || data.isStudent) {
                return auth.signOut().then(() => {
                  dispatch(signUpWithSocialFailed({ message: "user already exists" }, provider));
                });
              }
            }

            dispatch(addingDataToUserDbs());

            const { user } = results;
            options.photo = user.photoURL;

            const newUser = new User(user.uid, user.email, user.displayName, options);
            const userData = newUser.data;

            let batch = db.batch();
            let userRef = db.collection("users").doc(user.uid);

            batch.set(userRef, userData, { merge: true });

            if (userData.isApplicant) {
              batch.set(db.collection("applications").doc(user.uid), {
                uid: user.uid,
                user: userData,
                state: {
                  draft: true,
                  pending: false,
                  accepted: false,
                  rejected: false
                },
                startedOn: new Date(moment.utc(moment()).toDate()).getTime()
              }, { merge: true });
            }

            if (userData.isStudent) {
              batch.set(db.collection("students").doc(user.uid), {
                uid: user.uid,
                user: userData
              }, { merge: true });
            }

            batch.commit()
              .then(() => {
                dispatch(addedDataToUserDbs());

                if (userData.isApplicant) {
                  dispatch(sendEmailConfirmationEmailInitated(userData.email));

                  axios.get(`${EMAIL_API}/s/welcome/${user.uid}`)
                    .then(() => {
                      dispatch(sendEmailConfirmationEmailSent(user.email));

                      const userCookie = new SSID(userData);
                      userCookie.create();

                      dispatch(signedUpWithSocial(provider));
                      dispatch(signedInWithSocial(userData));
                    })
                    .catch(error => {
                      dispatch(signedUpWithSocial(provider));
                      dispatch(signedInWithSocial(userData));
                      dispatch(sendEmailConfirmationEmailFailed(error, user.email));
                    })
                }
              })
              .catch(error => {
                dispatch(addingDataToUserDbsFailed(error));
              })
          });
      })
      .catch(error => {
        return dispatch(signUpWithSocialFailed(error, provider));
      })
  }
}


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

// LINK SOCIAL ACCOUNT
export const linkSocialAccountInitiated = provider => {
  return {
    type: types.LINK_SOCIAL_ACCOUNT_INITIATED,
    provider
  };
};

export const linkSocialAccountFailed = (error, provider) => {
  return {
    type: types.LINK_SOCIAL_ACCOUNT_FAILED,
    error, provider
  };
};

export const socialAccountLinked = (provider, credentials) => {
  return {
    type: types.SOCIAL_ACCOUNT_LINKED,
    provider, credentials
  };
};

export const doLinkSocialAccount = provider => {
  return dispatch => {
    if (!provider)
      return dispatch(linkSocialAccountFailed({ message: "no provider" }, null));

    dispatch(linkSocialAccountInitiated(provider));

    let p;
    switch (provider) {
      case "google":
        p = new firebase.auth.GoogleAuthProvider();
        break;
      case "facebook":
        p = new firebase.auth.FacebookAuthProvider();
        break;
      case "github":
        p = new firebase.auth.GithubAuthProvider();
        break;
      case "twitter":
        p = new firebase.auth.TwitterAuthProvider();
        break;
      default:
        return linkSocialAccountFailed({
          message: "unknown provider"
        }, provider);
    }

    auth.currentUser.linkWithPopup(p)
      .then(result => {
        dispatch(socialAccountLinked(provider, result.credentials));
      })
      .catch(error => {
        dispatch(linkSocialAccountFailed(error, provider));
      })
  }
}

// UNLINK SOCIAL ACCOUNT
export const unlinkSocialAccountInitiated = provider => {
  return {
    type: types.UNLINK_SOCIAL_ACCOUNT_INITIATED,
    provider
  };
};

export const unlinkSocialAccountFailed = (error, provider) => {
  return {
    type: types.UNLINK_SOCIAL_ACCOUNT_FAILED,
    error, provider
  };
};

export const socialAccountUnlinked = provider => {
  return {
    type: types.SOCIAL_ACCOUNT_UNLINKED,
    provider
  };
};

export const doUnlinkSocialAccount = provider => {
  return dispatch => {
    if (!provider)
      return dispatch(unlinkSocialAccountFailed({ message: "no provider" }, null));

    dispatch(unlinkSocialAccountInitiated(provider));

    auth.onAuthStateChanged(user => {
      if (user) {
        user.unlink(provider)
          .then(() => {
            dispatch(socialAccountUnlinked(provider));
          })
          .catch(error => {
            dispatch(unlinkSocialAccountFailed(error, provider));
          })
      }
    });
  };
};

// LINK PASSWORD PROVIDER
export const addPasswordProviderInitiated = () => {
  return {
    type: types.ADD_PASSWORD_PROVIDER_INITIATED
  };
};

export const addPasswordProviderFailed = error => {
  return {
    type: types.ADD_PASSWORD_PROVIDER_FAILED,
    error
  };
};

export const addedPasswordProvider = credentials => {
  return {
    type: types.ADDED_PASSWORD_PROVIDER,
    credentials
  };
};

export const doAddPasswordProvider = (email = "", password = "") => {
  return dispatch => {
    if (!email)
      return dispatch(addPasswordProviderFailed({message: "no email provided"}));
    
    if (!password)
      return dispatch(addPasswordProviderFailed({message: "no password provided"}));

    if (!isEmail(email))
      return dispatch(addPasswordProviderFailed({message: "invalid email provided"}));

    dispatch(addPasswordProviderInitiated());

    const credential = firebase.auth.EmailAuthProvider.credential(email, password);

    auth.currentUser.linkAndRetrieveDataWithCredential(credential)
      .then(userCred => {
        dispatch(addedPasswordProvider(userCred));
      })
      .catch(error => {
        dispatch(addPasswordProviderFailed(error));
      })
  }
}

// CHANGE EMAIL ADDRESS
export const changeEmailAddressInitiated = nEmail => {
  return {
    type: types.EMAIL_ADDRESS_CHANGE_INITIATED,
    nEmail
  };
};

export const changeEmailAddressFailed = (error, nEmail) => {
  return {
    type: types.EMAIL_ADDRESS_CHANGE_FAILED,
    error, nEmail
  };
};

export const changedEmailAddress = nEmail => {
  return {
    type: types.EMAIL_ADDRESS_CHANGED,
    nEmail
  };
};

export const doChangeEmailAddress = email => {
  return dispatch => {
    if (!isEmail(email))
      return dispatch(changeEmailAddressFailed({ message: "invalid email address" }, email));

    dispatch(changeEmailAddressInitiated(email));

    const user = auth.currentUser;

    user.updateEmail(email)
      .then(() => {
        dispatch(changedEmailAddress(email));
      })
      .catch(error => {
        dispatch(changeEmailAddressFailed(error, email));
      })
  }
}