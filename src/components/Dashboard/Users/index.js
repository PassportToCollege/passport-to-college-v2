import "./Users.css";

import React, { Component } from "react";

class Users extends Component {
  render() {
    return (
      <div className="dashboard__container users__container">
        users
      </div>
    )
  }

  componentWillMount() {
    this.props.updateLocation("dashboard users");
  }
}

export default Users;