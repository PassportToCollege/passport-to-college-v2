import "./ApplicationPortal.css";

import React, { Component } from "react";
import propTypes from "prop-types";

class ApplicationPortal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      applicationId: this.props.match.params.application_id
    };
  }
  render() {
    return (
      <div className="application_portal">
        {this.state.applicationId}
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