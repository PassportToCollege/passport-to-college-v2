
export enum UserType {
  Any = 0,
  Admin = 1,
  Student = 2,
  Applicant = 3,
  Staff = 4,
}

export default interface User {
  readonly uid: string;
  email: string;
  name: {
    first: string,
    middle?: string,
    last: string,
  };
  address: {
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
}