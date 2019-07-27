import './Forms.css';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { ValidConnection } from '../ConnectionsStrip';
import TextedIconButton from '../TextedIconButton';
import Loader from '../Loader';

interface SignInFormProps {
  title: string;
  subtitle: string;
  submitText: string;
  authError: boolean;
  isWorking: boolean;
  handleSubmit: () => void;
  updateEmail: () => void;
  updatePassword: () => void;
  handleSocialSignIn: (connection: ValidConnection) => void;
}

interface SignInFormState {
  tries: number;
}

export  default class SignInForm extends Component<SignInFormProps, SignInFormState> {
  constructor(props: SignInFormProps) {
    super(props);

    this.state = {
      tries: 0
    };
  }

  private handleFacebookSignIn = () => {
    if ('function' === typeof this.props.handleSocialSignIn) {
      this.props.handleSocialSignIn('facebook');
    }
  }

  private handleGoogleSignIn = () => {
    if ('function' === typeof this.props.handleSocialSignIn) {
      this.props.handleSocialSignIn('google');
    }
  }

  public static getDerivedStateFromProps(nextProps: SignInFormProps, prevState: SignInFormState) {
    if (nextProps.authError) {
      return { tries: prevState.tries + 1 };
    }

    return null;
  }

  public render() {
    return (
      <form className="form auth__form signin__form" method="post" onSubmit={this.props.handleSubmit}>
        {
          this.props.title ?
            <h5 className="form__title">{this.props.title}</h5> : null
        }
        <div className="form__social_signins">
          <TextedIconButton 
            icon="google" 
            text="Google Account"
            doClick={this.handleGoogleSignIn}
            buttonStyles={{
              margin: '2rem 0',
              display: 'inline-block'
            }} 
          />
          <TextedIconButton 
            icon="facebook" 
            text="Facebook Account"
            doClick={this.handleFacebookSignIn}
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
          <input type="email" name="email" required={true} onChange={this.props.updateEmail} />
          <label>Email</label>
        </div>
        <div className="form__input_container">
          <input type="password" name="password" required={true} onChange={this.props.updatePassword} />
          <label>Password</label>
        </div>
        <div className="form__input_container">
          <button className="form__button" type="submit">{this.props.submitText || 'Sign In'}</button>
          {
            this.props.isWorking ?
              <Loader 
                width="48px" 
                styles={{
                  position: 'absolute',
                  right: '3.5rem',
                  top: '2rem'
                }} 
              />
            :
              null
          }
        </div>
        {
          this.state.tries > 0 ?
            <Link 
              to="/auth/reset-password" 
              className="form__reset_password"
            >
              Trouble signing in?
            </Link>
          :
            null
        }
      </form>
    );
  }
}