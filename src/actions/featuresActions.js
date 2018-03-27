import { db } from "../utils/firebase";
import * as types from "./actionTypes";

// GET actions
export const featuresGetInitiated = () => {
  return {
    type: types.FEATURES_GET_INITIATED
  };
};

export const featuresGetFailed = error => {
  return {
    type: types.FEATURES_GET_FAILED,
    error
  };
};

export const featuresGetDone = features => {
  return {
    type: types.FEATURES_GET_SUCCESS,
    features
  };
};

export const doGetFeaturesByUser = student => {
  return dispatch => {
    dispatch(featuresGetInitiated());

    db.collection("features")
      .where("student", "==", student)
      .orderBy("expDate", "desc")
      .get()
      .then(snapshots => {
        if (snapshots.empty)
          return dispatch(featuresGetFailed({ message: `no featured found for ${student}` }));
        
        let data = [];
        snapshots.forEach(snapshot => {
          data.push(snapshot.data());
        });

        dispatch(featuresGetDone(data));
      })
      .catch(error => {
        dispatch(featuresGetFailed(error));
      });
  };
};