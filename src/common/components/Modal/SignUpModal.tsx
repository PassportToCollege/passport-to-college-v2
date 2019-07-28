import './Modal.css';

import React, { Component } from 'react';
import TextedIconButton from '../TextedIconButton';

interface SignUpModalProps {
  intro: string;
  heading: string;
  doClose: () => void;
  doGoogle: () => void;
  doFacebook: () => void;
  doSignIn: () => void;
}

export default class SignUpModal extends Component<SignUpModalProps> {
  private modalContainer: HTMLDivElement | null = null;

  private closeModal = () => {
    if (this.modalContainer) {
      this.modalContainer.classList.add('close');
    }

    if ('function' === typeof this.props.doClose) {
      this.props.doClose();
    }
  }

  public handleGoogleSignUp = () => {
    if ('function' === typeof this.props.doGoogle) {
      return this.props.doGoogle();
    }
  }

  public handleFacebookSignUp = () => {
    if ('function' === typeof this.props.doFacebook) {
      return this.props.doFacebook();
    }
  }

  public handleSignInClick = () => {
    if ('function' === typeof this.props.doSignIn) {
      return this.props.doSignIn();
    }
  }

  public render() {
    return (
      <div 
        className="modal__container modal__signup"
        ref={(div) => this.modalContainer = div}
      >
        <div className="modal__bg" onClick={this.closeModal} />
        <div className="modal__content">
          <h1>{this.props.heading}</h1>
          <p>{this.props.intro}</p>
          <TextedIconButton 
            doClick={this.handleGoogleSignUp}
            icon="google" 
            text="Sign up with your Google account." 
          />
          <TextedIconButton 
            doClick={this.handleFacebookSignUp}
            icon="facebook" 
            text="Sign up with your Facebook account." 
          />
          <p>
            Already have an account?
            <span 
              className="sign_in__link"
              onClick={this.handleSignInClick}
            > 
              Sign in
            </span>.
          </p>
        </div>
      </div>
    );
  }
}