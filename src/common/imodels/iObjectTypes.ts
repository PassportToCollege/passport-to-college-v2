import iTest from './iTest';
import Reply from '../models/Reply';
import iNotification from '../imodels/iNotification';

export interface iStringBooleanPair {
  [key: string]: boolean;
}

export interface iStringTestPair {
  [key: string]: iTest;
}

export interface iStringReplyListPair {
  [key: string]: Reply[];
}

export interface iStringNotificationPair {
  [key: string]: iNotification;
}