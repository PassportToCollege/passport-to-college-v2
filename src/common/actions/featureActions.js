import { db } from "../utils/firebase";
import { deletePostHero } from "../utils/firebase/functions";
import * as types from "./actionTypes";
import * as featuresActions from "./featuresActions";
import { doCategoryPostsUpdate } from "./postCategoryActions";

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
        if (!snapshot.exists)
          return dispatch(featureGetFailed({ message: "no feature found" }, feature));
        
        dispatch(featureGetDone(snapshot.data()));
      })
      .catch(error => {
        dispatch(featureGetFailed(error, feature));
      })
  }
}

// SET actions
export const featureCreationInitiated = data => {
  return {
    type: types.FEATURE_CREATION_INITIATED,
    data
  };
};

export const featureCreated = data => {
  return {
    type: types.FEATURE_CREATED,
    data
  };
};

export const featureCreationFailed = (error, data) => {
  return {
    type: types.FEATURE_CREATION_FAILED,
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