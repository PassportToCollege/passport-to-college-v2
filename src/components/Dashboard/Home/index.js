import "./Home.css";

import React, { Component } from "react";

class Dashboard extends Component {
  render() {
    return (
      <div className="dashboard__home_container">
        Home
      </div>
    )
  }

  componentWillMount() {
    this.props.updateLocation("dashboard home");
  }
}

export default Dashboard;