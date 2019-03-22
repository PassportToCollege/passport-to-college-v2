import iUser from "./iUser"

export default interface iStudent {
  User : iUser;
  uid : string;
  bio? : any;
  enrollmentYear? : number;
  graduationYear? : number;
  university? : string;
  highSchool? : string;
  major? : string;
  minor? : string;
  isFeatured? : boolean;
  showOnSite? : boolean;
  hasGraduated? : boolean;
}