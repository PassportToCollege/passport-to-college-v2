import './Modal.css';

import React, { Component } from 'react';

interface ReauthenticateProps {
  doAuthenticate: (password: string) => void;
}

export default class Reauthenticate extends Component<ReauthenticateProps> {
  private modal: HTMLDivElement | null = null;
  private passwordInput: HTMLInputElement | null = null;

  private closeModal = () => {
    if (this.modal) {
      this.modal.classList.add('close');
    }
  }

  private handleAuthenticate = () => {
    if ('function' === typeof this.props.doAuthenticate) {
      this.props.doAuthenticate(this.passwordInput!.value);
      this.closeModal();
    }
  }

  public render() {
    return (
      <div 
        className="modal__container modal__reauthenticate" 
        ref={(div) => this.modal = div}
      >
        <div 
          className="modal__bg" 
          onClick={this.closeModal} 
        />
        <div className="modal__content">
          <p>You need to re-authenticate to change your email address.</p>
          <input 
            type="password" 
            name="password"
            placeholder="*********"
            ref={(input) => this.passwordInput = input} 
          />
          <label>Password</label>
          <button 
            className="button button__solid" 
            onClick={this.handleAuthenticate}
          >
            Re-Authenticate
          </button>
        </div>
      </div>
    );
  }
}