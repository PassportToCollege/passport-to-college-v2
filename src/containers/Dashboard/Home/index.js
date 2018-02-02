import "./Home.css";

import React, { Component } from "react";
import propTypes from "prop-types";

class Dashboard extends Component {
  render() {
    return (
      <div className="dashboard__home_container">
        <div className="dashboard__container">
          home
        </div>
      </div>
    )
  }

  componentWillMount() {
    this.props.updateLocation("dashboard home");
  }
}

Dashboard.propTypes = {
  updateLocation: propTypes.func
};

export default Dashboard;