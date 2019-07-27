import './Modal.css';

import React, { Component } from 'react';
import moment from 'moment';

import Button from '../Button';
import User from '../../models/User';

interface EditUserPersonalProps {
  user: User;
  doClose: () => void;
  doSubmit: (user: User) => void;
}

export default class EditUserPersonal extends Component<EditUserPersonalProps> {
  private modalContainer: HTMLDivElement | null = null;

  private closeModal = () => {
    if (this.modalContainer) {
      this.modalContainer.classList.add('close');
    }

    if ('function' === typeof this.props.doClose) {
      this.props.doClose();
    }
  }

  private handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (this.modalContainer) {
      this.modalContainer.classList.add('close');
    }

    if ('function' === typeof this.props.doSubmit) {
      this.props.doSubmit(this.props.user);
    }
  }

  private handleFormChange = (e: 
      React.ChangeEvent<HTMLSelectElement> | 
      React.FocusEvent<HTMLInputElement> | 
      React.ChangeEvent<HTMLInputElement>) => {
    const { user } = this.props;

    switch (e.target.name) {
      case 'country':
        if (user.address) {
          user.address.country = e.target.value;
        } else {
          user.address = {
            country: e.target.value
          };
        }

        break;
      case 'dob':
        user.dob = new Date(moment.utc(moment(e.target.value)).toDate()).getTime();
        break;
      default:
        user[e.target.name] = e.target.value;
    }
  }

  public render() {
    const { user } = this.props;

    return (
      <div 
        className="modal__container modal__edit_user_personal"
        ref={(div) => this.modalContainer = div}
      >
        <div className="modal__bg" onClick={this.closeModal} />
        <div className="modal__content">
          <h3>{`Edit ${user.name.full}`}</h3>
          <form className="form form__edit_user_personal">
            <div className="form__input_container">
              <label>Full name</label>
              <input 
                type="text" 
                name="name" 
                required={true}
                defaultValue={user.name.full()}
                onChange={this.handleFormChange} 
              />
            </div>
            <div className="form__input_container">
              <label>Date of birth</label>
              <input 
                type="date" 
                name="dob" 
                required={true}
                defaultValue={moment(user.dob).format('Y-MM-DD')}
                onBlur={this.handleFormChange} 
              />
            </div>
            <div className="form__input_container">
              <label>Gender</label>
              <select 
                name="gender" 
                required={true} 
                defaultValue={user.gender || ''}
                onChange={this.handleFormChange}
              >
                <option value="" disabled={true}>Select One</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>
            <h4>Contact Information</h4>
            <div className="form__input_container">
              <label>Email</label>
              <input 
                type="email" 
                name="email" 
                required={true} 
                disabled={true}
                defaultValue={user.email} 
              />
            </div>
            <div className="form__input_container">
              <label>Phone</label>
              <input 
                type="tel" 
                name="phone" 
                required={true}
                defaultValue={user.phone}
                onChange={this.handleFormChange} 
              />
            </div>
            <div className="form__input_container">
              <label>Country</label>
              <input 
                type="text" 
                name="country" 
                required={true}
                defaultValue={user.address ? user.address.country : ''}
                onChange={this.handleFormChange} 
              />
            </div>
            <Button 
              solid={true}
              disabled={false} 
              type="submit" 
              doClick={this.handleSubmit}
              text="save" 
            />
          </form>
        </div>
      </div>
    );
  }
}