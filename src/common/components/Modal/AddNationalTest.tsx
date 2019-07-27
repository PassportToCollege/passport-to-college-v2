import './Modal.css';

import React, { Component } from 'react';
import { NationalTestForm } from '../Forms';

interface AddNationalTestProps {
  doClose: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLSelectElement> | React.FocusEvent<HTMLInputElement>) => void;
  handleTestAdded: () => void;
}

export default class AddNationalTest extends Component<AddNationalTestProps> {
  private modalContainer: HTMLDivElement | null = null;

  private closeModal = () => {
    if (this.modalContainer) {
      this.modalContainer.classList.add('close');
    }

    if ('function' === typeof this.props.doClose) {
      this.props.doClose();
    }
  }

  public addTest = () => {
    if ('function' === typeof this.props.handleTestAdded) {
      this.props.handleTestAdded();
    }

    this.closeModal();
  }

  public inputChanged = (e: React.ChangeEvent<HTMLSelectElement> | React.FocusEvent<HTMLInputElement>) => {
    if ('function' === typeof this.props.handleInputChange) {
      this.props.handleInputChange(e);
    }
  }

  public render() {
    return (
      <div 
        className="modal__container modal__add_national_test"
        ref={(div) => this.modalContainer = div}
      >
        <div className="modal__bg" onClick={this.closeModal} />
        <div className="modal__content">
          <NationalTestForm handleTestAdded={this.addTest} handleInputChange={this.inputChanged} />
        </div>
      </div>
    );
  }
}