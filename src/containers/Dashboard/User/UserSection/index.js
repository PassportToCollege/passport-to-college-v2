import "./UserSection.css";

import React, { Component } from "react";
import propTypes from "prop-types";

class UserSection extends Component {
  render() {
    return (
      <p>{this.props.section}</p>
    )
  }
}

UserSection.propTypes = {
  section: propTypes.string
};

export default UserSection;