import iContentEditable from './iContentEditable';

export enum UserType {
  Any = 0,
  Admin = 1,
  Student = 2,
  Applicant = 3,
  Staff = 4,
}

export interface FullName {
  first: string;
  middle?: string;
  last: string;
  full?: () => string;
}

export default interface iUser {
  readonly uid: string;
  email: string;
  name: FullName | string;
  address?: {
    country: string
  };
  isAdmin?: boolean;
  isApplicant?: boolean;
  isStudent?: boolean;
  isStaff?: boolean;
  emailConfirmed?: boolean;
  hasProfilePicture?: boolean;
  gender?: string;
  role?: string;
  dob?: number;
  phone?: string;
  photo?: string;
  socials?: {
    linkedin: string;
  };
  bio?: iContentEditable;
}