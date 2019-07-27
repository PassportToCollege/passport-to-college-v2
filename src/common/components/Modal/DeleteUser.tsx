import './Modal.css';

import React, { Component } from 'react';
import Button from '../Button';

interface DeleteUserProps {
  name: string;
  doClose: () => void;
  doSubmit: (nameInput: HTMLInputElement) => void;
}

export default class DeleteUser extends Component<DeleteUserProps> {
  private modalContainer: HTMLDivElement | null = null;
  private nameInput: HTMLInputElement | null = null;

  private closeModal = () => {
    if (this.modalContainer) {
      this.modalContainer.classList.add('close');
    }

    if ('function' === typeof this.props.doClose) {
      this.props.doClose();
    }
  }

  private handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (this.nameInput && 
      this.nameInput.value !== this.props.name) {
      this.nameInput.classList.add('error');
      return;
    }

    this.closeModal();

    if ('function' === typeof this.props.doSubmit) {
      this.props.doSubmit(this.nameInput!);
    }
  }

  public render() {
    return (
      <div 
        className="modal__container modal__delete_user"
        ref={(div) => this.modalContainer = div}
      >
        <div className="modal__bg" onClick={this.closeModal} />
        <div className="modal__content">
          <h3>Confirm Delete</h3>
          <p>You are about to remove a user account. This action cannot be undone.</p>
          <form 
            className="form form__delete_user"
            onSubmit={this.handleSubmit}
          >
            <label>Type user&apos;s full name to confirm delete</label>
            <input 
              type="text" 
              name="name" 
              required={true}
              ref={(input) => this.nameInput = input} 
            />
            <Button 
              solid={true} 
              type="submit"
              disabled={false} 
              doClick={this.handleSubmit}
              text="remove" 
            />
            <Button 
              solid={false}
              disabled={false}
              type="button" 
              doClick={this.closeModal}
              text="cancel"
            />
          </form>
        </div>
      </div>
    );
  }
}