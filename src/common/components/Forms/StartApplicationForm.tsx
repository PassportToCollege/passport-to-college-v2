import './Forms.css';

import React, { Component } from 'react';

import TextedIconButton from '../TextedIconButton';
import Loader from '../Loader';
import { ValidProvider } from '../../actions/auth/dispatchers';

interface StartApplicationFormProps {
  title?: string;
  subtitle?: string;
  isWorking: boolean;
  updateEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updatePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAccountCreation: (e: React.FormEvent<HTMLFormElement>) => void;
  handleSocialSignUp?: (provider: ValidProvider) => void;
}

export default class StartApplicationForm extends Component<StartApplicationFormProps> {
  private handleFacebookSignUp = () => {
    if ('function' === typeof this.props.handleSocialSignUp) {
      this.props.handleSocialSignUp('facebook');
    }
  }

  private handleGoogleSignUp = () => {
    if ('function' === typeof this.props.handleSocialSignUp) {
      this.props.handleSocialSignUp('google');
    }
  }

  public render() {
    return (
      <form 
        className="form auth__form start_application__form" 
        method="post" 
        onSubmit={this.props.handleAccountCreation}
      >
        {
          this.props.title ?
            <h5 className="form__title">{this.props.title}</h5> :
            null
        }
        <div className="form__social_signins">
          <TextedIconButton
            icon="google"
            text="Start with Google"
            doClick={this.handleGoogleSignUp}
            buttonStyles={{
              margin: '2rem 0',
              display: 'inline-block'
            }}
          />
          <TextedIconButton
            icon="facebook"
            text="Start with Facebook"
            doClick={this.handleFacebookSignUp}
            buttonStyles={{
              margin: '2rem 0 2rem 2rem',
              display: 'inline-block'
            }}
          />
        </div>
        {
          this.props.subtitle ?
            <h5 className="form__title">{this.props.subtitle}</h5> :
            null
        }
        <div className="form__input_container">
          <input type="text" name="name" required={true} onChange={this.props.updateName} />
          <label>Full Name</label>
        </div>
        <div className="form__input_container">
          <input type="email" name="email" required={true} onChange={this.props.updateEmail} />
          <label>Email</label>
        </div>
        <div className="form__input_container">
          <input type="password" name="password" required={true} onChange={this.props.updatePassword} />
          <label>Password</label>
        </div>
        <div className="form__input_container">
          <button className="form__button" type="submit">Create Account</button>
          {
            this.props.isWorking
              ? <Loader
                width="48px"
                styles={{
                  position: 'absolute',
                  right: '3.5rem',
                  top: '2rem'
                }}
              />
              : null
          }
        </div>
      </form>
    );
  }
}