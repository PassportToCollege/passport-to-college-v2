import iUser from './iUser';
import iContentEditable from './iContentEditable';

export enum StudentType {
  All = 0,
  Current,
  Graduated
}

export default interface iStudent {
  User: iUser;
  readonly uid: string;
  bio?: iContentEditable;
  enrollmentYear?: number;
  graduationYear?: number;
  university?: string;
  highSchool?: string;
  major?: string;
  minor?: string;
  isFeatured?: boolean;
  showOnSite?: boolean;
  hasGraduated?: boolean;
}