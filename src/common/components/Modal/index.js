import "./Modal.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import moment from "moment";

import { NationalTest, CreateUserForm } from "../Forms";
import WYSIWYGEditor from "../Editor";
import Button from "../Button";
import TextedIconButton from "../TextedIconButton";

import { makeClassString } from "../../utils"; 

export default class Modal extends Component {
  static propTypes = {
    children: propTypes.any,
    doClose: propTypes.func,
    classes: propTypes.arrayOf(propTypes.string)
  }

  render() {
    return (
      <div className={`modal__container modal ${makeClassString(this.props.classes)}`}
        ref={div => this.modal = div}>
        <div className="modal__bg" onClick={this.closeModal}></div>
        <div className="modal__content">
          {this.props.children}
        </div>
      </div>
    )
  }

  closeModal = () => {
    this.modal.classList.add("close");

    if ("function" === typeof this.props.doClose)
      this.props.doClose();
  }
}

export class ReauthenticateModal extends Component {
  static propTypes = {
    doAuthenticate: propTypes.func
  }

  render() {
    return (
      <div className="modal__container modal__reauthenticate" ref={div => this.modal = div}>
        <div className="modal__bg" onClick={this.closeModal}></div>
        <div className="modal__content">
          <p>You need to re-authenticate to change your email address.</p>
          <input type="password" name="password" 
            placeholder="*********"
            ref={input => this.passwordInput = input}/>
          <label>Password</label>
          <button className="button button__solid" onClick={this.handleAuthenticate}>Re-Authenticate</button>
        </div>
      </div>
    )
  }

  closeModal = () => {
    this.modal.classList.add("close");
  }

  handleAuthenticate = () => {
    if ("function" === typeof this.props.doAuthenticate) {
      this.props.doAuthenticate(this.passwordInput.value);
      this.closeModal();
    }
  }
}

export class AddNationalTest extends Component {
  static propTypes = {
    doClose: propTypes.func,
    handleInputChange: propTypes.func,
    handleTestAdded: propTypes.func
  }

  render() {
    return (
      <div className="modal__container modal__add_national_test"
        ref={div => this.modalContainer = div}>
        <div className="modal__bg" onClick={this.closeModal}></div>
        <div className="modal__content">
          <NationalTest handleTestAdded={this.addTest} handleInputChange={this.inputChanged} />
        </div>
      </div>
    )
  }

  closeModal = () => {
    this.modalContainer.classList.add("close");

    if ("function" === typeof this.props.doClose)
      this.props.doClose();
  }

  addTest = () => {
    if ("function" === typeof this.props.handleTestAdded)
      this.props.handleTestAdded();

    this.closeModal();
  }

  inputChanged = e => {
    if ("function" === typeof this.props.handleInputChange)
      this.props.handleInputChange(e);
  }
}

export class CreateUserModal extends Component {
  static propTypes = {
    doClose: propTypes.func,
    handleInputChange: propTypes.func,
    handleSubmit: propTypes.func
  }

  render() {
    return (
      <div className="modal__container modal__create_user"
        ref={div => this.modalContainer = div}>
        <div className="modal__bg" onClick={this.closeModal}></div>
        <div className="modal__content">
          <CreateUserForm handleSubmit={this.submitForm} handleInputChange={this.inputChanged} />
        </div>
      </div>
    )
  }

  closeModal = () => {
    this.modalContainer.classList.add("close");

    if ("function" === typeof this.props.doClose)
      this.props.doClose();
  }

  submitForm = e => {
    if ("function" === typeof this.props.handleSubmit)
      this.props.handleSubmit(e);
  }

  inputChanged = e => {
    if ("function" === typeof this.props.handleInputChange)
      this.props.handleInputChange(e);
  }
}

export class ViewFeatureModal extends Component {
  static propTypes = {
    doClose: propTypes.func,
    feature: propTypes.object
  }

  render() {
    const { feature } = this.props;

    return (
      <div className="modal__container modal__view_feature"
        ref={div => this.modalContainer = div}>
        <div className="modal__bg" onClick={this.closeModal}></div>
        <div className="modal__content">
          <h4>Created On</h4>
          <span>{moment(feature.createdAt).format("MM-DD-Y")}</span>
          <h4>Expires On</h4>
          <span>{moment(feature.expDate).format("MM-DD-Y")}</span>
          <h4>Details</h4>
          <WYSIWYGEditor readonly content={feature.details}
            editorStyles={{
              border: "none",
              padding: "0",
              minHeight: "auto"
            }} />
          <h4>Active?</h4>
          <span>{feature.isActive ? "yes" : "no"}</span>
        </div>
      </div>
    )
  }

  closeModal = () => {
    this.modalContainer.classList.add("close");

    if ("function" === typeof this.props.doClose)
      this.props.doClose();
  }
}

export class AddRole extends Component {
  static propTypes = {
    doClose: propTypes.func,
    doSubmit: propTypes.func,
    role: propTypes.string
  }

  render() {
    return (
      <div className="modal__container modal__add_role"
        ref={div => this.modalContainer = div}>
        <div className="modal__bg" onClick={this.closeModal}></div>
        <div className="modal__content">
          <h3>{this.props.role ? "Edit role" : "Add role"}</h3>
          <form className="form form__add_role"
            onSubmit={this.handleSubmit}>
            <input type="text" name="role" required
              ref={input => this.roleInput = input} 
              defaultValue={this.props.role || ""}/>
            <Button solid type="submit" doClick={this.handleSubmit}
              text={this.props.role ? "change" : "add"} />
          </form>
        </div>
      </div>
    )
  }

  closeModal = () => {
    this.modalContainer.classList.add("close");

    if ("function" === typeof this.props.doClose)
      this.props.doClose();
  }

  handleSubmit = e => {
    e.preventDefault();

    this.modalContainer.classList.add("close");

    if ("function" === typeof this.props.doSubmit)
      this.props.doSubmit(this.roleInput)
  }
}

export class DeleteUser extends Component {
  static propTypes = {
    name: propTypes.string,
    doClose: propTypes.func,
    doSubmit: propTypes.func
  }

  render() {
    return (
      <div className="modal__container modal__delete_user"
        ref={div => this.modalContainer = div}>
        <div className="modal__bg" onClick={this.closeModal}></div>
        <div className="modal__content">
          <h3>Confirm Delete</h3>
          <p>You are about to remove a user account. This action cannot be undone.</p>
          <form className="form form__delete_user"
            onSubmit={this.handleSubmit}>
            <label>Type user&apos;s full name to confirm delete</label>
            <input type="text" name="name" required
              ref={input => this.nameInput = input} />
            <Button solid type="submit" doClick={this.handleSubmit}
              text="remove" />
            <Button type="button" doClick={this.closeModal}
              text="cancel" />
          </form>
        </div>
      </div>
    )
  }

  closeModal = () => {
    this.modalContainer.classList.add("close");

    if ("function" === typeof this.props.doClose)
      this.props.doClose();
  }

  handleSubmit = e => {
    e.preventDefault();

    if (this.nameInput.value !== this.props.name) {
      this.nameInput.classList.add("error");
      return;
    }

    this.modalContainer.classList.add("close");

    if ("function" === typeof this.props.doSubmit)
      this.props.doSubmit(this.nameInput)
  }
}

export class EditUserPersonal extends Component {
  static propTypes = {
    user: propTypes.object,
    doClose: propTypes.func,
    doSubmit: propTypes.func
  };

  render() {
    const { user } = this.props;

    return (
      <div className="modal__container modal__edit_user_personal"
        ref={div => this.modalContainer = div}>
        <div className="modal__bg" onClick={this.closeModal}></div>
        <div className="modal__content">
          <h3>{`Edit ${user.name.full}`}</h3>
          <form className="form form__edit_user_personal">
            <div className="form__input_container">
              <label>Full name</label>
              <input type="text" name="name" required 
                defaultValue={user.name.full} 
                onChange={this.handleFormChange} />
            </div>
            <div className="form__input_container">
              <label>Date of birth</label>
              <input type="date" name="dob" required
                defaultValue={moment(user.dob).format("Y-MM-DD")} 
                onBlur={this.handleFormChange}/>
            </div>
            <div className="form__input_container">
              <label>Gender</label>
              <select name="gender" required defaultValue={user.gender || ""}
                onChange={this.handleFormChange}>
                <option value="" disabled>Select One</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>
            <h4>Contact Information</h4>
            <div className="form__input_container">
              <label>Email</label>
              <input type="email" name="email" required disabled
                defaultValue={user.email} />
            </div>
            <div className="form__input_container">
              <label>Phone</label>
              <input type="tel" name="phone" required
                defaultValue={user.phone} 
                onChange={this.handleFormChange}/>
            </div>
            <div className="form__input_container">
              <label>Country</label>
              <input type="text" name="country" required
                defaultValue={user.address ? user.address.country : ""} 
                onChange={this.handleFormChange}/>
            </div>
            <Button solid type="submit" doClick={this.handleSubmit}
              text="save" />
          </form>
        </div>
      </div>
    )
  }

  closeModal = () => {
    this.modalContainer.classList.add("close");

    if ("function" === typeof this.props.doClose)
      this.props.doClose();
  };

  handleSubmit = e => {
    e.preventDefault();

    this.modalContainer.classList.add("close");

    if ("function" === typeof this.props.doSubmit)
      this.props.doSubmit(this.props.user);
  }

  handleFormChange = e => {
    const { user } = this.props;

    switch (e.target.name) {
      case "country":
        if (user.address) {
          user.address.country = e.target.value;
        } else {
          user.address = {
            country: e.target.value
          }
        }

        break;
      case "dob":
        user.dob = new Date(moment.utc(moment(e.target.value)).toDate()).getTime();
        break;
      default:
        user[e.target.name] = e.target.value;
    }
  }
}

export class EditStudentEducation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      student: props.student
    };
  }

  static propTypes = {
    student: propTypes.object,
    doClose: propTypes.func,
    doSubmit: propTypes.func
  };

  render() {
    const { student } = this.state;

    return (
      <div className="modal__container modal__edit_user_personal"
        ref={div => this.modalContainer = div}>
        <div className="modal__bg" onClick={this.closeModal}></div>
        <div className="modal__content">
          <h3>{`Edit ${student.user.name.full}`}</h3>
          <form className="form form__edit_user_personal">
            <div className="form__input_container">
              <label>High School</label>
              <input type="text" name="highSchool" required
                defaultValue={student.highSchool}
                onChange={this.handleFormChange} />
            </div>
            <div className="form__input_container">
              <label>University</label>
              <input type="text" name="university" required
                defaultValue={student.university}
                onChange={this.handleFormChange} />
            </div>
            <div className="form__input_container">
              <label>Major</label>
              <input type="text" name="major" required
                defaultValue={student.major}
                onChange={this.handleFormChange} />
            </div>
            <div className="form__input_container">
              <label>Minor</label>
              <input type="text" name="minor"
                defaultValue={student.minor}
                onChange={this.handleFormChange} />
            </div>
            <h4>Meta Information</h4>
            <div className="form__input_container">
              <label>Enrollment Year</label>
              <input type="number" name="enrollmentYear" required
                min="2013" max={new Date().getFullYear()}
                defaultValue={student.enrollmentYear} 
                onChange={this.handleFormChange}/>
            </div>
            <div className="form__input_container">
              <label>Graduation Year</label>
              <input type="number" name="graduationYear" required
                min="2017"
                defaultValue={student.graduationYear}
                onChange={this.handleFormChange} />
            </div>
            <Button solid type="submit" doClick={this.handleSubmit}
              text="save" />
          </form>
        </div>
      </div>
    );
  }

  closeModal = () => {
    this.modalContainer.classList.add("close");

    if ("function" === typeof this.props.doClose)
      this.props.doClose();
  };

  handleSubmit = e => {
    e.preventDefault();

    this.modalContainer.classList.add("close");

    if ("function" === typeof this.props.doSubmit)
      this.props.doSubmit(this.state.student)
  }

  handleFormChange = e => {
    this.setState({ student: Object.assign({}, this.state.student, {
        [e.target.name]: e.target.value
      }) 
    });
  }
}

export class AddPostCategory extends Component {
  static propTypes = {
    doClose: propTypes.func,
    doSubmit: propTypes.func
  }

  render() {
    return (
      <div className="modal__container modal__add_post_category"
        ref={div => this.modalContainer = div}>
        <div className="modal__bg" onClick={this.closeModal}></div>
        <div className="modal__content">
          <h3>Add post category</h3>
          <form className="form form__add_post_category"
            onSubmit={this.handleSubmit}>
            <div className="form__input_container">
              <label>Category name</label>
              <input type="text" name="categpry" required
                ref={input => this.categoryInput = input} />
            </div>
            <Button type="submit" text="add" solid />
          </form>
        </div>
      </div>
    )
  }

   closeModal = () => {
    this.modalContainer.classList.add("close");

    if ("function" === typeof this.props.doClose)
      this.props.doClose();
   };

   handleSubmit = e => {
     e.preventDefault();

     if ("function" === typeof this.props.doSubmit)
      this.props.doSubmit(this.categoryInput)
   }
}

export class SignUpModal extends Component {
  static propTypes = {
    doClose: propTypes.func,
    doGoogle: propTypes.func,
    doFacebook: propTypes.func,
    doSignIn: propTypes.func,
    heading: propTypes.string,
    intro: propTypes.string
  }

  render() {
    return (
      <div className="modal__container modal__signup"
        ref={div => this.modalContainer = div}>
        <div className="modal__bg" onClick={this.closeModal}></div>
        <div className="modal__content">
          <h1>{this.props.heading}</h1>
          <p>{this.props.intro}</p>
          <TextedIconButton doClick={this.handleGoogleSignUp}
            icon="google" text="Sign up with your Google account." />
          <TextedIconButton doClick={this.handleFacebookSignUp}
            icon="facebook" text="Sign up with your Facebook account." />
          <p>
            Already have an account? 
            <span className="sign_in__link"
              onClick={this.handleSignInClick}> Sign in</span>. 
          </p>
        </div>
      </div>
    )
  }

  closeModal = () => {
    this.modalContainer.classList.add("close");

    if ("function" === typeof this.props.doClose)
      this.props.doClose();
  };

  handleGoogleSignUp = () => {
    if ("function" === typeof this.props.doGoogle)
      return this.props.doGoogle("google");
  };

  handleFacebookSignUp = () => {
    if ("function" === typeof this.props.doFacebook)
      return this.props.doFacebook("facebook");
  };

  handleSignInClick = () => {
    if ("function" === typeof this.props.doSignIn)
      return this.props.doSignIn();
  };
}

export class SignInModal extends Component {
  static propTypes = {
    doClose: propTypes.func,
    doGoogle: propTypes.func,
    doFacebook: propTypes.func,
    doSignIn: propTypes.func,
    doSignUp: propTypes.func,
    heading: propTypes.string,
    intro: propTypes.string
  }

  render() {
    return (
      <div className="modal__container modal__signin"
        ref={div => this.modalContainer = div}>
        <div className="modal__bg" onClick={this.closeModal}></div>
        <div className="modal__content">
          <h3>Sign in</h3>
          <TextedIconButton doClick={this.handleGoogleSignIn}
            icon="google" text="Google account" />
          <TextedIconButton doClick={this.handleFacebookSignIn}
            icon="facebook" text="Facebook account" />
          <h3>Or with your email address:</h3>
          <form className="form form__signin"
            onSubmit={this.handlleSignIn}>
            <div className="form__input_container">
              <label htmlFor="email">Email address</label>
              <input type="text" id="email" name="email" required
                ref={input => this.emailInput = input} />
            </div>
            <div className="form__input_container">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required
                ref={input => this.passwordInput = input} />
            </div>
            <Button type="submit" text="sign in" solid 
              styles={{
                backgroundColor: "#FF6561"
              }}/>
            <Button type="button" text="sign up instead" solid
              doClick={this.handleSignUpInstead} 
              styles={{
                backgroundColor: "rgb(153,153,153)",
                marginLeft: "1em"
              }}/>
          </form>
        </div>
      </div>
    )
  }

  closeModal = () => {
    this.modalContainer.classList.add("close");

    if ("function" === typeof this.props.doClose)
      this.props.doClose();
  };

  handleGoogleSignIn = () => {
    if ("function" === typeof this.props.doGoogle)
      return this.props.doGoogle("google");
  };

  handleFacebookSignIn = () => {
    if ("function" === typeof this.props.doFacebook)
      return this.props.doFacebook("facebook");
  };

  handlleSignIn = (e) => {
    e.preventDefault();

    if ("function" === typeof this.props.doSignIn)
      return this.props.doSignIn(this.emailInput, this.passwordInput);
  };

  handleSignUpInstead = () => {
    if ("function" === typeof this.props.doSignUp)
      return this.props.doSignUp();
  }
}

