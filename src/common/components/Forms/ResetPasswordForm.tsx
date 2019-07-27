import './Forms.css';

import React, { Component } from 'react';

interface ResetPasswordFormProps {
  title: string;
  submitText: string;
  authError: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  updateEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updatePassword: () => void;
}

export default class ResetPasswordForm extends Component<ResetPasswordFormProps> {
  public render() {
    return (
      <form 
        className="form auth__form reset__form" 
        method="post" 
        onSubmit={this.props.handleSubmit}
      >
        {
          this.props.title ?
            <h2 className="form__title">{this.props.title}</h2> :
            null
        }
        <div className="form__input_container">
          <input 
            type="email" 
            name="email" 
            required={true} 
            onChange={this.props.updateEmail} 
          />
          <label>Email</label>
        </div>
        <div className="form__input_container">
          <button 
            className="form__button" 
            type="submit"
          >
            {this.props.submitText || 'Reset'}
          </button>
        </div>
      </form>
    );
  }
}