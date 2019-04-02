import iAction from "../imodels/iAction";
import iError from "../imodels/iError";
import Feature from "../models/Feature";
import Student from "../models/Student";
import Post from "../models/Post";
import { PostState } from "../imodels/iPost";

import ActionTypes from "./actionTypes";
import { db } from "../utils/firebase";

const FeaturesActions = ActionTypes.Features;

export const featuresGetInitiated = (student : Student) : iAction => {
  return {
    type: FeaturesActions.GettingFeatures,
    student
  };
};

export const featuresGetFailed = (error : iError, student : Student) : iAction => {
  return {
    type: FeaturesActions.GettingFeaturesFailed,
    error, student
  };
};

export const featuresGetDone = (features : Feature[], student : Student) : iAction => {
  return {
    type: FeaturesActions.GotFeatures,
    features, student
  };
};

export const doGetFeaturesByUser = (student : Student, state : PostState = PostState.all) : any => {
  return (dispatch : any) => {
    dispatch(featuresGetInitiated(student));

    let ref = db.collection("posts")
      .where("isFeature", "==", true)
      .where("student", "==", student.uid);

    switch (state) {
      case PostState.published:
        ref = ref.where("state.published", "==", true);
        break;
      case PostState.archived:
        ref = ref.where("state.archived", "==", true);
        break;
      case PostState.draft:
        ref = ref.where("state.draft", "==", true);
        break;
      case PostState.all:
      default:
        break;
    }

    ref.orderBy("expiration", "desc")
      .get()
      .then((snapshots : firebase.firestore.QuerySnapshot) => {
        if (snapshots.empty)
          return dispatch(featuresGetFailed({ message: "no features found" }, student));
        
        let features : Feature[] = [];
        snapshots.forEach(snapshot => {
          const snapshotData = snapshot.data();
          const feature = new Feature(
            <Post>snapshotData, 
            snapshotData.Student,
            snapshotData.expiration);

          features.push(feature);
        });

        dispatch(featuresGetDone(features, student));
      })
      .catch((error : iError) => {
        dispatch(featuresGetFailed(error, student));
      });
  };
};

export const featuresGetActiveInitiated = () : iAction => {
  return {
    type: FeaturesActions.GettingActiveFeatures
  };
};

export const featuresGetActiveFailed = (error : iError) : iAction => {
  return {
    type: FeaturesActions.GettingActiveFeaturesFailed,
    error
  };
};

export const featuresGetActiveDone = (features : Feature[]) : iAction => {
  return {
    type: FeaturesActions.GettingFeaturesFailed,
    features
  };
};

export const doGetActiveFeatures = (state : PostState = PostState.all) : any => {
  return (dispatch : any) => {
    dispatch(featuresGetActiveInitiated());

    let ref = db.collection("posts").where("isActive", "==", true);

    if (state === PostState.published)
      ref = ref.where("state.published", "==", true);

    ref.orderBy("expiration", "desc")
      .get()
      .then((snapshots : firebase.firestore.QuerySnapshot) => {
        if (snapshots.empty)
          return dispatch(featuresGetActiveFailed({ message: "no features found" }));

        let features: Feature[] = [];
        snapshots.forEach(snapshot => {
          const snapshotData = snapshot.data();
          const feature = new Feature(
            <Post>snapshotData,
            snapshotData.Student,
            snapshotData.expiration);

          features.push(feature);
        });
            
        dispatch(featuresGetActiveDone(features));
      })
      .catch((error : iError) => {
        dispatch(featuresGetActiveFailed(error));
      })
  }
}