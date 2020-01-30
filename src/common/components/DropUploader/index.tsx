import './DropUploader.css';

import React, { Component } from 'react';
import propTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/fontawesome-free-solid';

interface DropUploaderProps {
  disabled?: boolean;
  uploaderStyles: React.CSSProperties;
  dropAreaStyles: React.CSSProperties;
  labelStyles: React.CSSProperties;
  label: React.ReactNode;
  overlay: boolean;
  handleImageChange: (e: HTMLInputElement | DataTransfer) => void;
}

class DropUploader extends Component<DropUploaderProps> {  
  private imageInput: HTMLInputElement | null = null;

  private handleDragAreaClick = () => {
    if (this.imageInput) {
      this.imageInput.click();
    }
  }

  private handleImageChange = () => {
    if (
      'function' === typeof this.props.handleImageChange &&
      !this.props.disabled &&
      this.imageInput) {
      this.props.handleImageChange(this.imageInput);
    }
  }

  private handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('item__enter');
  }

  private handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => e.currentTarget.classList.remove('item__enter');

  private handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer;

    if ('function' === typeof this.props.handleImageChange && !this.props.disabled) {
      this.props.handleImageChange(files);
    }

    this.handleDragLeave(e);
  }

  public render() {
    return (
      <form 
        className={`form drop__uploader ${this.props.disabled === true ? 'disabled' : ''}`} 
        encType="multipart/form-data" 
        style={this.props.uploaderStyles}
      >
        {
          this.props.overlay ?
            
            <div className="drop__uploader_overlay"/> : null
        }
        <fieldset disabled={this.props.disabled}>
          <div 
            className="drop__area" 
            onClick={this.handleDragAreaClick}
            onDragOver={this.handleDragOver}
            onDragLeave={this.handleDragLeave}
            onDrop={this.handleDrop}
            style={this.props.dropAreaStyles}
          >
            <FontAwesomeIcon icon={faUpload} />
            <input 
              type="file" 
              name="avatar" 
              accept="image/*"
              ref={(input) => this.imageInput = input}
              onChange={this.handleImageChange} 
            />
            <label style={this.props.labelStyles}>
              {
                this.props.label || 
                <span><b>Choose an image</b> or drag it here</span>
              }
            </label>
          </div>
        </fieldset>
      </form>
    );
  }
}

export default DropUploader;