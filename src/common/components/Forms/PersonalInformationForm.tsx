import './Forms.css';

import React, { Component } from 'react';
import moment from 'moment';
import User from '../../models/User';

interface PersonalInformationFormProps {
  user: User;
  disabled: boolean;
  updateField: (e: React.FocusEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
}

export default class PersonalInformationForm extends Component<PersonalInformationFormProps> {
  public render() {
    return (
      <form className="form application_task__form application__personal_information">
        <fieldset disabled={this.props.disabled}>
          <div className="form__input_container">
            <input 
              type="text" 
              name="name" 
              required={true}
              onBlur={this.props.updateField}
              defaultValue={this.props.user.name.full()}
              placeholder="John Doe" 
            />
            <label>Full Name</label>
          </div>
          <div className="form__input_container">
            <input 
              type="email" 
              name="email" 
              required={true}
              onBlur={this.props.updateField}
              defaultValue={this.props.user.email}
              placeholder="johndoe@jd.com" 
            />
            <label>Email</label>
          </div>
          <div className="form__input_container">
            <input 
              type="phone" 
              name="phone" 
              required={true}
              onBlur={this.props.updateField}
              defaultValue={this.props.user.phone}
              placeholder="000-000-0000" 
            />
            <label>Phone</label>
          </div>
          <div className="form__input_container">
            <select 
              name="gender" 
              onChange={this.props.updateField} 
              defaultValue={this.props.user.gender || ''}
            >
              <option value="" disabled={true}>Select One</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
            <label>Gender</label>
          </div>
          {/* TODO: Replace with custom date picker */}
          <div className="form__input_container">
            <input 
              type="date" 
              name="dob" 
              required={true}
              onBlur={this.props.updateField}
              defaultValue={moment.utc(this.props.user.dob).format('Y-MM-DD')} 
            />
            <label>Date of Birth</label>
          </div>
          {/* TODO: Replace with custom country picker */}
          <div className="form__input_container">
            <input 
              type="text" 
              name="country" 
              required={true}
              onBlur={this.props.updateField}
              defaultValue={this.props.user.address ? this.props.user.address.country : ''}
              placeholder="Jamaica" 
            />
            <label>Country</label>
          </div>
        </fieldset>
      </form>
    );
  }
}