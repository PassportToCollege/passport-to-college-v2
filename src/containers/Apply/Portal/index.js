import "./ApplicationPortal.css";

import React, { Component } from "react";
import propTypes from "prop-types";

class ApplicationPortal extends Component {
  render() {
    return (
      <div className="application_portal">
        {this.props.match.application}
      </div>
    )
  }

  componentWillMount() {
    this.props.updateLocation("apply");
  }
}

ApplicationPortal.propTypes = {
  updateLocation: propTypes.func,
  match: propTypes.object
};

export default ApplicationPortal;