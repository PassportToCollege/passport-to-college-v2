import iUser from './iUser';
import iContentEditable from './iContentEditable';
import { iStringBooleanPair } from './iObjectTypes';

export enum PostUpdateType
{
  Decrease = -1,
  Increase = 1
}

export enum PostState 
{
  all = 0,
  draft = 1,
  published = 2,
  archived = 3,
}

export interface iPostState 
{
  draft: boolean;
  archived: boolean;
  published: boolean;
}

export default interface iPost 
{
  readonly id: string;
  author: string;
  title: string;
  excerpt: string;
  full: iContentEditable;
  hasHero: boolean;
  createdAt: number | Date;
  state: iPostState;
  conversations?: string[];
  category?: iStringBooleanPair;
  likes?: iStringBooleanPair;
} 