import { ActionCreator } from '..';
import { Stats } from '../actionTypes';
import iStats from '../../imodels/iStats';
import { StatsState } from '../../imodels/iAppState';

export const gettingStats = () =>
  ActionCreator<Stats>(Stats.GettingStats);

export const gettingStatsFailed = (error: Error) =>
  ActionCreator<Stats, StatsState>(Stats.GettingStatsFailed, { error });

export const gotStats = (stats: iStats) =>
  ActionCreator<Stats, StatsState>(Stats.GotStats, { stats });