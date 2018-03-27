import { db } from "../utils/firebase";
import * as types from "./actionTypes";

// GET actions
export const featureGetInitiated = feature => {
  return {
    type: types.FEATURE_GET_INITIATED,
    feature
  };
};

export const featureGetFailed = (error, feature) => {
  return {
    type: types.FEATURE_GET_FAILED,
    error, feature
  };
};

export const featureGetDone = feature => {
  return {
    type: types.FEATURE_GET_SUCCESS,
    feature
  };
};

export const doFeatureGet = feature => {
  return dispatch => {
    dispatch(featureGetInitiated(feature));

    db.collection("features")
      .doc(feature)
      .get()
      .then(snapshot => {
        if (snapshot.exists)
          return dispatch(featureGetDone(snapshot.data()));

        return dispatch(featureGetFailed({ message: "no feature found" }, feature));
      })
      .catch(error => {
        dispatch(featureGetFailed(error, feature));
      })
  }
}


// UPDATE actions
export const featureUpdateInitiated = (feature, data) => {
  return {
    type: types.FEATURE_UPDATE_INITIATED,
    feature, data
  };
};

export const featureUpdated = (feature, data) => {
  return {
    type: types.FEATURE_UPDATED,
    feature, data
  };
};

export const featureUpdateFailed = (error, feature, data) => {
  return {
    type: types.FEATURE_UPDATE_INITIATED,
    feature, data, error
  };
};

export const doFeatureUpdate = (feature, data) => {
  return dispatch => {
    dispatch(featureUpdateInitiated(feature, data));

    db.collection("features")
      .doc(feature)
      .update(data)
      .then(() => {
        dispatch(featureUpdated(feature, data));
      })
      .catch(error => {
        dispatch(featureUpdateFailed(error, feature, data));
      })
  }
}