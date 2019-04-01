import axios from "axios";
import firebase from "firebase";
import moment from "moment";

import ActionTypes from "./actionTypes";
import { isEmail } from "../utils";
import { auth, db } from "../utils/firebase/index";
import SSID from "../models/SSID";
import User from "../models/User";
import Cookies from "universal-cookie";
import { doUserUpdate } from "./userActions";

const cookies : any = new Cookies();
const EMAIL_API : string = process.env.REACT_APP_EMAIL_API || "";
const { Auth } = ActionTypes;

// @SIGN IN
export const signInInitiated = () : any => {
  return { 
    type: Auth.SignInAuthorizing, 
    user: null 
  };
};

export const gettingSignedInUser = () : any => {
  return {
    type: Auth.GettingUser,
    user: null
  };
};

export const signInDone = (user : any) : any => {
  return {
    type: Auth.SignedIn,
    user
  };
};

export const signInFailed = (error : any) : any => {
  return {
    type: Auth.SignInFailed,
    error,
    user: null
  };
};

export const doSignIn = (email : string, password : string) : any => {
  return (dispatch : any) => {
    dispatch(signInInitiated());

    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential : any) => {
        dispatch(gettingSignedInUser());

        const { uid } = userCredential.user!;
        
        // get user
        db.collection("users")
          .doc(uid)
          .get()
          .then((doc : any) => {
            if (doc.exists) {
              let user : User = new User({
                uid,
                ...doc.data()
              });

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
        .catch((error : any) => {
          dispatch(signInFailed(error));
      })
  };
};

export const signInWithSocialInitiated = (provider : string) : any => {
  return {
    type: Auth.SignInAuthorizing_Social,
    provider
  };
};

export const signInWithSocialFailed = (error : any, provider : string) : any => {
  return {
    type: Auth.SignInFailed_Social,
    error, provider
  };
};

export const signedInWithSocial = (user : User) : any => {
  return {
    type: Auth.SignedIn_Social,
    user
  };
};

export const doSignInWithSocial = (provider : string, options : any = {}) : any => {
  return (dispatch : any) => {
    dispatch(signInWithSocialInitiated(provider));
    
    let p : any;
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
      .then((results : any) => {
        db.collection("users")
          .doc(results.user.uid)
          .get()
          .then((snapshot : any) => {
            if (snapshot.exists) {
              let snapData = snapshot.data;
              let user = new User({ uid: results.user.uid, ...snapData});

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
      .catch((error : any) => {
        return dispatch(signInWithSocialFailed(error, provider));
      });
  };
};

// @SIGN OUT
export const signOutInitiated = (user : User) : any => {
  return {
    type: Auth.SignOutAuthorizing,
    user
  };
};

export const signOutDone = () : any => {
  return {
    type: Auth.SignedOut,
    user: null
  };
};

export const signOutFailed = (error : any) : any => {
  return {
    type: Auth.SignOutFailed,
    error,
    user: null
  };
};

export const doSignOut = (user : User) : any => {
  return (dispatch : any) : void => {
    dispatch(signOutInitiated(user));

    auth.signOut()
      .then(() => {
        // destroy cookie
        cookies.remove("ssid", { path: "/" });

        dispatch(signOutDone());
      })
      .catch((error : any) => {
        dispatch(signOutFailed(error));
      })
  };
};

// @ACCOUNT CREATION
export const accountCreationInitialized = (userData : any) : any => {
  return {
    type: Auth.CreatingAccount,
    data: userData
  };
};

export const accountCreated = (userData : User) : any => {
  return {
    type: Auth.CreatedAccount,
    data : userData
  };
};

export const accountCreationFailed = (userData : any, error : any) : any => {
  return {
    type: Auth.CreatingAccountFailed,
    data : userData, 
    error
  };
};

export const addingDataToUserDbs = () : any => {
  return {
    type: Auth.AddingToDb
  };
};

export const addingDataToUserDbsFailed = (error : any) : any => {
  return {
    type: Auth.AddingToDbFailed,
    error
  };
};

export const addedDataToUserDbs = () : any => {
  return {
    type: Auth.AddedToDb
  };
}

export const sendEmailConfirmationEmailInitated = (email : string) : any => {
  return {
    type: Auth.AccountCreatedEmailSending,
    email
  };
};

export const sendEmailConfirmationEmailSent = (email : string) : any => {
  return {
    type: Auth.AccountCreatedEmailSent,
    email
  };
};

export const sendEmailConfirmationEmailFailed = (error : any, email : string) : any => {
  return {
    type: Auth.AccountCreatedEmailFailed,
    email, error
  };
};

export const doAccountCreate = (userData : any) : any => {
  return (dispatch : any) => {
    dispatch(accountCreationInitialized(userData));

    auth.createUserWithEmailAndPassword(userData.email, userData.password)
      .then((userCredential : any) => {
        const { user } : any = userCredential;
        
        // create user data object
        let newUser = new User({
          uid: user.uid,
          email: userData.email,
          isAdmin: userData.isAdmin || false,
          isApplicant: userData.isApplicant || false,
          isStudent: userData.isStudent || false,
          isStaff: userData.isStaff || false,
          emailConfirmed: userData.emailConfirmed || false
        });

        let batch = db.batch();
        let userRef = db.collection("users").doc(newUser._uid);

        batch.set(userRef, userData);

        if (newUser.isApplicant) {
          batch.set(db.collection("applications").doc(newUser._uid), {
            uid: newUser._uid, 
            user: newUser.data,
            state: {
              draft: true,
              pending: false,
              accepted: false,
              rejected: false
            }, 
            startedOn: new Date() 
          });
        }
        
        if (newUser.isStudent) {
          batch.set(db.collection("students").doc(user.uid), {
            uid: newUser._uid, 
            user: newUser.data 
          });
        }

        // delete temp user if uid has temp
        if (newUser._uid && newUser._uid.indexOf("temp") > -1)
          batch.delete(db.collection("users").doc(newUser._uid));

        dispatch(addingDataToUserDbs());

        batch.commit()
          .then(() => {
            dispatch(addedDataToUserDbs());
            dispatch(accountCreated(newUser));

            // send welcome and confirmation email
            // to applicants
            if (newUser.isApplicant) {
              dispatch(sendEmailConfirmationEmailInitated(newUser.email));
  
              // send email with api
              axios.get(`${EMAIL_API}/s/welcome/${newUser._uid}`)
                .then(() => {
                  dispatch(sendEmailConfirmationEmailSent(newUser.email));
                })
                .catch(error => {
                  dispatch(sendEmailConfirmationEmailFailed(error, newUser.email));
                })
            }
          })
          .catch((error : any) => {
            dispatch(addingDataToUserDbsFailed(error));
          })
      })
      .catch((error : any) => {
        dispatch(accountCreationFailed(userData, error));
      })
  };
};

export const signUpWithSocialInitiated = (provider : string) : any => {
  return {
    type: Auth.CreatingAccount_Social,
    provider
  };
};

export const signUpWithSocialFailed = (error : any, provider : string) : any => {
  return {
    type: Auth.CreatingAccountFailed_Social,
    error, provider
  };
};

export const signedUpWithSocial = (provider : any) : any => {
  return {
    type: Auth.CreatedAccount_Social,
    provider
  };
};

export const doSignUpWithSocial = (provider : string, options : any = {}) : any => {
  return (dispatch : any) => {
    dispatch(signUpWithSocialInitiated(provider));

    let p : any;
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
      .then((results : any) => {
        db.collection("users")
          .doc(results.user.uid)
          .get()
          .then((snapshot : any) => {
            if (snapshot.exists) {
              let data : any = snapshot.data();

              if (data.isAdmin || data.isApplicant || data.isStudent) {
                return auth.signOut().then(() => {
                  dispatch(signUpWithSocialFailed({ message: "user already exists" }, provider));
                });
              }
            }

            dispatch(addingDataToUserDbs());

            const { user } = results;
            options.photo = user.photoURL;

            const newUser = new User({
              uid : user.uid, 
              email: user.email, 
              name: user.displayName, 
              ...options
            });
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

                      const userCookie = new SSID(new User(userData));
                      userCookie.create();

                      dispatch(signedUpWithSocial(provider));
                      dispatch(signedInWithSocial(newUser));
                    })
                    .catch(error => {
                      dispatch(signedUpWithSocial(provider));
                      dispatch(signedInWithSocial(newUser));
                      dispatch(sendEmailConfirmationEmailFailed(error, user.email));
                    })
                }
              })
              .catch((error : any) => {
                dispatch(addingDataToUserDbsFailed(error));
              })
          });
      })
      .catch((error : any) => {
        return dispatch(signUpWithSocialFailed(error, provider));
      })
  }
}


// @REMOVE ERRORS
export const removeAuthErrors = () : any => {
  return {
    type: Auth.RemoveErrors
  }
}

// @SEND RESET PASSWORD EMAIL
export const resetPasswordEmailSendInitiated = (email : string) : any => {
  return {
    type: Auth.ResetPasswordEmailSending,
    email
  };
};

export const resetPasswordEmailSendFailed = (error : any, email : string) : any => {
  return {
    type: Auth.ResetPasswordEmailFailed,
    email, error
  };
};

export const resetPasswordEmailSent = (email : string) : any => {
  return {
    type: Auth.ResetPasswordEmailSent,
    email
  };
};

export const doResetPasswordEmailSend = (email : string) : any => {
  return (dispatch : any) => {
    dispatch(resetPasswordEmailSendInitiated(email));

    // send password reset email
    auth.sendPasswordResetEmail(email)
      .then(() => {
        dispatch(resetPasswordEmailSent(email));
      })
      .catch((error : any) => {
        dispatch(resetPasswordEmailSendFailed(error, email));
      });
  }
}

// @SEND EMAIL CONFIRMATION
export const doSendEmailConfirmation = (uid : string, email : string) : any => {
  return (dispatch : any) => {
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
export const linkSocialAccountInitiated = (provider : string) : any => {
  return {
    type: Auth.LinkingSocialAccount,
    provider
  };
};

export const linkSocialAccountFailed = (error : any, provider : string | null) : any => {
  return {
    type: Auth.LinkingSocialAccountFailed,
    error, provider
  };
};

export const socialAccountLinked = (provider : string, credentials : any) : any => {
  return {
    type: Auth.LinkedSocialAccount,
    provider, credentials
  };
};

export const doLinkSocialAccount = (provider : string) : any => {
  return (dispatch : any) => {
    if (!provider)
      return dispatch(linkSocialAccountFailed({ message: "no provider" }, null));

    dispatch(linkSocialAccountInitiated(provider));

    let p : any;
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
      .then((result : any) => {
        dispatch(socialAccountLinked(provider, result.credentials));
      })
      .catch((error : any) => {
        dispatch(linkSocialAccountFailed(error, provider));
      })
  }
}

// UNLINK SOCIAL ACCOUNT
export const unlinkSocialAccountInitiated = (provider : any) : any => {
  return {
    type: Auth.UnlinkingSocialAccount,
    provider
  };
};

export const unlinkSocialAccountFailed = (error : any, provider : string | null) : any => {
  return {
    type: Auth.UnlinkingSocialAccountFailed,
    error, provider
  };
};

export const socialAccountUnlinked = (provider : string) : any => {
  return {
    type: Auth.UnlinkedSocialAccount,
    provider
  };
};

export const doUnlinkSocialAccount = (provider : string) : any => {
  return (dispatch : any) => {
    if (!provider)
      return dispatch(unlinkSocialAccountFailed({ message: "no provider" }, null));

    dispatch(unlinkSocialAccountInitiated(provider));

    auth.onAuthStateChanged((user : any) => {
      if (user) {
        user.unlink(provider)
          .then(() => {
            dispatch(socialAccountUnlinked(provider));
          })
          .catch((error : any) => {
            dispatch(unlinkSocialAccountFailed(error, provider));
          })
      }
    });
  };
};

// LINK PASSWORD PROVIDER
export const addPasswordProviderInitiated = () : any => {
  return {
    type: Auth.AddingPasswordProvider
  };
};

export const addPasswordProviderFailed = (error : any) : any => {
  return {
    type: Auth.AddingPasswordProviderFailed,
    error
  };
};

export const addedPasswordProvider = (credentials : any) : any => {
  return {
    type: Auth.AddedPasswordProvider,
    credentials
  };
};

export const doAddPasswordProvider = (email = "", password = "") : any => {
  return (dispatch : any) => {
    if (!email)
      return dispatch(addPasswordProviderFailed({message: "no email provided"}));
    
    if (!password)
      return dispatch(addPasswordProviderFailed({message: "no password provided"}));

    if (!isEmail(email))
      return dispatch(addPasswordProviderFailed({message: "invalid email provided"}));

    dispatch(addPasswordProviderInitiated());

    const credential = firebase.auth.EmailAuthProvider.credential(email, password);

    auth.currentUser.linkAndRetrieveDataWithCredential(credential)
      .then((userCred : any) => {
        dispatch(addedPasswordProvider(userCred));
      })
      .catch((error : any) => {
        dispatch(addPasswordProviderFailed(error));
      })
  }
}

// CHANGE EMAIL ADDRESS
export const changeEmailAddressInitiated = (nEmail : string) : any => {
  return {
    type: Auth.ChangingEmailAddress,
    nEmail
  };
};

export const changeEmailAddressFailed = (error : any, nEmail : string) : any => {
  return {
    type: Auth.ChangingEmailAddressFailed,
    error, nEmail
  };
};

export const changedEmailAddress = (nEmail : string) : any => {
  return {
    type: Auth.ChangedEmailAddress,
    nEmail
  };
};

export const doChangeEmailAddress = (email : string) : any => {
  return (dispatch : any) => {
    if (!isEmail(email))
      return dispatch(changeEmailAddressFailed({ message: "invalid email address" }, email));

    dispatch(changeEmailAddressInitiated(email));

    const user = auth.currentUser;

    user.updateEmail(email)
      .then(() => {
        dispatch(doUserUpdate({ email, emailConfirmed: false }, user.uid, true));
        dispatch(changedEmailAddress(email));
      })
      .catch((error : any) => {
        dispatch(changeEmailAddressFailed(error, email));
      })
  }
}