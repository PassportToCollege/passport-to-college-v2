import "./ImageUploader.css";

import React, { Component } from "react";
import propTypes from "prop-types";

import { verifyImageDimensions } from "../../utils";

class ImageUploader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      default: props.default,
      uploading: false
    }
  }

  static propTypes = {
    styles: propTypes.object,
    default: propTypes.string,
    onUpload: propTypes.func,
    onCancel: propTypes.func
  }

  static getDerivedStateFromProps(props, state) {
    if (props.default && state.default !== props.default) {
      return {
        default: props.default
      };
    }

    return null;
  }

  render() {
    return (
      <div className="image_uploader" style={this.props.styles} data-uploading={this.state.uploading}>
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
        <input type="file" name="image" accept="image/*"
            ref={input => this.imageInput = input}
            onChange={this.handleImageChange} />
      </div>
    )
  }

  openImageSelector = () => {
    this.imageInput.click();
  }

  handleImageChange = () => {
    verifyImageDimensions(this.imageInput, 100)
      .then(({ image, url }) => {
        this.setState({
          default: url,
          newImage: image,
          uploading: true
        });
      })
      .catch(error => {
        console.log(error)
      })
  }

  handleUploadCancel = () => {
    this.setState({
      uploading: false,
      default: this.props.default,
      newImage: null
    });
  }

  handleUpload = () => {
    this.setState({
      uploading: false
    });

    if ("function" === typeof this.props.onUpload)
      this.props.onUpload(this.state.newImage);
  }
}

export default ImageUploader;