import './Modal.css';

import React, { Component } from 'react';
import Button from '../Button';

interface AddRoleProps {
  role: string;
  doClose: () => void;
  doSubmit: (roleInput: HTMLInputElement) => void;
}

export default class AddRole extends Component<AddRoleProps> {
  private modalContainer: HTMLDivElement | null = null;
  private roleInput: HTMLInputElement | null = null;

  private closeModal = () => {
    if (this.modalContainer) {
      this.modalContainer.classList.add('close');
    }

    if ('function' === typeof this.props.doClose) {
      this.props.doClose();
    }
  }

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (this.modalContainer) {
      this.modalContainer.classList.add('close');
    }

    if ('function' === typeof this.props.doSubmit) {
      this.props.doSubmit(this.roleInput!);
    }
  }

  public render() {
    return (
      <div 
        className="modal__container modal__add_role"
        ref={(div) => this.modalContainer = div}
      >
        <div className="modal__bg" onClick={this.closeModal} />
        <div className="modal__content">
          <h3>{this.props.role ? 'Edit role' : 'Add role'}</h3>
          <form 
            className="form form__add_role"
            onSubmit={this.handleSubmit}
          >
            <input 
              type="text" 
              name="role" 
              required={true}
              ref={(input) => this.roleInput = input}
              defaultValue={this.props.role || ''} 
            />
            <Button 
              solid={true} 
              type="submit"
              disabled={false} 
              text={this.props.role ? 'change' : 'add'} 
            />
          </form>
        </div>
      </div>
    );
  }
}