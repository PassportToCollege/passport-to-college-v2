import "./DropUploader.css";

import React from "react";
import propTypes from "prop-types";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/fontawesome-free-solid";

const DropUploader = props => {
  const handleDragAreaClick = () => {
    this.avatartInput.click();
  }

  const handleAvatarChange = () => {
    if ("function" === typeof props.handleAvatarChange && !props.disabled)
      props.handleAvatarChange(this.avatartInput);
  }

  const handleDragOver = e => {
    e.preventDefault();

    e.target.classList.add("item__enter");
  }

  const handleDragLeave = e => e.target.classList.remove("item__enter");

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer;

    if ("function" === typeof props.handleAvatarChange && !props.disabled)
      props.handleAvatarChange(files);

    handleDragLeave(e);
  }

  return (
    <form className={`form drop__uploader ${props.disabled === true ? "disabled" : ""}`} encType="multipart/form-data" style={props.uploaderStyles}>
      <fieldset disabled={props.disabled === true ? "disabled" : null}>
        <div className="drop__area" 
          onClick={handleDragAreaClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={props.dropAreaStyles}>
          <FontAwesomeIcon icon={faUpload} />
          <input type="file" name="avatar" accept="image/*"
            ref={input => this.avatartInput = input}
            onChange={handleAvatarChange} />
          <label>
            {
              props.label || 
              <span><b>Choose an image</b> or drag it here</span>
            }
          </label>
        </div>
      </fieldset>
    </form>
  );
}

DropUploader.propTypes = {
  handleAvatarChange: propTypes.func,
  disabled: propTypes.bool,
  uploaderStyles: propTypes.object,
  dropAreaStyles: propTypes.object,
  label: propTypes.object
};

export default DropUploader;