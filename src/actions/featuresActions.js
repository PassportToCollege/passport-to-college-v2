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
          return dispatch(featuresGetFailed({ message: "no features found" }));
        
        let data = [];
        snapshots.forEach(snapshot => {
          let docData = snapshot.data();
          docData.fid = snapshot.id;

          data.push(docData);
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

    db.collection("features")
      .where("isActive", "==", true)
      .orderBy("expDate", "desc")
      .get()
      .then(snapshots => {
        if (snapshots.empty)
          return dispatch(featuresGetFailed({ message: "no features found" }));

        let features = [];
        let studentPromises = [];

        snapshots.forEach(snapshot => {
          const feature = snapshot.data();

          studentPromises.push(db.collection("studenrs").doc(feature.student).get());
          features.push(feature);
        });

        Promise.all(studentPromises)
          .then(students => {
            for (let feature of features) {
              feature.student = students.find(student => {
                return student.uid === feature.student;
              });
            }
          });

        dispatch(featuresGetDone(features));
      })
      .catch(error => {
        dispatch(featuresGetFailed(error));
      })
  }
}