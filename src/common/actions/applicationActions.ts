import firebase from "firebase";
import axios from "axios";

import ActionTypes from "./actionTypes";
import User from "../models/User";
import Application from "../models/Application";
import iTest from "../imodels/iTest";

import { db } from "../utils/firebase";

const Console = console;
const EMAIL_API = process.env.REACT_APP_EMAIL_API;
const ApplicationActions  = ActionTypes.Application;

// GET actions
export const applicationGetInitiated = (user : User) : any => {
  return {
    type: ApplicationActions.GettingApplication,
    user
  };
};

export const applicationGetDone = (application : Application) : any => {
  return {
    type: ApplicationActions.GotApplication,
    application
  };
};

export const applicationGetFailed = (error : any, user : User) : any => {
  return {
    type: ApplicationActions.GettingApplicationFailed,
    error, user
  };
};

export const doApplicationGet = (user : User) : any => {
  return (dispatch : any) => {
    dispatch(applicationGetInitiated(user));

    db.collection("applications")
      .doc(user._uid)
      .get()
      .then((doc : any) => {
        if (doc.exists) {
          dispatch(applicationGetDone(doc.data()));
        } else {
          dispatch(applicationGetFailed("no application found.", user));
        }
      })
      .catch((error : any) => {
        Console.error(error);
        dispatch(applicationGetFailed(error, user));
      })
  }
}

// UPDATE actions
export const applicationUpdateInitiated = (user : User, newData : any) : any => {
  return {
    type: ApplicationActions.UpdatingApplication,
    user, 
    data : newData
  };
};

export const applicationUpdated = (user : User, newData : any) : any => {
  return {
    type: ApplicationActions.UpdatedApplication,
    user, 
    data : newData
  };
};

export const applicationUpdateFailed = (error : any, user : User, newData : any) : any => {
  return {
    type: ApplicationActions.UpdatingApplicationFailed,
    error, user, 
    data : newData
  };
};

export const doApplicationUpdate = (user : User, newData : any, refresh : boolean = false) : any => {
  return (dispatch : any) => {
    dispatch(applicationUpdateInitiated(user, newData));

    db.collection("applications")
      .doc(user._uid)
      .update(newData)
      .then(() => {
        dispatch(applicationUpdated(user, newData));

        // get application
        if (refresh)
          dispatch(doApplicationGet(user));
      })
      .catch((error : any) => {
        Console.error(error);
        dispatch(applicationUpdateFailed(error, user, newData));
      });
  };
};

export const applicationTestDeleteInitiated = (user : User, test : iTest) : any => {
  return {
    type: ApplicationActions.DeletingTest,
    user, 
    test
  };
};

export const applicationTestDeleted = (user : User, test : iTest) : any => {
  return {
    type: ApplicationActions.DeletedTest,
    user, test
  };
};

export const applicationTestDeleteFailed = (error : any, user : User, test : iTest) : any => {
  return {
    type: ApplicationActions.DeletingTestFailed,
    user, test, error
  };
};

export const doTestDelete = (user : User, test : iTest) : any => {
  return (dispatch : any) => {
    dispatch(applicationTestDeleteInitiated(user, test));

    db.collection("applications")
      .doc(user)
      .update({[`tests.${test.slug}`]: firebase.firestore.FieldValue.delete()})
      .then(() => {
        dispatch(applicationTestDeleted(user, test));

        // get application
        dispatch(doApplicationGet(user));
      })
      .catch((error : any) => {
        Console.log(error);
        dispatch(applicationTestDeleteFailed(error, user, test));
      })
  }
}

export const applicationSubmitInitiated = (user : User, date : Date) : any => {
  return {
    type: ApplicationActions.SubmittingApplication,
    user,
    date
  };
};

export const applicationSubmitted = (user : User, date : Date) : any => {
  return {
    type: ApplicationActions.SubmittedApplication,
    user,
    date
  };
};

export const applicationSubmitFailed = (error : any, user : User, date : Date) : any => {
  return {
    type: ApplicationActions.SubmittingApplicationFailed,
    user,
    date,
    error
  };
};

export const sendSubmittedEmailInitated = (user : User) : any => {
  return {
    type: ApplicationActions.SendingSubmissionEmail,
    user
  };
};

export const sendSubmittedEmailSent = (user : User) : any => {
  return {
    type: ApplicationActions.SentSubmissionEmail,
    user
  };
};

export const sendSubmittedEmailFailed = (error : any, user : User) : any => {
  return {
    type: ApplicationActions.SendingSubmissionEmailFailed,
    user, error
  };
};

export const doApplicationSubmit = (user : User, date : Date) => {
  return (dispatch : any) => {
    dispatch(applicationSubmitInitiated(user, date));

    db.collection("applications")
      .doc(user)
      .update({
        submittedOn: date.getTime(),
        wasSubmitted: true,
        state: {
          draft: false,
          pending: true,
          accepted: false,
          rejected: false
        }
      })
      .then(() => {
        dispatch(applicationSubmitted(user, date));
        dispatch(sendSubmittedEmailInitated(user));
        
        const sendToApplicant = () => {
          return axios.get(`${EMAIL_API}/s/application-submitted/${user._uid}`);
        }

        const sendToAdmins = () => {
          return axios.get(`${EMAIL_API}/s/application-received/${user._uid}`);
        }

        axios.all([sendToApplicant(), sendToAdmins()])
          .then(() => {
            dispatch(sendSubmittedEmailSent(user));

            // get application
            dispatch(doApplicationGet(user));
          })
          .catch(error => {
            Console.error(error);
            dispatch(sendSubmittedEmailFailed(error, user));
          });
      })
      .catch((error : any) => {
        Console.error(error);
        dispatch(applicationSubmitFailed(error, user, date));
      });
  }
}