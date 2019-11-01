import { Dispatch } from 'react';
import { Features as _ } from '../actionTypes';
import { Action } from '..';
import { FeaturesState } from '../../imodels/iAppState';
import Feature from '../../models/Feature';
import Student from '../../models/Student';
import Post from '../../models/Post';
import { db } from '../../utils/firebase';
import { PostState } from '../../imodels/iPost';
import { gettingFeatures, gettingFeaturesFailed, gotFeatures } from './actions';

export const doGetFeaturesByUser = (
  dispatch: Dispatch<Action<_, FeaturesState>> | Dispatch<Action<any, any>>,
  student: Student,
  state: PostState = PostState.all
) => {
  dispatch(gettingFeatures());

  let ref = db.collection('posts')
    .where('isFeature', '==', true)
    .where('student', '==', student.uid);

  switch (state) {
    case PostState.published:
      ref = ref.where('state.published', '==', true);
      break;
    case PostState.archived:
      ref = ref.where('state.archived', '==', true);
      break;
    case PostState.draft:
      ref = ref.where('state.draft', '==', true);
      break;
    case PostState.all:
    default:
      break;
  }

  ref.orderBy('expiration', 'desc')
    .get()
    .then((snapshots: firebase.firestore.QuerySnapshot) => {
      if (snapshots.empty) {
        dispatch(gettingFeaturesFailed(new Error('no features found')));
      } else {
        const features: Feature[] = [];
        snapshots.forEach((snapshot) => {
          const snapshotData = snapshot.data();
          const feature = new Feature(
             snapshotData as Post,
            snapshotData.Student,
            snapshotData.expiration);
  
          features.push(feature);
        });
  
        dispatch(gotFeatures(features));
      }
    })
    .catch((error: Error) => {
      dispatch(gettingFeaturesFailed(error));
    });
};

export const doGetActiveFeatures = (
  dispatch: Dispatch<Action<_, FeaturesState>>,
  state: PostState = PostState.all
) => {
  dispatch(gettingFeatures());

  let ref = db.collection('posts').where('isActive', '==', true);

  if (state === PostState.published) {
    ref = ref.where('state.published', '==', true);
  }

  ref.orderBy('expiration', 'desc')
    .get()
    .then((snapshots: firebase.firestore.QuerySnapshot) => {
      if (snapshots.empty) {
        dispatch(gettingFeaturesFailed(new Error('no active features found')));
      } else {
        const features: Feature[] = [];

        snapshots.forEach((snapshot) => {
          const snapshotData = snapshot.data();
          const feature = new Feature(
             snapshotData as Post,
            snapshotData.Student,
            snapshotData.expiration);
  
          features.push(feature);
        });
  
        dispatch(gotFeatures(features));
      }
    })
    .catch((error: Error) => {
      dispatch(gettingFeaturesFailed(error));
    });
};