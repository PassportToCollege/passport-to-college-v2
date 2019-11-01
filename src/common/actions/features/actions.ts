import { ActionCreator } from '..';
import { Features as _ } from '../actionTypes';
import { FeaturesState } from '../../imodels/iAppState';
import Feature from '../../models/Feature';

export const gettingFeatures = () =>
  ActionCreator<_>(_.GettingFeatures);

export const gettingFeaturesFailed = (error: Error) =>
  ActionCreator<_, FeaturesState>(_.GettingFeaturesFailed, { error });

export const gotFeatures = (features: Feature[]) =>
  ActionCreator<_, FeaturesState>(_.GotFeatures, { features });