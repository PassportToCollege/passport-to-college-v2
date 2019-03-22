import iStudent from "../imodels/iStudent";
import User from "./User"

export default class Student implements iStudent {
  User: User;
  uid: string;
  bio: any;
  enrollmentYear: number;
  graduationYear: number;
  university: string;
  highSchool: string;
  major: string;
  minor: string;
  isFeatured: boolean;
  showOnSite: boolean;
  hasGraduated: boolean;

  constructor(student : any, user : User) {
    this.User = user;
    this.uid = student.uid;

    this.bio = {};
    this.enrollmentYear = 0;
    this.graduationYear = 0;
    this.university = "";
    this.highSchool = "";
    this.major = "";
    this.minor = "";
    this.isFeatured = false;
    this.showOnSite = false;
    this.hasGraduated = false;

    if (Object.keys(user).length) {
      Object.assign(this, user);
    }
  }

  get data() : any {
    return this.getData();
  }

  get isComplete() : boolean {
    return !!(
      this.uid &&
      Object.keys(this.bio).length &&
      this.enrollmentYear &&
      this.graduationYear &&
      this.major &&
      this.university &&
      Object.keys(this.user)
    );
  }

  get isFreshman() : boolean {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return (
      this.enrollmentYear === year ||
      ((this.graduationYear - year === 3) &&
        month <= 5)
    );
  }

  get isSophomore() : boolean {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return (
      ((year - this.enrollmentYear === 1) && (month > 5)) ||
      ((this.graduationYear - year === 2) &&
        month <= 5)
    );
  }

  get isJunior() : boolean {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return (
      ((year - this.enrollmentYear === 2) && (month > 5)) ||
      ((this.graduationYear - year === 1) &&
        month <= 5)
    );
  }

  get isSenior() : boolean {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return (!this.hasGraduated &&
      (this.graduationYear === year ||
        ((this.graduationYear - year === 1) &&
          month > 5))
    );
  }

  get classification() : string {
    if (this.isFreshman)
      return "freshman";

    if (this.isSophomore)
      return "sophomore";

    if (this.isJunior)
      return "junior";

    return "senior";
  }

  getData() {
    const {
      uid,
      User,
      bio,
      enrollmentYear,
      graduationYear,
      university,
      highSchool,
      major,
      minor,
      isFeatured,
      showOnSite,
      hasGraduated
    } = this;

    return {
      uid,
      User,
      bio,
      enrollmentYear,
      graduationYear,
      university,
      highSchool,
      major,
      minor,
      isFeatured,
      showOnSite,
      hasGraduated
    };
  }
}