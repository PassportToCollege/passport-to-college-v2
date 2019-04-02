import iAction from "../imodels/iAction";
import iError from "../imodels/iError";
import iFeature from "../imodels/iFeature";
import Feature from "../models/Feature";
import Student from "../models/Student";
import ActionTypes from "./actionTypes";

import { deletePostHero } from "../utils/firebase/functions";
import * as featuresActions from "./featuresActions";
import { db } from "../utils/firebase";
import { doCategoryPostsUpdate } from "./postCategoryActions";
import { PostUpdateType } from "../imodels/iPost";

const FeatureActions = ActionTypes.Feature;

// GET actions
export const featureGetInitiated = (id : string) : iAction => {
  return {
    type: FeatureActions.GettingFeature,
    id
  };
};

export const featureGetFailed = (error : iError, id : string) : iAction => {
  return {
    type: FeatureActions.GettingFeatureFailed,
    error, id
  };
};

export const featureGetDone = (feature : Feature) : iAction => {
  return {
    type: FeatureActions.GotFeature,
    feature
  };
};

export const doFeatureGet = (id : string) : any => {
  return (dispatch : any) => {
    dispatch(featureGetInitiated(id));

    db.collection("features")
      .doc(id)
      .get()
      .then((snapshot : firebase.firestore.QueryDocumentSnapshot) => {
        if (!snapshot.exists)
          return dispatch(featureGetFailed({ message: "no feature found" }, id));
        
        const snapshotData = <Feature>snapshot.data();
        const feature = new Feature(snapshotData, snapshotData.Student, snapshotData.expiration, snapshotData.isActive);
        dispatch(featureGetDone(feature));
      })
      .catch((error : iError) => {
        dispatch(featureGetFailed(error, id));
      })
  }
}

// SET actions
export const featureCreationInitiated = (data : iFeature) : iAction => {
  return {
    type: FeatureActions.Creatingfeature,
    data
  };
};

export const featureCreated = (data : iFeature) : iAction => {
  return {
    type: FeatureActions.CreatedFeature,
    data
  };
};

export const featureCreationFailed = (error : iError, data : iFeature) : iAction => {
  return {
    type: FeatureActions.CreatingfeatureFailed,
    error, data
  };
};

export const doCreateFeature = (feature : iFeature, refresh : boolean = false) : any => {
  return (dispatch : any) => {
    dispatch(featureCreationInitiated(feature));

    db.collection("posts")
      .doc(feature.id)
      .set(feature)
      .then(() => {
        dispatch(featureCreated(feature));

        if (refresh)
          return dispatch(featuresActions.doGetFeaturesByUser(<Student>feature.Student));
      })
      .catch((error : iError) => {
        dispatch(featureCreationFailed(error, feature));
      })
  }
}


// UPDATE actions
export const featureUpdateInitiated = (feature : Feature, data : any) : iAction => {
  return {
    type: FeatureActions.UpdatingFeature,
    feature, data
  };
};

export const featureUpdated = (feature : Feature, data : any) : iAction => {
  return {
    type: FeatureActions.UpdatedFeature,
    feature, data
  };
};

export const featureUpdateFailed = (error : iError, feature : Feature, data : any) : iAction => {
  return {
    type: FeatureActions.UpdatingFeatureFailed,
    feature, data, error
  };
};

export const doFeatureUpdate = (feature : Feature, data : any, refresh : boolean = false) : any => {
  return (dispatch : any) => {
    dispatch(featureUpdateInitiated(feature, data));

    db.collection("posts")
      .doc(feature.id)
      .update(data, { merge: true })
      .then(() => {
        dispatch(featureUpdated(feature, data));

        if (refresh)
          return dispatch(featuresActions.doGetFeaturesByUser(feature.Student));
      })
      .catch((error : iError) => {
        dispatch(featureUpdateFailed(error, feature, data));
      })
  }
}

// DELETE actions
export const featureDeleteInitiated = (feature : Feature) : iAction => {
  return {
    type: FeatureActions.DeletingFeature,
    feature
  };
};

export const featureDeleted = (feature : Feature) : iAction => {
  return {
    type: FeatureActions.DeletedFeature,
    feature
  };
};

export const featureDeleteFailed = (error : iError, feature : Feature) : iAction => {
  return {
    type: FeatureActions.DeletingFeatureFailed,
    feature, error
  };
};

export const doFeatureDelete = (feature : Feature, refresh : boolean = false) : any => {
  return (dispatch : any) => {
    dispatch(featureDeleteInitiated(feature));

    return db.collection("posts")
      .doc(feature.id)
      .delete()
      .then(() => {
        if (feature.hasHero)
          deletePostHero(feature.id);

        dispatch(doCategoryPostsUpdate("student_features", PostUpdateType.Decrease));
        dispatch(featureDeleted(feature));

        if (refresh)
          return dispatch(featuresActions.doGetFeaturesByUser(feature.Student));
      })
      .catch((error : iError) => {
        dispatch(featureDeleteFailed(error, feature));
      });
  };
};