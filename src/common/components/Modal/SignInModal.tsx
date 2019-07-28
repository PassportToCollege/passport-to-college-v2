import './Modal.css';

import React, { Component } from 'react';
import TextedIconButton from '../TextedIconButton';
import Button from '../Button';

interface SignInModalProps {
  intro: string;
  heading: string;
  withEmail: boolean;
  signup: boolean;
  cancelButton?: boolean;
  doClose: () => void;
  doGoogle: () => void;
  doFacebook: () => void;
  doSignIn: (email: string, password: string) => void;
  doSignUp: () => void;
}

export default class SignInModal extends Component<SignInModalProps> {
  private modalContainer: HTMLDivElement | null = null;
  private emailInput: HTMLInputElement | null = null;
  private passwordInput: HTMLInputElement | null = null;

  private closeModal = () => {
    if (this.modalContainer) {
      this.modalContainer.classList.add('close');
    }

    if ('function' === typeof this.props.doClose) {
      this.props.doClose();
    }
  }

  private handleGoogleSignIn = () => {
    if ('function' === typeof this.props.doGoogle) {
      return this.props.doGoogle();
    }
  }

  public handleFacebookSignIn = () => {
    if ('function' === typeof this.props.doFacebook) {
      return this.props.doFacebook();
    }
  }

  public handlleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if ('function' === typeof this.props.doSignIn) {
      return this.props.doSignIn(this.emailInput!.value, this.passwordInput!.value);
    }
  }

  public handleSignUpInstead = () => {
    if ('function' === typeof this.props.doSignUp) {
      return this.props.doSignUp();
    }
  }

  public render() {
    return (
      <div 
        className="modal__container modal__signin"
        ref={(div) => this.modalContainer = div}
      >
        <div className="modal__bg" onClick={this.closeModal} />
        <div className="modal__content">
          <h4>Sign in</h4>
          <p>{this.props.intro}</p>
          <TextedIconButton 
            doClick={this.handleGoogleSignIn}
            icon="google" 
            text="Google account" 
          />
          <TextedIconButton 
            doClick={this.handleFacebookSignIn}
            icon="facebook" 
            text="Facebook account" 
          />
          {
            this.props.withEmail
              ? <React.Fragment>
                <h4>Or with your email address:</h4>
                <form 
                  className="form form__signin"
                  onSubmit={this.handlleSignIn}
                >
                  <div className="form__input_container">
                    <label htmlFor="email">Email address</label>
                    <input 
                      type="text" 
                      id="email" 
                      name="email" 
                      required={true}
                      ref={(input) => this.emailInput = input} 
                    />
                  </div>
                  <div className="form__input_container">
                    <label htmlFor="password">Password</label>
                    <input 
                      type="password" 
                      id="password" 
                      name="password" 
                      required={true}
                      ref={(input) => this.passwordInput = input} 
                    />
                  </div>
                  {
                    this.props.cancelButton
                      ? <Button 
                        disabled={false}
                        type="button" 
                        text="cancel" 
                        solid={true}
                        doClick={this.closeModal}
                        styles={{
                          backgroundColor: 'rgb(153,153,153)',
                          marginRight: '1em'
                        }} 
                      /> 
                      : null
                  }
                  <Button 
                    type="submit" 
                    text="sign in" 
                    solid={true}
                    disabled={false}
                    styles={{
                      backgroundColor: '#FF6561'
                    }} 
                  />
                  {
                    this.props.signup
                      ? <Button
                        disabled={false}
                        type="button" 
                        text="sign up instead" 
                        solid={true}
                        doClick={this.handleSignUpInstead}
                        styles={{
                          backgroundColor: 'rgb(153,153,153)',
                          marginLeft: '1em'
                        }} 
                      /> 
                      : null
                  }
                </form>
              </React.Fragment> 
              : null
          }
        </div>
      </div>
    );
  }
}