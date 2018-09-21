import { db } from "../utils/firebase";
import * as types from "./actionTypes";

// GET actions
export const featuresGetInitiated = student => {
  return {
    type: types.FEATURES_GET_BY_USER_INITIATED,
    student
  };
};

export const featuresGetFailed = (error, student) => {
  return {
    type: types.FEATURES_GET_BY_USER_FAILED,
    error, student
  };
};

export const featuresGetDone = (features, student) => {
  return {
    type: types.FEATURES_GET_BY_USER_SUCCESS,
    features, student
  };
};

export const doGetFeaturesByUser = (student, state = "all") => {
  return dispatch => {
    if (!student.length)
      return dispatch(featuresGetFailed({ message: "no student provided" }, null));

    dispatch(featuresGetInitiated(student));

    let ref = db.collection("posts")
      .where("isFeature", "==", true)
      .where("student", "==", student);

    switch (state) {
      case "published":
        ref = ref.where("state.published", "==", true);
        break;
      case "archived":
        ref = ref.where("state.archived", "==", true);
        break;
      case "draft":
        ref = ref.where("state.draft", "==", true);
        break;
      case "all":
      default:
        break;
    }

    ref.orderBy("expiration", "desc")
      .get()
      .then(snapshots => {
        if (snapshots.empty)
          return dispatch(featuresGetFailed({ message: "no features found" }, student));
        
        let data = [];
        snapshots.forEach(snapshot => {
          data.push(snapshot.data());
        });

        dispatch(featuresGetDone(data, student));
      })
      .catch(error => {
        dispatch(featuresGetFailed(error, student));
      });
  };
};

export const featuresGetActiveInitiated = () => {
  return {
    type: types.FEATURES_GET_ACTIVE_INITIATED
  };
};

export const featuresGetActiveFailed = error => {
  return {
    type: types.FEATURES_GET_ACTIVE_FAILED,
    error
  };
};

export const featuresGetActiveDone = features => {
  return {
    type: types.FEATURES_GET_ACTIVE_SUCCESS,
    features
  };
};

export const doGetActiveFeatures = (state = "all") => {
  return dispatch => {
    dispatch(featuresGetActiveInitiated());

    let ref = db.collection("posts").where("isActive", "==", true);

    if (state === "published")
      ref = ref.where("state.published", "==", true);

    ref.orderBy("expiration", "desc")
      .get()
      .then(snapshots => {
        if (snapshots.empty)
          return dispatch(featuresGetActiveFailed({ message: "no features found" }));

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
            
            dispatch(featuresGetActiveDone(features));
          });
      })
      .catch(error => {
        dispatch(featuresGetActiveFailed(error));
      })
  }
}