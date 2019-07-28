import iStudent from '../imodels/iStudent';
import User from './User';

export type StudentProps = 'uid' | 'bio' | 'enrollmentYear' | 'graduationYear' | 'university' |
  'highSchool' | 'major' | 'minor' | 'isFeatured' | 'showOnSite' | 'hasGraduated' | 'User' |
  'User.uid' | 'User.email' | 'User.name' | 'User.name.first' | 'User.name.last' | 'User.isAdmin' |
  'User.isApplicant' | 'User.isStudent' | 'User.isStaff' | 'User.emailConfirmed' | 'User.hasProfilePicture' |
  'User.address' | 'User.address.country' | 'User.gender' | 'User.role' | 'User.dob' |
  'User.phone' | 'User.photo';

export default class Student implements iStudent {
  public User: User;
  public uid: string;
  public bio: any;
  public enrollmentYear: number;
  public graduationYear: number;
  public university: string;
  public highSchool: string;
  public major: string;
  public minor: string;
  public isFeatured: boolean;
  public showOnSite: boolean;
  public hasGraduated: boolean;

  constructor(student: any, user: User) {
    this.User = user;
    this.uid = student.uid;

    this.bio = {};
    this.enrollmentYear = 0;
    this.graduationYear = 0;
    this.university = '';
    this.highSchool = '';
    this.major = '';
    this.minor = '';
    this.isFeatured = false;
    this.showOnSite = false;
    this.hasGraduated = false;

    if (Object.keys(user).length) {
      Object.assign(this, user);
    }
  }

  get data(): iStudent {
    return this.getData();
  }

  get isComplete(): boolean {
    return !!(
      this.uid &&
      Object.keys(this.bio).length &&
      this.enrollmentYear &&
      this.graduationYear &&
      this.major &&
      this.university &&
      Object.keys(this.User.data)
    );
  }

  get isFreshman(): boolean {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return (
      this.enrollmentYear === year ||
      ((this.graduationYear - year === 3) &&
        month <= 5)
    );
  }

  get isSophomore(): boolean {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return (
      ((year - this.enrollmentYear === 1) && (month > 5)) ||
      ((this.graduationYear - year === 2) &&
        month <= 5)
    );
  }

  get isJunior(): boolean {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return (
      ((year - this.enrollmentYear === 2) && (month > 5)) ||
      ((this.graduationYear - year === 1) &&
        month <= 5)
    );
  }

  get isSenior(): boolean {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return (!this.hasGraduated &&
      (this.graduationYear === year ||
        ((this.graduationYear - year === 1) &&
          month > 5))
    );
  }

  get classification(): string {
    if (this.isFreshman) { return 'freshman'; }

    if (this.isSophomore) { return 'sophomore'; }

    if (this.isJunior) { return 'junior'; }

    return 'senior';
  }

  private getData(): iStudent {
    return {
      uid: this.uid,
      User: this.User,
      bio: this.bio,
      enrollmentYear: this.enrollmentYear,
      graduationYear: this.graduationYear,
      university: this.university,
      highSchool: this.highSchool,
      major: this.major,
      minor: this.minor,
      isFeatured: this.isFeatured,
      showOnSite: this.showOnSite,
      hasGraduated: this.hasGraduated
    };
  }

  public updatePropAndReturnUser(prop: StudentProps, newValue: any): Student {
    if (typeof this[prop] === typeof newValue) {
      this[prop] = newValue;
    }

    return this;
  }
}