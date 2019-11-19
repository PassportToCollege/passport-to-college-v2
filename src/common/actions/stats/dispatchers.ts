import { Dispatch } from 'react';
import { Action } from '..';
import { Stats } from '../actionTypes';
import { StatsState } from '../../imodels/iAppState';
import { gettingStats, gotStats, gettingStatsFailed } from './actions';
import { db } from '../../utils/firebase';
import iStats from '../../imodels/iStats';

export const doGetStats = (dispatch: Dispatch<Action<Stats, StatsState>>) => {
  dispatch(gettingStats());

  db.collection('stats')
    .doc('all')
    .get()
    .then((doc: firebase.firestore.DocumentSnapshot) => {
      if (doc.exists) {
        const stats = doc.data() as iStats;
        dispatch(gotStats(stats));

        return;
      }

      dispatch(gettingStatsFailed(new Error('no stats found')));
    })
    .catch((error: Error) => {
      dispatch(gettingStatsFailed(error));
    });
};