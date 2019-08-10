import './Modal.css';

import React, { Component } from 'react';

import _Reauthenticate from './Reauthenticate';
import _AddNationalTest from './AddNationalTest';
import _CreateUserModal from './CreateUserModal';
import _AddRole from './AddRole';
import _DeleteUser from './DeleteUser';
import _EditUserPersonal from './EditUserPersonal';
import _EditStudentEducation from './EditStudentEducation';
import _AddPostCategory from './AddPostCategory';
import _SignUpModal from './SignUpModal';
import _SignInModal from './SignInModal';

import { makeClassString } from '../../utils'; 

interface ModalProps {
  children: React.ReactNode;
  doClose: () => void;
  classes?: string[];
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
export const EditStudentEducation = _EditStudentEducation;
export const AddPostCategory = _AddPostCategory;
export const SignUpModal = _SignUpModal;
export const SignInModal = _SignInModal;