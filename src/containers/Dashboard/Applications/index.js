import "./Applications.css";

import React, { Component } from "react";

class Applications extends Component {
  render() {
    return (
      <div className="dashboard__container application__container">
        application
      </div>
    )
  }

  componentWillMount() {
    this.props.updateLocation("dashboard applications");
  }
}

export default Applications;