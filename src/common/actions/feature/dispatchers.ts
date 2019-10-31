import { Dispatch } from 'react';
import { Feature as _ } from '../actionTypes';
import { Action } from '..';
import Feature from '../../models/Feature';
import { FeatureState } from '../../imodels/iAppState';
import { 
  gettingFeature, 
  gettingFeatureFailed, 
  gotFeature,
  creatingFeature,
  createdFeature,
  creatingFeatureFailed,
  updatingFeature,
  updatedFeature,
  updatingFeatureFailed,
  deletingFeature,
  deletedFeature,
  deletingFeatureFailed
} from './actions';
import { db } from '../../utils/firebase';
import { doGetFeaturesByUser } from '../featuresActions';
import iFeature from '../../imodels/iFeature';
import { deletePostHero } from '../../utils/firebase/functions';
import { doCategoryPostsUpdate } from '../postCategoryActions';
import { PostUpdateType } from '../../imodels/iPost';

export const doGetFeature = (
  dispatch: Dispatch<Action<_, FeatureState>>,
  id: string) => {
  dispatch(gettingFeature());

  db.collection('features')
    .doc(id)
    .get()
    .then((snapshot: firebase.firestore.DocumentSnapshot) => {
      if (!snapshot.exists) {
        dispatch(gettingFeatureFailed(new Error('no feature found')));
      } else {
        const snapshotData = snapshot.data() as Feature;
        const feature = new Feature(
          snapshotData, 
          snapshotData.Student, 
          snapshotData.expiration, 
          snapshotData.isActive
        );
        dispatch(gotFeature(feature));
      }
    })
    .catch((error: Error) => {
      dispatch(gettingFeatureFailed(error));
    });
  };

export const doCreateFeature = (
    dispatch: Dispatch<Action<_, FeatureState>>,
    feature: Feature,
    refresh: boolean = false
  ) => {
    dispatch(creatingFeature());

    db.collection('posts')
      .doc(feature.id)
      .set(feature)
      .then(() => {
        dispatch(createdFeature());

        if (refresh) {
          return dispatch(doGetFeaturesByUser(feature.Student));
        }
      })
      .catch((error: Error) => {
        dispatch(creatingFeatureFailed(error));
      });
};

export const doUpdateFeature = (
  dispatch: Dispatch<Action<_, FeatureState>>,
  feature: Feature,
  data: iFeature,
  refresh: boolean = false
) => {
  dispatch(updatingFeature());

  db.collection('posts')
    .doc(feature.id)
    .update(data)
    .then(() => {
      dispatch(updatedFeature());

      if (refresh) {
        dispatch(doGetFeaturesByUser(feature.Student));
      }
    })
    .catch((error: Error) => {
      dispatch(updatingFeatureFailed(error));
    });
};

export const doDeleteFeature = (
  dispatch: Dispatch<Action<_, FeatureState>>,
  feature: Feature,
  refresh: boolean = false
) => {
  dispatch(deletingFeature());

  db.collection('posts')
    .doc(feature.id)
    .delete()
    .then(() => {
      if (feature.hasHero) {
        deletePostHero(feature.id);
      }

      dispatch(doCategoryPostsUpdate('student_features', PostUpdateType.Decrease));
      dispatch(deletedFeature());

      if (refresh) {
        dispatch(doGetFeaturesByUser(feature.Student));
      }
    })
    .catch((error: Error) => {
      dispatch(deletingFeatureFailed(error));
    });
};