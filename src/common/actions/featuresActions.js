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

    db.collection("posts")
      .where("state.puplished", "==", true)
      .where("isFeature", "==", true)
      .where("student", "==", student)
      .orderBy("expiration", "desc")
      .get()
      .then(snapshots => {
        if (snapshots.empty)
          return dispatch(featuresGetFailed({ message: "no features found" }));
        
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

export const doGetActiveFeatures = () => {
  return dispatch => {
    dispatch(featuresGetInitiated());

    db.collection("posts")
      .where("isActive", "==", true)
      .orderBy("expiration", "desc")
      .get()
      .then(snapshots => {
        if (snapshots.empty)
          return dispatch(featuresGetFailed({ message: "no features found" }));

        let features = [];
        let studentPromises = [];

        snapshots.forEach(snapshot => {
          let feature = snapshot.data();
          feature.id = snapshot.id;

          studentPromises.push(db.collection("students").doc(feature.student).get());
          features.push(feature);
        });

        Promise.all(studentPromises)
          .then(students => {
            for (let feature of features) {
              feature.student = students.find(student => {
                return student.id === feature.student
              });

              feature.student = feature.student.data();
            }
            
            dispatch(featuresGetDone(features));
          });
      })
      .catch(error => {
        dispatch(featuresGetFailed(error));
      })
  }
}