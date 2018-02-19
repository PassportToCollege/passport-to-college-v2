import "./Modal.css";

import React from "react";
import propTypes from "prop-types";

import { NationalTest } from "../Forms";

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

export const AddNationalTest = ({ doClose }) => {
  const closeModal = () => {
    this.modalContainer.classList.add("close");

    if ("function" === typeof doClose)
      doClose();
  }

  return (
    <div className="modal__container modal__add_national_test"
      ref={div => this.modalContainer = div}>
      <div className="modal__bg" onClick={closeModal}></div>
      <div className="modal__content">
        <NationalTest />
      </div>
    </div>
  )
}

// Proptypes
ReauthenticateModal.propTypes = {
  doAuthenticate: propTypes.func
};

AddNationalTest.propTypes = {
  doClose: propTypes.func
};

