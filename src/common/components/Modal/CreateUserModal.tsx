import './Modal.css';

import React, { Component } from 'react';
import { CreateUserForm } from '../Forms';

interface CreateUserModalProps {
  doClose: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default class CreateUserModal extends Component<CreateUserModalProps> {
  private modalContainer: HTMLDivElement | null = null;

  private closeModal = () => {
    if (this.modalContainer) {
      this.modalContainer.classList.add('close');
    }

    if ('function' === typeof this.props.doClose) {
      this.props.doClose();
    }
  }

  private submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    if ('function' === typeof this.props.handleSubmit) {
      this.props.handleSubmit(e);
    }
  }

  private inputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    if ('function' === typeof this.props.handleInputChange) {
      this.props.handleInputChange(e);
    }
  }

  public render() {
    return (
      <div 
        className="modal__container modal__create_user"
        ref={(div) => this.modalContainer = div}
      >
        <div className="modal__bg" onClick={this.closeModal} />
        <div className="modal__content">
          <CreateUserForm handleSubmit={this.submitForm} handleInputChange={this.inputChanged} />
        </div>
      </div>
    );
  }
}