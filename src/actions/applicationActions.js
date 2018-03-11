import firebase from "firebase";
import axios from "axios";

import * as types from "./actionTypes";
import { db } from "../utils/firebase";

const Console = console;
const EMAIL_API = process.env.REACT_APP_EMAIL_API;

// GET actions
export const applicationGetInitiated = user => {
  return {
    type: types.APPLICATION_GET_INITIATED,
    user
  };
};

export const applicationGetDone = application => {
  return {
    type: types.APPLICATION_GET_SUCCESS,
    application
  };
};

export const applicationGetFailed = (error, user) => {
  return {
    type: types.APPLICATION_GET_FAILED,
    error, user
  };
};

export const doApplicationGet = user => {
  return dispatch => {
    dispatch(applicationGetInitiated(user));

    db.collection("application")
      .doc(user)
      .get()
      .then(doc => {
        if (doc.exists) {
          dispatch(applicationGetDone(doc.data()));
        } else {
          dispatch(applicationGetFailed("no application found.", user));
        }
      })
      .catch(error => {
        Console.error(error);
        dispatch(applicationGetFailed(error, user));
      })
  }
}

// UPDATE actions
export const applicationUpdateInitiated = (user, data) => {
  return {
    type: types.APPLICATION_UPDATE_INITIATED,
    user, data
  };
};

export const applicationUpdated = (user, data) => {
  return {
    type: types.APPLICATION_UPDATED,
    user, data
  };
};

export const applicationUpdateFailed = (error, user, data) => {
  return {
    type: types.APPLICATION_UPDATE_FAILED,
    error, user, data
  };
};

export const doApplicationUpdateWithoutGet = (user, data) => {
  return dispatch => {
    dispatch(applicationUpdateInitiated(user, data));

    db.collection("application")
      .doc(user)
      .update(data)
      .then(() => {
        dispatch(applicationUpdated(user, data));
      })
      .catch(error => {
        Console.error(error);
        dispatch(applicationUpdateFailed(error, user, data));
      });
  };
};

export const doApplicationUpdate = (user, data) => {
  return dispatch => {
    dispatch(applicationUpdateInitiated(user, data));

    db.collection("application")
      .doc(user)
      .update(data)
      .then(() => {
        dispatch(applicationUpdated(user, data));

        // get application
        dispatch(doApplicationGet(user));
      })
      .catch(error => {
        Console.error(error);
        dispatch(applicationUpdateFailed(error, user, data));
      });
  };
};

export const applicationTestDeleteInitiated = (user, test) => {
  return {
    type: types.APPLICATION_TEST_DELETE_INITIATED,
    user, test
  };
};

export const applicationTestDeleted = (user, test) => {
  return {
    type: types.APPLICATION_TEST_DELETED,
    user, test
  };
};

export const applicationTestDeleteFailed = (error, user, test) => {
  return {
    type: types.APPLICATION_TEST_DELETE_FAILED,
    user, test, error
  };
};

export const doTestDelete = (user, test) => {
  return dispatch => {
    dispatch(applicationTestDeleteInitiated(user, test));

    db.collection("application")
      .doc(user)
      .update({[`tests.${test}`]: firebase.firestore.FieldValue.delete()})
      .then(() => {
        dispatch(applicationTestDeleted(user, test));

        // get application
        dispatch(doApplicationGet(user));
      })
      .catch(error => {
        Console.log(error);
        dispatch(applicationTestDeleteFailed(error, user, test));
      })
  }
}

export const applicationSubmitInitiated = (user, date) => {
  return {
    type: types.APPLICATION_SUBMIT_INITIATED,
    user,
    date
  };
};

export const applicationSubmitted = (user, date) => {
  return {
    type: types.APPLICATION_SUBMITTED,
    user,
    date
  };
};

export const applicationSubmitFailed = (error, user, date) => {
  return {
    type: types.APPLICATION_SUBMIT_FAILED,
    user,
    date,
    error
  };
};

export const sendSubmittedEmailInitated = user => {
  return {
    type: types.APPLICATION_SUBMITTED_EMAIL_INITIATED,
    user
  };
};

export const sendSubmittedEmailSent = user => {
  return {
    type: types.APPLICATION_SUBMITTED_EMAIL_SENT,
    user
  };
};

export const sendSubmittedEmailFailed = (error, user) => {
  return {
    type: types.APPLICATION_SUBMITTED_EMAIL_FAILED,
    user, error
  };
};

export const doApplicationSubmit = (user, date) => {
  return dispatch => {
    dispatch(applicationSubmitInitiated(user, date));

    db.collection("application")
      .doc(user)
      .update({
        submitedOn: date,
        wasSubmitted: true
      })
      .then(() => {
        dispatch(sendSubmittedEmailInitated(user));
        const sendToApplicant = () => {
          return axios.get(`${EMAIL_API}/s/application-submitted/${user}`);
        }

        const sendToAdmins = () => {
          return axios.get(`${EMAIL_API}/s/application-received/${user}`);
        }

        axios.all([sendToApplicant(), sendToAdmins()])
          .then(() => {
            dispatch(sendSubmittedEmailSent(user));
          })
          .catch(error => {
            dispatch(sendSubmittedEmailFailed(error, user));
          });
      })
      .catch(error => {
        Console.error(error);
        dispatch(applicationSubmitFailed(error, user, date));
      });
  }
}