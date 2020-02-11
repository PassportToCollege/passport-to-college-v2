import iUser, { FullName } from '../imodels/iUser';
import { isEmail } from '../utils';
import { storage } from '../utils/firebase';
import iContentEditable from '../imodels/iContentEditable';

export default class User implements iUser {
  public uid: string;
  public email: string;
  public name: FullName;
  public isAdmin?: boolean;
  public isApplicant?: boolean;
  public isStudent?: boolean;
  public isStaff?: boolean;
  public emailConfirmed?: boolean;
  public hasProfilePicture?: boolean;
  public address?: {
    country: string
  };
  public gender?: string;
  public role?: string;
  public dob?: number;
  public phone?: string;
  public photo?: string;
  public socials?: {
    linkedin: string;
  };
  public bio?: iContentEditable;

  constructor(user: iUser) {
    this.uid = user.uid;
    this.email = user.email;
    this.name = typeof user.name !== 'string'  
      ? {
        ...user.name,
        full: (): string => {
          return `${(this.name as FullName).first} ${(this.name as FullName).last}`; 
        }
      }
      : User.createNameObject(user.name);

    this.isAdmin = false;
    this.isApplicant = false;
    this.isStudent = false;
    this.isStaff = false;
    this.emailConfirmed = false;
    this.hasProfilePicture = false;
    this.address = { country: '' };
    this.gender = '';
    this.role = '';
    this.dob = 0;
    this.phone = '';
    this.photo = '';
    this.socials = {
      linkedin: ''
    };

    if (Object.keys(user).length) {
      Object.assign(this, user);
    }

    if (this.email && !isEmail(this.email)) {
      throw new Error('Invalid or no email provided.');
    }
  }

  set _uid(_uid: string) {
    this.uid = _uid;
  }

  get data() {
    return this.getData();
  }

  get isComplete() {
    const hasName = this.name && typeof this.name === 'string' 
      ? true
      : (this.name as FullName).first && (this.name as FullName).last;

    return !!(
      this.uid &&
      (this.address && this.address.country) &&
      hasName &&
      this.gender &&
      this.dob &&
      this.email
    );
  }

  get missingProps() {
    const props = [];

    if (!this.uid) { props.push('uid'); }
    if (!this.email) { props.push('email'); }
    if (!this.name) { props.push('name'); }
    if (!(this.name as FullName).first) { props.push('name.first'); }
    if (!(this.name as FullName).last) { props.push('name.last'); }
    if (!this.address || !this.address.country) { props.push('country'); }
    if (!this.gender) { props.push('gender'); }
    if (!this.dob) { props.push('dob'); }
    if (this.isStaff && !this.role) { props.push('role'); }
    if (this.socials && this.socials.linkedin === '') {
      props.push('socials.linkedin');
    }

    return props;
  }

  private getData(): iUser {
    return {
      uid: this.uid,
      isAdmin: this.isAdmin,
      isApplicant: this.isApplicant,
      isStaff: this.isStaff,
      isStudent: this.isStudent,
      email: this.email,
      emailConfirmed: this.emailConfirmed,
      hasProfilePicture: this.hasProfilePicture,
      address: this.address,
      name: this.name,
      gender: this.gender,
      role: this.role,
      dob: this.dob,
      phone: this.phone,
      photo: this.photo,
      socials: this.socials,
    };
  }

  public getProfilePicture(): Promise<string> {
    return new Promise((resolve: (photo: string) => void, reject: (error: Error) => void) => {
      if (this.hasProfilePicture && storage) {
        if (this.photo) {
          return resolve(this.photo);
        }

        storage.ref('users/profile_images')
          .child(`${this.uid}.png`)
          .getDownloadURL()
          .then((url: string) => {
            this.photo = url;
            resolve(url);
          })
          .catch((error: Error) => {
            reject(error);
          });
      }
    });
  }

  public updateProfilePicture(image: File): Promise<string> {
    return new Promise((resolve: (url: string) => void, reject: (error: Error) => void) => {
      const ref = storage!.ref('users/profile_images').child(`${this.uid}.png`);

      ref.put(image)
        .then(() => {
          this.getProfilePicture()
            .then((url: string) => {
              resolve(url);
            });
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }

  public static createNameObject(name: string): FullName {
    const splitName = name.split(' ');
    const first = splitName[0];
    const last = splitName[splitName.length - 1];

    return {
      first,
      last,
      full: () => `${first} ${last}`
    };
  }
}