import iError from "../imodels/iError";
import iUser from "../imodels/iUser";

import { isEmail } from "../utils";
import { storage } from "../utils/firebase";

export default class User implements iUser {
  uid: string;
  email: string;
  name: {
    first : string,
    middle? : string,
    last : string
  };
  isAdmin: boolean;
  isApplicant: boolean;
  isStudent: boolean;
  isStaff: boolean;
  emailConfirmed: boolean;
  hasProfilePicture: boolean;
  address: {
    country : string
  };
  gender?: string;
  role?: string;
  dob?: number;
  phone?: string;
  photo?: string;


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
    this.address = { country: "" };
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

  public getProfilePicture() : Promise<string> {
    return new Promise((resolve : Function, reject : Function) => {
      if (this.hasProfilePicture) 
      {
        if (this.photo)
          return resolve(this.photo);

        storage.ref("users/profile_images")
          .child(`${this.uid}.png`)
          .getDownloadURL()
          .then((url : string) => {
            this.photo = url;
            resolve(url)
          })
          .catch((error : iError) => {
            reject(error);
          });
      }
    });
  }
}