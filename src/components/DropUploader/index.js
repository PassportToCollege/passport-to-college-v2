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
    if ("function" === typeof props.handleAvatarChange)
      props.handleAvatarChange(this.avatartInput);
  }

  return (
    <form className="form drop__uploader" encType="multipart/form-data">
      <div className="drop__area" onClick={handleDragAreaClick}>
        <FontAwesomeIcon icon={faUpload} />
        <input type="file" name="avatar" accept="image/*"
          ref={input => this.avatartInput = input}
          onChange={handleAvatarChange} />
        <label><b>Choose a file</b> or drag it here</label>
      </div>
    </form>
  );
}

DropUploader.propTypes = {
  handleAvatarChange: propTypes.func
};

export default DropUploader;