import iAction from "../imodels/iAction";
import iError from "../imodels/iError";
import iFeature from "../imodels/iFeature";
import Feature from "../models/Feature";
import ActionTypes from "./actionTypes";

import { deletePostHero } from "../utils/firebase/functions";
import * as featuresActions from "./featuresActions";
import { db } from "../utils/firebase";
import { doCategoryPostsUpdate } from "./postCategoryActions";

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

export const doCreateFeature = (feature, options) => {
  return dispatch => {
    dispatch(featureCreationInitiated(feature));

    options = options || {};

    db.collection("posts")
      .doc(feature.id)
      .set(feature)
      .then(() => {
        dispatch(featureCreated(feature));

        if (options.refresh)
          return dispatch(featuresActions.doGetFeaturesByUser(feature.student));
      })
      .catch(error => {
        dispatch(featureCreationFailed(error, feature));
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

export const doFeatureUpdate = (feature, data, options) => {
  return dispatch => {
    dispatch(featureUpdateInitiated(feature, data));

    options = options || {};

    db.collection("posts")
      .doc(feature)
      .update(data)
      .then(() => {
        dispatch(featureUpdated(feature, data));

        if (options.refresh && options.student)
          return dispatch(featuresActions.doGetFeaturesByUser(options.student));
      })
      .catch(error => {
        dispatch(featureUpdateFailed(error, feature, data));
      })
  }
}

// DELETE actions
export const featureDeleteInitiated = feature => {
  return {
    type: types.FEATURE_DELETE_INITIATED,
    feature
  };
};

export const featureDeleted = feature => {
  return {
    type: types.FEATURE_DELETED,
    feature
  };
};

export const featureDeleteFailed = (error, feature) => {
  return {
    type: types.FEATURE_DELETE_FAILED,
    feature, error
  };
};

export const doFeatureDelete = (feature, options) => {
  return dispatch => {
    dispatch(featureDeleteInitiated(feature));

    options = options || {};

    return db.collection("posts")
      .doc(feature.id)
      .delete()
      .then(() => {
        if (feature.hasHero)
          deletePostHero(feature.id);

        dispatch(doCategoryPostsUpdate("student_features", "dec"));
        dispatch(featureDeleted(feature));

        if (options.refresh)
          return dispatch(featuresActions.doGetFeaturesByUser(feature.student));
      })
      .catch(error => {
        dispatch(featureDeleteFailed(error, feature));
      });
  };
};