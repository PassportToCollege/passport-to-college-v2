import "./Modal.css";

import React from "react";
import propTypes from "prop-types";
import moment from "moment";

import { NationalTest, CreateUserForm } from "../Forms";
import WYSIWYGEditor from "../Editor";

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





