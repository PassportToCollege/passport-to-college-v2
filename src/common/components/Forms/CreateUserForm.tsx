import './Form.css';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Button from '../Button';
import { USERS_CREATE } from '../../constants/routes';

interface CreateUserFormProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default class CreateUserForm extends Component<CreateUserFormProps> {
  public render() {
    return (
      <form 
        className="form create_user__form" 
        method="post"
        onSubmit={this.props.handleSubmit}
      >
        <h2>Add quick user</h2>
        <p>
          Create a simple user (name, email, role) and send the new user a sign up email. To create a full user profile
        <Link to={USERS_CREATE.route}> click here</Link>.
      </p>
        <div className="form__input_container">
          <input 
            type="text" 
            name="name" 
            required={true}
            onChange={this.props.handleInputChange}
            placeholder="John Doe" 
          />
          <label>Full Name</label>
        </div>
        <div className="form__input_container">
          <input 
            type="text" 
            name="email" 
            required={true}
            onChange={this.props.handleInputChange}
            placeholder="johndoe@gmail.com" 
          />
          <label>Email</label>
        </div>
        <div className="form__input_container">
          <h3>Roles</h3>
          <span>
            <input 
              type="checkbox" 
              name="roles" 
              id="admin"
              onChange={this.props.handleInputChange} 
              value="admin" 
            />
            <label htmlFor="admin">Admin</label>
          </span>
          <span>
            <input 
              type="checkbox" 
              name="roles" 
              id="student"
              onChange={this.props.handleInputChange} 
              value="student" 
            />
            <label htmlFor="student">Student</label>
          </span>
          <span>
            <input 
              type="checkbox" 
              name="roles" 
              id="staff"
              onChange={this.props.handleInputChange} 
              value="staff" 
            />
            <label htmlFor="staff">Staff</label>
          </span>
        </div>
        <Button 
          type="submit" 
          text="add" 
          solid={true} 
          disabled={false}
        />
      </form>
    );
  }
}