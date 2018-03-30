import "./Modal.css";

import React from "react";
import propTypes from "prop-types";
import moment from "moment";

import { NationalTest, CreateUserForm } from "../Forms";
import WYSIWYGEditor from "../Editor";
import Button from "../Button";

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



