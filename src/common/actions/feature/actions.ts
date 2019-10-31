import { ActionCreator } from '..';
import { Feature as _ } from '../actionTypes';
import { FeatureState } from '../../imodels/iAppState';
import Feature from '../../models/Feature';

export const gettingFeature = () =>
  ActionCreator<_>(_.GettingFeature);

export const gettingFeatureFailed = (error: Error) =>
  ActionCreator<_, FeatureState>(_.GettingFeatureFailed, { error });

export const gotFeature = (feature: Feature) =>
  ActionCreator<_, FeatureState>(_.GotFeature, { feature });

export const creatingFeature = () =>
  ActionCreator<_>(_.CreatingFeature);

export const creatingFeatureFailed = (error: Error) =>
  ActionCreator<_, FeatureState>(_.CreatingFeatureFailed, { error });

export const createdFeature = () =>
  ActionCreator<_>(_.CreatedFeature);

export const updatingFeature = () =>
  ActionCreator<_>(_.UpdatingFeature);

export const updatingFeatureFailed = (error: Error) =>
  ActionCreator<_, FeatureState>(_.UpdatingFeatureFailed, { error });

export const updatedFeature = () =>
  ActionCreator<_>(_.UpdatedFeature);

export const deletingFeature = () =>
  ActionCreator<_>(_.DeletingFeature);

export const deletingFeatureFailed = (error: Error) =>
  ActionCreator<_, FeatureState>(_.DeletingFeatureFailed, { error });

export const deletedFeature = () =>
  ActionCreator<_>(_.DeletedFeature);
