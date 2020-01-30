import iUser from './iUser';
import iContentEditable from './iContentEditable';
import { iStringBooleanPair } from './iObjectTypes';
import User from '../models/User';

export enum PostUpdateType {
  Decrease = -1,
  Increase = 1
}

export enum PostState {
  all = 0,
  draft = 1,
  published = 2,
  archived = 3,
}

export interface PostOptions {
  publishing?: boolean;
  refresh?: boolean;
}

export interface iPostState {
  draft: boolean;
  archived: boolean;
  published: boolean;
}

export default interface iPost {
  readonly id: string;
  author: string | User;
  title: string;
  content?: iContentEditable;
  hasHero: boolean;
  hero?: string;
  createdAt: number | Date;
  publishedOn?: number | Date;
  archivedOn?: number | Date;
  state?: iPostState;
  conversations?: string[];
  category?: iStringBooleanPair;
  likes?: iStringBooleanPair;
} 