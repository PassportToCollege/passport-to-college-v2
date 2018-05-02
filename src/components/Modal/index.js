import "./Modal.css";

import React from "react";
import propTypes from "prop-types";
import moment from "moment";

import { NationalTest, CreateUserForm } from "../Forms";
import WYSIWYGEditor from "../Editor";
import Button from "../Button";
import TextedIconButton from "../TextedIconButton";

export const ReauthenticateModal = props => {
  const closeModal = () => {
    this.modal.classList.add("close");
  }

  const handleAuthenticate = () => {
    if ("function" === typeof props.doAuthenticate) {
      props.doAuthenticate(this.passwordInput.value);
      closeModal();
    }
  }

  return (
    <div className="modal__container modal__reauthenticate" ref={div => this.modal = div}>
      <div className="modal__bg" onClick={closeModal}></div>
      <div className="modal__content">
        <p>You need to re-authenticate to change your email address.</p>
        <input type="password" name="password" 
          placeholder="*********"
          ref={input => this.passwordInput = input}/>
        <label>Password</label>
        <button className="button button__solid" onClick={handleAuthenticate}>Re-Authenticate</button>
      </div>
    </div>
  )
}

ReauthenticateModal.propTypes = {
  doAuthenticate: propTypes.func
};

export const AddNationalTest = ({ doClose, handleInputChange, handleTestAdded }) => {
  const closeModal = () => {
    this.modalContainer.classList.add("close");

    if ("function" === typeof doClose)
      doClose();
  }

  const addTest = () => {
    if ("function" === typeof handleTestAdded)
      handleTestAdded();
    
    closeModal();
  }

  const inputChanged = e => {
    if ("function" === typeof handleInputChange)
      handleInputChange(e);
  }

  return (
    <div className="modal__container modal__add_national_test"
      ref={div => this.modalContainer = div}>
      <div className="modal__bg" onClick={closeModal}></div>
      <div className="modal__content">
        <NationalTest handleTestAdded={addTest} handleInputChange={inputChanged} />
      </div>
    </div>
  )
}

AddNationalTest.propTypes = {
  doClose: propTypes.func,
  handleInputChange: propTypes.func,
  handleTestAdded: propTypes.func
};

export const CreateUserModal = ({ doClose, handleInputChange, handleSubmit }) => {
  const closeModal = () => {
    this.modalContainer.classList.add("close");

    if ("function" === typeof doClose)
      doClose();
  }

  const submitForm = e => {
    if ("function" === typeof handleSubmit)
      handleSubmit(e);
  }

  const inputChanged = e => {
    if ("function" === typeof handleInputChange)
      handleInputChange(e);
  }

  return (
    <div className="modal__container modal__create_user"
      ref={div => this.modalContainer = div}>
      <div className="modal__bg" onClick={closeModal}></div>
      <div className="modal__content">
        <CreateUserForm handleSubmit={submitForm} handleInputChange={inputChanged} />
      </div>
    </div>
  )
}

CreateUserModal.propTypes = {
  doClose: propTypes.func,
  handleInputChange: propTypes.func,
  handleSubmit: propTypes.func
}

export const ViewFeatureModal = ({ doClose, feature }) => {
  const closeModal = () => {
    this.modalContainer.classList.add("close");

    if ("function" === typeof doClose)
      doClose();
  }

  return (
    <div className="modal__container modal__view_feature"
      ref={div => this.modalContainer = div}>
      <div className="modal__bg" onClick={closeModal}></div>
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

ViewFeatureModal.propTypes = {
  doClose: propTypes.func,
  feature: propTypes.object
};

export const AddRole = ({ doClose, doSubmit, role }) => {
  const closeModal = () => {
    this.modalContainer.classList.add("close");

    if ("function" === typeof doClose)
      doClose();
  }

  const handleSubmit = e => {
    e.preventDefault();

    this.modalContainer.classList.add("close");

    if ("function" === typeof doSubmit)
      doSubmit(this.roleInput)
  }

  return (
    <div className="modal__container modal__add_role"
      ref={div => this.modalContainer = div}>
      <div className="modal__bg" onClick={closeModal}></div>
      <div className="modal__content">
        <h3>{role ? "Edit role" : "Add role"}</h3>
        <form className="form form__add_role"
          onSubmit={handleSubmit}>
          <input type="text" name="role" required
            ref={input => this.roleInput = input} 
            defaultValue={role || ""}/>
          <Button solid type="submit" doClick={handleSubmit}
            text={role ? "change" : "add"} />
        </form>
      </div>
    </div>
  )
}

AddRole.propTypes = {
  doClose: propTypes.func,
  doSubmit: propTypes.func,
  role: propTypes.string
};

export const DeleteUser = ({ name, doClose, doSubmit }) => {
  const closeModal = () => {
    this.modalContainer.classList.add("close");

    if ("function" === typeof doClose)
      doClose();
  }

  const handleSubmit = e => {
    e.preventDefault();

    // check if names match
    if (this.nameInput.value !== name) {
      this.nameInput.classList.add("error");
      return;
    }

    this.modalContainer.classList.add("close");

    if ("function" === typeof doSubmit)
      doSubmit(this.nameInput)
  }

  return (
    <div className="modal__container modal__delete_user"
      ref={div => this.modalContainer = div}>
      <div className="modal__bg" onClick={closeModal}></div>
      <div className="modal__content">
        <h3>Confirm Delete</h3>
        <p>You are about to remove a user account. This action cannot be undone.</p>
        <form className="form form__delete_user"
          onSubmit={handleSubmit}>
          <label>Type user&apos;s full name to confirm delete</label>
          <input type="text" name="name" required
            ref={input => this.nameInput = input} />
          <Button solid type="submit" doClick={handleSubmit}
            text="remove" />
          <Button type="button" doClick={closeModal}
            text="cancel" />
        </form>
      </div>
    </div>
  )
};

DeleteUser.propTypes = {
  name: propTypes.string,
  doClose: propTypes.func,
  doSubmit: propTypes.func
}

export const EditUserPersonal = ({ user, doClose, doSubmit }) => {
  const closeModal = () => {
    this.modalContainer.classList.add("close");

    if ("function" === typeof doClose)
      doClose();
  };

  const handleSubmit = e => {
    e.preventDefault();

    this.modalContainer.classList.add("close");

    if ("function" === typeof doSubmit)
      doSubmit(user)
  }

  const handleFormChange = e => {
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

  return (
    <div className="modal__container modal__edit_user_personal"
      ref={div => this.modalContainer = div}>
      <div className="modal__bg" onClick={closeModal}></div>
      <div className="modal__content">
        <h3>{`Edit ${user.name.full}`}</h3>
        <form className="form form__edit_user_personal">
          <div className="form__input_container">
            <label>Full name</label>
            <input type="text" name="name" required 
              defaultValue={user.name.full} 
              onChange={handleFormChange} />
          </div>
          <div className="form__input_container">
            <label>Date of birth</label>
            <input type="date" name="dob" required
              defaultValue={moment(user.dob).format("Y-MM-DD")} 
              onBlur={handleFormChange}/>
          </div>
          <div className="form__input_container">
            <label>Gender</label>
            <select name="gender" required defaultValue={user.gender || ""}
              onChange={handleFormChange}>
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
              onChange={handleFormChange}/>
          </div>
          <div className="form__input_container">
            <label>Country</label>
            <input type="text" name="country" required
              defaultValue={user.address ? user.address.country : ""} 
              onChange={handleFormChange}/>
          </div>
          <Button solid type="submit" doClick={handleSubmit}
            text="save" />
        </form>
      </div>
    </div>
  )
}

EditUserPersonal.propTypes = {
  user: propTypes.object,
  doClose: propTypes.func,
  doSubmit :propTypes.func
};

export const EditStudentEducation = ({ student, doClose, doSubmit }) => {
  const closeModal = () => {
    this.modalContainer.classList.add("close");

    if ("function" === typeof doClose)
      doClose();
  };

  const handleSubmit = e => {
    e.preventDefault();

    this.modalContainer.classList.add("close");

    if ("function" === typeof doSubmit)
      doSubmit(student)
  }

  const handleFormChange = e => {
    student[e.target.name] = e.target.value;
  }

  return (
    <div className="modal__container modal__edit_user_personal"
      ref={div => this.modalContainer = div}>
      <div className="modal__bg" onClick={closeModal}></div>
      <div className="modal__content">
        <h3>{`Edit ${student.user.name.full}`}</h3>
        <form className="form form__edit_user_personal">
          <div className="form__input_container">
            <label>High School</label>
            <input type="text" name="highSchool" required
              defaultValue={student.highSchool}
              onChange={handleFormChange} />
          </div>
          <div className="form__input_container">
            <label>University</label>
            <input type="text" name="university" required
              defaultValue={student.university}
              onChange={handleFormChange} />
          </div>
          <div className="form__input_container">
            <label>Major</label>
            <input type="text" name="major" required
              defaultValue={student.major}
              onChange={handleFormChange} />
          </div>
          <div className="form__input_container">
            <label>Minor</label>
            <input type="text" name="minor"
              defaultValue={student.minor}
              onChange={handleFormChange} />
          </div>
          <h4>Meta Information</h4>
          <div className="form__input_container">
            <label>Enrollment Year</label>
            <input type="number" name="enrollmentYear" required
              min="2013" max={new Date().getFullYear()}
              defaultValue={student.enrollmentYear} 
              onChange={handleFormChange}/>
          </div>
          <div className="form__input_container">
            <label>Graduation Year</label>
            <input type="number" name="graduationYear" required
              min="2017"
              defaultValue={student.graduationYear}
              onChange={handleFormChange} />
          </div>
          <Button solid type="submit" doClick={handleSubmit}
            text="save" />
        </form>
      </div>
    </div>
  )
}

EditStudentEducation.propTypes = {
  student: propTypes.object,
  doClose: propTypes.func,
  doSubmit: propTypes.func
};

export const AddPostCategory = ({ doClose, doSubmit }) => {
  const closeModal = () => {
    this.modalContainer.classList.add("close");

    if ("function" === typeof doClose)
      doClose();
  };

  const handleSubmit = e => {
    e.preventDefault();
    
    if ("function" === typeof doSubmit)
      doSubmit(this.categoryInput)
  }

  return (
    <div className="modal__container modal__add_post_category"
      ref={div => this.modalContainer = div}>
      <div className="modal__bg" onClick={closeModal}></div>
      <div className="modal__content">
        <h3>Add post category</h3>
        <form className="form form__add_post_category"
          onSubmit={handleSubmit}>
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

AddPostCategory.propTypes = {
  doClose: propTypes.func,
  doSubmit: propTypes.func
};

export const SignUpModal = ({ doClose, doGoogle, doFacebook, doSignIn, heading, intro }) => {
  const closeModal = () => {
    this.modalContainer.classList.add("close");

    if ("function" === typeof doClose)
      doClose();
  };

  const handleGoogleSignUp = () => {
    if ("function" === typeof doGoogle)
      return doGoogle();
  };

  const handleFacebookSignUp = () => {
    if ("function" === typeof doFacebook)
      return doFacebook();
  };

  const handleSignInClick = () => {
    if ("function" === typeof doSignIn)
      return doSignIn();
  };

  return (
    <div className="modal__container modal__signup"
      ref={div => this.modalContainer = div}>
      <div className="modal__bg" onClick={closeModal}></div>
      <div className="modal__content">
        <h1>{heading}</h1>
        <p>{intro}</p>
        <TextedIconButton doClick={handleGoogleSignUp}
          icon="google" text="Sign up with your Google account." />
        <TextedIconButton doClick={handleFacebookSignUp}
          icon="facebook" text="Sign up with your Facebook account." />
        <p>
          Already have an account? 
          <span className="sign_in__link"
            onClick={handleSignInClick}> Sign in</span>. 
        </p>
      </div>
    </div>
  )
}

SignUpModal.propTypes = {
  doClose: propTypes.func,
  doGoogle: propTypes.func,
  doFacebook: propTypes.func,
  doSignIn: propTypes.func,
  heading: propTypes.string,
  intro: propTypes.string
};

export const SignInModal = ({ doClose, doGoogle, doFacebook, doSignIn, doSignUp }) => {
  const closeModal = () => {
    this.modalContainer.classList.add("close");

    if ("function" === typeof doClose)
      doClose();
  };

  const handleGoogleSignIn = () => {
    if ("function" === typeof doGoogle)
      return doGoogle();
  };

  const handleFacebookSignIn = () => {
    if ("function" === typeof doFacebook)
      return doFacebook();
  };

  const handlleSignIn = (e) => {
    e.preventDefault();
    
    if ("function" === typeof doSignIn)
      return doSignIn(this.emailInput, this.passwordInput);
  };

  const handleSignUpInstead = () => {
    if ("function" === typeof doSignUp)
      return doSignUp();
  }

  return (
    <div className="modal__container modal__signin"
      ref={div => this.modalContainer = div}>
      <div className="modal__bg" onClick={closeModal}></div>
      <div className="modal__content">
        <h3>Sign in</h3>
        <TextedIconButton doClick={handleGoogleSignIn}
          icon="google" text="With Google" />
        <TextedIconButton doClick={handleFacebookSignIn}
          icon="facebook" text="With Facebook" />
        <h3>Or with your email address:</h3>
        <form className="form form__signin"
          onSubmit={handlleSignIn}>
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
              backgroundColor: "#53D1D7"
            }}/>
          <Button type="button" text="sign up instead" solid
            doClick={handleSignUpInstead} 
            styles={{
              backgroundColor: "rgb(153,153,153)",
              marginLeft: "1em"
            }}/>
        </form>
      </div>
    </div>
  )
};

SignInModal.propTypes = {
  doClose: propTypes.func,
  doGoogle: propTypes.func,
  doFacebook: propTypes.func,
  doSignIn: propTypes.func,
  doSignUp: propTypes.func, 
  heading: propTypes.string,
  intro: propTypes.string
};

