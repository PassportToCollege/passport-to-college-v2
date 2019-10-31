import { Action } from '..';
import { Auth } from '../actionTypes';
import { AuthState } from '../../imodels/iAppState';
import { Dispatch } from 'react';
import axios, { AxiosPromise } from 'axios';
import firebase from 'firebase';
import { isEmail } from '../../utils';
import { auth, db } from '../../utils/firebase/index';
import SSID from '../../models/SSID';
import User from '../../models/User';
import iUser from '../../imodels/iUser';
import Cookies from 'universal-cookie';
import { doUserUpdate } from '../userActions';
import { 
  signInAuthorizing, 
  gettingUser, 
  signedIn,
  signInFailed,
  signInAuthorizingSocial,
  signInFailedSocial,
  signedInSocial,
  signOutAuthorizing,
  signedOut,
  signOutFailed,
  creatingAccount,
  addingToDb,
  accountCreatedEmailSending,
  addedToDb,
  createdAccount,
  accountCreatedEmailSent,
  accountCreatedEmailFailed,
  addingToDbFailed,
  creatingAccountFailed,
  creatingAccountSocial,
  creatingAccountFailedSocial,
  createdAccountSocial,
  resetPasswordEmailSending,
  resetPasswordEmailSent,
  resetPasswordEmailFailed,
  linkingSocialAccount,
  linkingSocialAccountFailed,
  linkedSocialAccount,
  unlinkingSocialAccountFailed,
  unlinkingSocialAccount,
  unlinkedSocialAccount,
  addingPasswordProviderFailed,
  addingPasswordProvider,
  addedPasswordProvider,
  changingEmailAddress,
  changingEmailAddressFailed,
  changedEmailAddress
} from './actions';

const cookies: any = new Cookies();
const EMAIL_API: string = process.env.REACT_APP_EMAIL_API || '';

type ValidProvider = 'google' | 'facebook' | 'github' | 'twitter';

export interface AuthOptions {
  strict?: 'isAdmin' | 'isStudent' | 'isStaff' | 'isApplicant';
  match?: string;
}

export const doSignIn = (
  dispatch: Dispatch<Action<Auth, AuthState>>,
  email: string, 
  password: string) => {
    dispatch(signInAuthorizing());

    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential: firebase.auth.UserCredential) => {
        dispatch(gettingUser());

        const { uid } = userCredential.user!;

        db.collection('users')
          .doc(uid)
          .get()
          .then((doc: firebase.firestore.DocumentSnapshot) => {
            if (doc.exists) {
              const user: User = new User({
                uid,
                ...doc.data() as any
              });

              const ssid = new SSID(user);
              ssid.create();

              dispatch(signedIn(user));
            }
          });
      })
      .catch((error: Error) => {
        dispatch(signInFailed(error));
      });
};

export const doSignInWithSocial = (
  dispatch: Dispatch<Action<Auth, AuthState>>, 
  provider?: ValidProvider, 
  options?: AuthOptions) => {
    dispatch(signInAuthorizingSocial());

    let p: firebase.auth.AuthProvider;
    switch (provider) {
      case 'google':
        p = new firebase.auth.GoogleAuthProvider();
        break;
      case 'facebook':
        p = new firebase.auth.FacebookAuthProvider();
        break;
      default:
        return signInFailedSocial(new Error('unknown provider'));
    }

    return auth.signInWithPopup(p)
      .then((userCredential: firebase.auth.UserCredential) => {
        if (!userCredential.user) {
          signInFailedSocial(new Error('No user credentials found'));
        } else {
          const { user: _user } = userCredential;
          const { uid } = _user;

          db.collection('users')
            .doc(userCredential.user.uid)
            .get()
            .then(async (snapshot: firebase.firestore.DocumentSnapshot) => {
              if (snapshot.exists) {
                const user: User = new User({
                  uid,
                  ...snapshot.data() as any
                });
                
                if (options) {
                  if (options.match && options.match !== user.uid) {
                    await auth.signOut().then(() => {
                      dispatch(signInFailedSocial(new Error('incorrect account signed in')));
                    });
                  }
    
                  if (options.strict && !user[options.strict]) {
                    await auth.signOut().then(() => {
                      dispatch(signInFailedSocial(new Error('user type mismatch')));
                    });
                  }
                } else {
                  const userCookie = new SSID(user);
                  userCookie.create();
    
                  dispatch(signedInSocial(user));
                }
  
              } else {
                _user.delete().then(() => {
                  dispatch(signInFailedSocial(new Error('user not found')));
                });
              }
            });
        }
      })
      .catch((error: Error) => {
        return dispatch(signInFailedSocial(error));
      });

};

export const doSignOut = (dispatch: Dispatch<Action<Auth, AuthState>>) => {
    dispatch(signOutAuthorizing());

    auth.signOut()
      .then(() => {
        cookies.remove('ssid', { path: '/' });
        dispatch(signedOut());
      })
      .catch((error: Error) => {
        dispatch(signOutFailed(error));
      });
};

const doSendWelcomeEmail = (
  dispatch: Dispatch<Action<Auth, AuthState>>,
  user: User
): AxiosPromise<any> => {
  dispatch(accountCreatedEmailSending());

  return axios.get(`${EMAIL_API}/s/welcome/${user.uid}`);
};

export const doAccountCreate = (
  dispatch: Dispatch<Action<Auth, AuthState>>,
  email: string,
  password: string, 
  newUser: User) => {
    dispatch(creatingAccount());

    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential: firebase.auth.UserCredential) => {
        const { user } = userCredential;
        const batch = db.batch();
        const userRef = db.collection('users').doc(user!.uid);

        batch.set(userRef, newUser.data);

        if (newUser.isApplicant) {
          batch.set(db.collection('applications').doc(newUser.uid), {
            uid: user!.uid,
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
          batch.set(db.collection('students').doc(user!.uid), {
            uid: user!.uid,
            user: newUser.data
          });
        }

        if (newUser.uid && newUser.uid.indexOf('temp') > -1) {
          batch.delete(db.collection('users').doc(newUser.uid));
        }

        dispatch(addingToDb());

        batch.commit()
          .then(() => {
            dispatch(addedToDb());
            dispatch(createdAccount());

            if (newUser.isApplicant) {
              doSendWelcomeEmail(dispatch, newUser)
                .then(() => {
                  dispatch(accountCreatedEmailSent());
                })
                .catch((error: Error) => {
                  dispatch(accountCreatedEmailFailed(error));
                });
            }
          })
          .catch((error: Error) => {
            dispatch(addingToDbFailed(error));
          });
      })
      .catch((error: Error) => {
        dispatch(creatingAccountFailed(error));
      });
};

export const doSignUpWithSocial = (
  dispatch: Dispatch<Action<Auth, AuthState>>,
  provider?: ValidProvider) => {
    dispatch(creatingAccountSocial());

    let p: firebase.auth.AuthProvider;
    switch (provider) {
      case 'google':
        p = new firebase.auth.GoogleAuthProvider();
        break;
      case 'facebook':
        p = new firebase.auth.FacebookAuthProvider();
        break;
      default:
        creatingAccountFailedSocial(new Error('unknown provider'));
        return;
    }

    auth.signInWithPopup(p)
      .then(async (userCredential: firebase.auth.UserCredential) => {
        const { user: _user } = userCredential;

        db.collection('users')
          .doc(_user!.uid)
          .get()
          .then((snapshot: firebase.firestore.DocumentSnapshot) => {
            if (snapshot.exists) {
              const user = new User(snapshot.data() as iUser);

              if (user.isAdmin || user.isApplicant || user.isStudent) {
                auth.signOut().then(() => {
                  dispatch(creatingAccountFailedSocial(new Error('user already exists')));
                });
              }
            }

            if (!snapshot.exists) {
              dispatch(addingToDb());

              const newUser = new User({
                uid: _user!.uid,
                email: _user!.email || '',
                name: _user!.displayName || '',
                photo: _user!.photoURL || ''
              });

              db.collection('users')
                .doc(newUser.uid)
                .set(newUser.data, { merge: true })
                .then(() => {
                  dispatch(addedToDb());
                  dispatch(createdAccountSocial());
                })
                .catch((error: Error) => {
                  dispatch(addingToDbFailed(error));
                });
            }
      })
      .catch((error: Error) => {
        return dispatch(creatingAccountFailedSocial(error));
      });
    });
};

export const doResetPasswordEmailSend = (
  dispatch: Dispatch<Action<Auth, AuthState>>,
  email: string) => {
    dispatch(resetPasswordEmailSending());

    auth.sendPasswordResetEmail(email)
      .then(() => {
        dispatch(resetPasswordEmailSent());
      })
      .catch((error: Error) => {
        dispatch(resetPasswordEmailFailed(error));
      });
};

// @SEND EMAIL CONFIRMATION
export const doSendEmailConfirmation = (
  dispatch: Dispatch<Action<Auth, AuthState>>,
  uid: string) => {
    dispatch(accountCreatedEmailSending());

    axios.get(`${EMAIL_API}/s/confirm-email/${uid}`)
      .then(() => {
        dispatch(accountCreatedEmailSent());
      })
      .catch((error: Error) => {
        dispatch(accountCreatedEmailFailed(error));
      });
};

export const doLinkSocialAccount = (
  dispatch: Dispatch<Action<Auth, AuthState>>,
  provider?: ValidProvider) => {
    dispatch(linkingSocialAccount());

    let p: firebase.auth.AuthProvider;
    switch (provider) {
      case 'google':
        p = new firebase.auth.GoogleAuthProvider();
        break;
      case 'facebook':
        p = new firebase.auth.FacebookAuthProvider();
        break;
      case 'github':
        p = new firebase.auth.GithubAuthProvider();
        break;
      case 'twitter':
        p = new firebase.auth.TwitterAuthProvider();
        break;
      default:
        linkingSocialAccountFailed(new Error('unknown provider'));
        return;
    }

    auth.currentUser!.linkWithPopup(p)
      .then(() => {
        dispatch(linkedSocialAccount());
      })
      .catch((error: Error) => {
        dispatch(linkingSocialAccountFailed(error));
      });
};

export const doUnlinkSocialAccount = (
  dispatch: Dispatch<Action<Auth, AuthState>>,
  provider?: ValidProvider) => {
    if (!provider) {
      dispatch(unlinkingSocialAccountFailed(new Error('no provider')));
    }

    dispatch(unlinkingSocialAccount());

    auth.onAuthStateChanged((user: any) => {
      if (user) {
        user.unlink(provider)
          .then(() => {
            dispatch(unlinkedSocialAccount());
          })
          .catch((error: Error) => {
            dispatch(unlinkingSocialAccountFailed(error));
          });
      }
    });
};

export const doAddPasswordProvider = (
  dispatch: Dispatch<Action<Auth, AuthState>>,
  email = '', 
  password = '') => {
    if (!email) {
      dispatch(addingPasswordProviderFailed(new Error('no email provided')));
      return;
    }

    if (!password) {
      dispatch(addingPasswordProviderFailed(new Error('no password provided')));
      return;
    }

    if (!isEmail(email)) {
      dispatch(addingPasswordProviderFailed(new Error('invalid email provided')));
    }

    dispatch(addingPasswordProvider());

    const credential = firebase.auth.EmailAuthProvider.credential(email, password);

    auth.currentUser!.linkAndRetrieveDataWithCredential(credential)
      .then(() => {
        dispatch(addedPasswordProvider());
      })
      .catch((error: Error) => {
        dispatch(addingPasswordProviderFailed(error));
      });
};

export const doChangeEmailAddress = (
  dispatch: Dispatch<Action<Auth, AuthState>>,
  email: string) => {
    if (!isEmail(email)) {
      dispatch(changingEmailAddressFailed(new Error('invalid email address')));
      return;
    }

    dispatch(changingEmailAddress());

    const user = auth.currentUser;

    if (user) {
      user.updateEmail(email)
        .then(() => {
          dispatch(doUserUpdate({ email, emailConfirmed: false }, user.uid, true));
          dispatch(changedEmailAddress());
        })
        .catch((error: Error) => {
          dispatch(changingEmailAddressFailed(error));
        });
    }
};