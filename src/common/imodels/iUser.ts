
export default interface User {
  uid: string;
  email: string;
  name: any;
  isAdmin?: boolean;
  isApplicant?: boolean;
  isStudent?: boolean;
  isStaff?: boolean;
  emailConfirmed?: boolean;
  hasProfilePicture?: boolean;
  address?: any;
  gender?: string;
  role?: string;
  dob?: number;
  phone?: string;
  photo?: string;
}