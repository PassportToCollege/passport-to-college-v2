import "./DropUploader.css";

import React, { Component } from "react";
import propTypes from "prop-types";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/fontawesome-free-solid";

class DropUploader extends Component {  
  static propTypes = {
    handleAvatarChange: propTypes.func,
    disabled: propTypes.bool,
    uploaderStyles: propTypes.object,
    dropAreaStyles: propTypes.object,
    label: propTypes.object,
    overlay: propTypes.bool,
    labelStyles: propTypes.object
  }

  static defaultProps = {
    overlay: false
  }

  render() {
    return (
      <form className={`form drop__uploader ${this.props.disabled === true ? "disabled" : ""}`} encType="multipart/form-data" style={this.props.uploaderStyles}>
        {
          this.props.overlay ?
            <div className="drop__uploader_overlay"></div> : null
        }
        <fieldset disabled={this.props.disabled === true ? "disabled" : null}>
          <div className="drop__area" 
            onClick={this.handleDragAreaClick}
            onDragOver={this.handleDragOver}
            onDragLeave={this.handleDragLeave}
            onDrop={this.handleDrop}
            style={this.props.dropAreaStyles}>
            <FontAwesomeIcon icon={faUpload} />
            <input type="file" name="avatar" accept="image/*"
              ref={input => this.avatartInput = input}
              onChange={this.handleAvatarChange} />
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

  handleDragAreaClick = () => {
    this.avatartInput.click();
  }

  handleAvatarChange = () => {
    if ("function" === typeof this.props.handleAvatarChange && !this.props.disabled)
      this.props.handleAvatarChange(this.avatartInput);
  }

  handleDragOver = e => {
    e.preventDefault();

    e.target.classList.add("item__enter");
  }

  handleDragLeave = e => e.target.classList.remove("item__enter");

  handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer;

    if ("function" === typeof this.props.handleAvatarChange && !this.props.disabled)
      this.props.handleAvatarChange(files);

    this.handleDragLeave(e);
  }
}

export default DropUploader;