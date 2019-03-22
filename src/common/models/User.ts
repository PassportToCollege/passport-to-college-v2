import iUser from "../imodels/iUser";

import { isEmail } from "../utils";

export default class User implements iUser {
  uid: string;
  email: string;
  name: any;
  isAdmin: boolean;
  isApplicant: boolean;
  isStudent: boolean;
  isStaff: boolean;
  emailConfirmed: boolean;
  hasProfilePicture: boolean;
  address: any;
  gender: string;
  role: string;
  dob: number;
  phone: string;
  photo: string;


  constructor(user: any) {
    this.uid = user.uid;
    this.email = user.email;
    this.name = user.name;

    this.isAdmin = false;
    this.isApplicant = false;
    this.isStudent = false;
    this.isStaff = false;
    this.emailConfirmed = false;
    this.hasProfilePicture = false;
    this.address = {};
    this.gender = "";
    this.role = "";
    this.dob = 0;
    this.phone = "";
    this.photo = "";

    if (Object.keys(user).length) {
      Object.assign(this, user);
    }

    if (this.email && !isEmail(this.email)) {
      throw new Error("Invalid or no email provided.");
    }
  }

  set _uid(_uid: string) {
    this.uid = _uid;
  }

  get data() {
    return this.getData();
  }

  get isComplete() {
    return !!(
      this.uid &&
      (this.address && this.address.country) &&
      (this.name && this.name.first && this.name.last) &&
      this.gender &&
      this.dob &&
      this.email
    );
  }

  get missingProps() {
    let props = [];

    if (!this.uid)
      props.push("uid");

    if (!this.email)
      props.push("email");

    if (!this.name.first)
      props.push("name.first");

    if (!this.name.last)
      props.push("name.last");

    if (!this.address.country)
      props.push("country");

    if (!this.gender)
      props.push("gender");

    if (!this.dob)
      props.push("dob");

    if (this.isStaff && !this.role)
      props.push("role");


    return props;
  }

  private getData() {
    const {
      uid,
      isAdmin,
      isApplicant,
      isStaff,
      isStudent,
      email,
      emailConfirmed,
      hasProfilePicture,
      address,
      name,
      gender,
      role,
      dob,
      phone,
      photo
    } = this;

    return {
      uid,
      isAdmin,
      isApplicant,
      isStaff,
      isStudent,
      email,
      emailConfirmed,
      hasProfilePicture,
      address,
      name,
      gender,
      role,
      dob,
      phone,
      photo
    }
  }
}