import "./ApplicationSection.css";

import React, { Component } from "react";
import propTypes from "prop-types";

class ApplicationSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      section: props.section
    };
  }

  render() {
    return (
      <div className="application__section">
        {this.props.section}
      </div>
    )
  }
}

ApplicationSection.propTypes = {
  section: propTypes.string
};

export default ApplicationSection;