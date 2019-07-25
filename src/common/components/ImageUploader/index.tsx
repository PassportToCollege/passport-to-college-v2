import './ImageUploader.css';

import React, { Component } from 'react';
import propTypes from 'prop-types';

import { verifyImageDimensions } from '../../utils';

interface ImageUploaderProps {
  styles: React.CSSProperties;
  default: string;
  onUpload: (image: any) => void;
  onCancel: () => void;
}

interface ImageUploaderState {
  default: string;
  uploading: boolean;
  newImage?: any;
}

class ImageUploader extends Component<ImageUploaderProps, ImageUploaderState> {
  constructor(props: ImageUploaderProps) {
    super(props);

    this.state = {
      default: props.default,
      uploading: false
    };
  }

  private imageInput: HTMLInputElement | null = null;

  public static getDerivedStateFromProps(props: ImageUploaderProps, state: ImageUploaderState) {
    if (props.default && state.default !== props.default) {
      return {
        default: props.default
      };
    }

    return null;
  }

  public render() {
    return (
      <div 
        className="image_uploader" 
        style={this.props.styles} 
        data-uploading={this.state.uploading}
      >
        <div className="image_uploader__controls_overlay">
          {
            this.state.uploading ?
              <React.Fragment> 
                <span onClick={this.handleUploadCancel}>cancel</span>
                <span onClick={this.handleUpload}>upload</span>
              </React.Fragment> :
              <span onClick={this.openImageSelector}>click here to change</span>
          }
        </div>
        {
          this.state.default ?
            <img src={this.state.default} alt="" /> : null
        }
        <input 
          type="file" 
          name="image" 
          accept="image/*"
          ref={(input) => this.imageInput = input}
          onChange={this.handleImageChange} 
        />
      </div>
    );
  }

  private openImageSelector = () => {
    if (this.imageInput) {
      this.imageInput.click();
    }
  }

  private handleImageChange = () => {
    verifyImageDimensions(this.imageInput, 100)
      .then(({ image, url }) => {
        this.setState({
          default: url,
          newImage: image,
          uploading: true
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  public handleUploadCancel = () => {
    this.setState({
      uploading: false,
      default: this.props.default,
      newImage: null
    });
  }

  public handleUpload = () => {
    this.setState({
      uploading: false
    });

    if ('function' === typeof this.props.onUpload) {
      if (this.state.newImage) {
        this.props.onUpload(this.state.newImage);
      }
    }
  }
}

export default ImageUploader;