import './Forms.css';

import React, { Component } from 'react';
import User from '../../models/User';
import Button from '../Button';
import Loader from '../Loader';

interface SignUpFormProps {
  user: User;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isWorking: boolean;
}

export default class SignUpForm extends Component<SignUpFormProps> {
  public render() {
    const { user, handleSubmit, handleInputChange, isWorking } = this.props;

    return (
      <form 
        className="form auth__form signup__form" 
        method="post"
        onSubmit={handleSubmit}
      >
        <h2 className="form__title">Complete signup</h2>
        <div className="form__input_container">
          <input 
            type="text" 
            name="name" 
            required={true} 
            onChange={handleInputChange}
            defaultValue={user.name.full()} 
          />
          <label>Full Name</label>
        </div>
        <div className="form__input_container">
          <input 
            type="text" 
            name="email" 
            required={true} 
            onChange={handleInputChange}
            defaultValue={user.email} 
          />
          <label>Email</label>
        </div>
        <h4>Create password</h4>
        <div className="form__input_container">
          <input 
            type="password" 
            name="password" 
            required={true} 
            onChange={handleInputChange} 
          />
          <label>Password</label>
        </div>
        <div className="form__input_container">
          <input 
            type="password" 
            name="confirm_password" 
            required={true} 
            onChange={handleInputChange} 
          />
          <label>Confirm Password</label>
        </div>
        <div className="form__input_container">
          <Button 
            type="submit" 
            text="done"
            disabled={false} 
            solid={true}
            doClick={() => { return; }} 
          />
          {
            isWorking ?
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
      </form>
    );
  }
}