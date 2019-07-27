import './Modal.css';

import React, { Component } from 'react';
import propTypes from 'prop-types';
import moment from 'moment';


import Button from '../Button';
import TextedIconButton from '../TextedIconButton';

import _Reauthenticate from './Reauthenticate';
import _AddNationalTest from './AddNationalTest';
import _CreateUserModal from './CreateUserModal';
import _AddRole from './AddRole';
import _DeleteUser from './DeleteUser';
import _EditUserPersonal from './EditUserPersonal';

import { makeClassString } from '../../utils'; 

interface ModalProps {
  children: React.ReactChildren;
  doClose: () => void;
  classes: string[];
}

export default class Modal extends Component<ModalProps> {
  private modal: HTMLDivElement | null = null;

  private closeModal = () => {
    if (this.modal) {
      this.modal.classList.add('close');
    }

    if ('function' === typeof this.props.doClose) {
      this.props.doClose();
    }
  }

  private listenForEscape = (e: any) => {
    e.preventDefault();

    const key = e.key || e.keyCode;

    if (key === 'Escape' || key === 'Esc' || key === 27) {
      this.closeModal();
    }

    return;
  }

  public componentDidMount() {
    document.addEventListener('keyup', this.listenForEscape, false);
  }

  public componentWillUnmount() {
    document.removeEventListener('keyup', this.listenForEscape, false);
  }

  public render() {
    return (
      <div 
        className={`modal__container modal ${makeClassString(this.props.classes)}`}
        ref={(div) => this.modal = div}
      >
        <div className="modal__bg" onClick={this.closeModal}/>
        <div className="modal__content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export const Reauthenticate = _Reauthenticate;
export const AddNationalTest = _AddNationalTest;
export const CreateUserModal = _CreateUserModal;
export const AddRole = _AddRole;
export const DeleteUser = _DeleteUser;
export const EditUserPersonal = _EditUserPersonal;



export class EditStudentEducation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      student: props.student
    };
  }

  public static propTypes = {
    student: propTypes.object,
    doClose: propTypes.func,
    doSubmit: propTypes.func
  };

  public render() {
    const { student } = this.state;

    return (
      <div className="modal__container modal__edit_user_personal"
        ref={(div) => this.modalContainer = div}>
        <div className="modal__bg" onClick={this.closeModal}/>
        <div className="modal__content">
          <h3>{`Edit ${student.user.name.full}`}</h3>
          <form className="form form__edit_user_personal">
            <div className="form__input_container">
              <label>High School</label>
              <input type="text" name="highSchool" required={true}
                defaultValue={student.highSchool}
                onChange={this.handleFormChange} />
            </div>
            <div className="form__input_container">
              <label>University</label>
              <input type="text" name="university" required={true}
                defaultValue={student.university}
                onChange={this.handleFormChange} />
            </div>
            <div className="form__input_container">
              <label>Major</label>
              <input type="text" name="major" required={true}
                defaultValue={student.major}
                onChange={this.handleFormChange} />
            </div>
            <div className="form__input_container">
              <label>Minor</label>
              <input type="text" name="minor"
                defaultValue={student.minor}
                onChange={this.handleFormChange} />
            </div>
            <h4>Meta Information</h4>
            <div className="form__input_container">
              <label>Enrollment Year</label>
              <input type="number" name="enrollmentYear" required={true}
                min="2013" max={new Date().getFullYear()}
                defaultValue={student.enrollmentYear} 
                onChange={this.handleFormChange}/>
            </div>
            <div className="form__input_container">
              <label>Graduation Year</label>
              <input type="number" name="graduationYear" required={true}
                min="2017"
                defaultValue={student.graduationYear}
                onChange={this.handleFormChange} />
            </div>
            <Button solid={true} type="submit" doClick={this.handleSubmit}
              text="save" />
          </form>
        </div>
      </div>
    );
  }

  public closeModal = () => {
    this.modalContainer.classList.add('close');

    if ('function' === typeof this.props.doClose) {
      this.props.doClose();
    }
  }

  public handleSubmit = (e) => {
    e.preventDefault();

    this.modalContainer.classList.add('close');

    if ('function' === typeof this.props.doSubmit) {
      this.props.doSubmit(this.state.student)
    }
  }

  public handleFormChange = (e) => {
    this.setState({ student: {...this.state.student, 
        [e.target.name]: e.target.value} 
    });
  }
}

export class AddPostCategory extends Component {
  public static propTypes = {
    doClose: propTypes.func,
    doSubmit: propTypes.func
  };

  public render() {
    return (
      <div className="modal__container modal__add_post_category"
        ref={(div) => this.modalContainer = div}>
        <div className="modal__bg" onClick={this.closeModal}/>
        <div className="modal__content">
          <h3>Add post category</h3>
          <form className="form form__add_post_category"
            onSubmit={this.handleSubmit}>
            <div className="form__input_container">
              <label>Category name</label>
              <input type="text" name="categpry" required={true}
                ref={(input) => this.categoryInput = input} />
            </div>
            <Button type="submit" text="add" solid={true} />
          </form>
        </div>
      </div>
    );
  }

   public closeModal = () => {
    this.modalContainer.classList.add('close');

    if ('function' === typeof this.props.doClose) {
      this.props.doClose();
    }
   }

   public handleSubmit = (e) => {
     e.preventDefault();

     if ('function' === typeof this.props.doSubmit) {
      this.props.doSubmit(this.categoryInput)
     }
   }
}

export class SignUpModal extends Component {
  public static propTypes = {
    doClose: propTypes.func,
    doGoogle: propTypes.func,
    doFacebook: propTypes.func,
    doSignIn: propTypes.func,
    heading: propTypes.string,
    intro: propTypes.string
  };

  public render() {
    return (
      <div className="modal__container modal__signup"
        ref={(div) => this.modalContainer = div}>
        <div className="modal__bg" onClick={this.closeModal}/>
        <div className="modal__content">
          <h1>{this.props.heading}</h1>
          <p>{this.props.intro}</p>
          <TextedIconButton doClick={this.handleGoogleSignUp}
            icon="google" text="Sign up with your Google account." />
          <TextedIconButton doClick={this.handleFacebookSignUp}
            icon="facebook" text="Sign up with your Facebook account." />
          <p>
            Already have an account? 
            <span className="sign_in__link"
              onClick={this.handleSignInClick}> Sign in</span>. 
          </p>
        </div>
      </div>
    );
  }

  public closeModal = () => {
    this.modalContainer.classList.add('close');

    if ('function' === typeof this.props.doClose) {
      this.props.doClose();
    }
  }

  public handleGoogleSignUp = () => {
    if ('function' === typeof this.props.doGoogle) {
      return this.props.doGoogle("google");
    }
  }

  public handleFacebookSignUp = () => {
    if ('function' === typeof this.props.doFacebook) {
      return this.props.doFacebook("facebook");
    }
  }

  public handleSignInClick = () => {
    if ('function' === typeof this.props.doSignIn) {
      return this.props.doSignIn();
    }
  }
}

export class SignInModal extends Component {
  public static propTypes = {
    doClose: propTypes.func,
    doGoogle: propTypes.func,
    doFacebook: propTypes.func,
    doSignIn: propTypes.func,
    doSignUp: propTypes.func,
    heading: propTypes.string,
    intro: propTypes.string,
    withEmail: propTypes.bool,
    signup: propTypes.bool,
    cancelButton: propTypes.bool
  };

  public static defaultProps = {
    withEmail: true,
    signup: true,
    cancelButton: false
  };

  public render() {
    return (
      <div className="modal__container modal__signin"
        ref={(div) => this.modalContainer = div}>
        <div className="modal__bg" onClick={this.closeModal}/>
        <div className="modal__content">
          <h4>Sign in</h4>
          <p>{this.props.intro}</p>
          <TextedIconButton doClick={this.handleGoogleSignIn}
            icon="google" text="Google account" />
          <TextedIconButton doClick={this.handleFacebookSignIn}
            icon="facebook" text="Facebook account" />
          {
            this.props.withEmail ?
              <React.Fragment>
                <h4>Or with your email address:</h4>
                <form className="form form__signin"
                  onSubmit={this.handlleSignIn}>
                  <div className="form__input_container">
                    <label htmlFor="email">Email address</label>
                    <input type="text" id="email" name="email" required={true}
                      ref={(input) => this.emailInput = input} />
                  </div>
                  <div className="form__input_container">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" required={true}
                      ref={(input) => this.passwordInput = input} />
                  </div>
                  {
                    this.props.cancelButton ?
                      <Button type="button" text="cancel" solid={true}
                        doClick={this.closeModal} 
                        styles={{
                          backgroundColor: 'rgb(153,153,153)',
                          marginRight: '1em'
                        }}/> : null
                  }
                  <Button type="submit" text="sign in" solid={true} 
                    styles={{
                      backgroundColor: '#FF6561'
                    }}/>
                  {
                    this.props.signup ?
                      <Button type="button" text="sign up instead" solid={true}
                        doClick={this.handleSignUpInstead} 
                        styles={{
                          backgroundColor: 'rgb(153,153,153)',
                          marginLeft: '1em'
                        }}/> : null
                  }
                </form>
              </React.Fragment> : null
          }
        </div>
      </div>
    );
  }

  public closeModal = () => {
    this.modalContainer.classList.add('close');

    if ('function' === typeof this.props.doClose) {
      this.props.doClose();
    }
  }

  public handleGoogleSignIn = () => {
    if ('function' === typeof this.props.doGoogle) {
      return this.props.doGoogle("google");
    }
  }

  public handleFacebookSignIn = () => {
    if ('function' === typeof this.props.doFacebook) {
      return this.props.doFacebook("facebook");
    }
  }

  public handlleSignIn = (e) => {
    e.preventDefault();

    if ('function' === typeof this.props.doSignIn) {
      return this.props.doSignIn(this.emailInput, this.passwordInput);
    }
  }

  public handleSignUpInstead = () => {
    if ('function' === typeof this.props.doSignUp) {
      return this.props.doSignUp();
    }
  }
}

