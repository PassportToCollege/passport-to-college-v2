import './Modal.css';

import React, { Component } from 'react';
import Button from '../Button';

interface AddPostCategoryProps {
  doClose: () => void;
  doSubmit: (categoryInput: HTMLInputElement) => void;
}

export default class AddPostCategory extends Component<AddPostCategoryProps> {
  private modalContainer: HTMLDivElement | null = null;
  private categoryInput: HTMLInputElement | null = null;

  private closeModal = () => {
    if (this.modalContainer) {
      this.modalContainer.classList.add('close');
    }

    if ('function' === typeof this.props.doClose) {
      this.props.doClose();
    }
  }

  public handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if ('function' === typeof this.props.doSubmit) {
      this.props.doSubmit(this.categoryInput!);
    }
  }

  public render() {
    return (
      <div 
        className="modal__container modal__add_post_category"
        ref={(div) => this.modalContainer = div}
      >
        <div className="modal__bg" onClick={this.closeModal} />
        <div className="modal__content">
          <h3>Add post category</h3>
          <form 
            className="form form__add_post_category"
            onSubmit={this.handleSubmit}
          >
            <div className="form__input_container">
              <label>Category name</label>
              <input 
                type="text" 
                name="categpry" 
                required={true}
                ref={(input) => this.categoryInput = input} 
              />
            </div>
            <Button 
              type="submit" 
              text="add" 
              solid={true}
              disabled={false} 
            />
          </form>
        </div>
      </div>
    );
  }
}