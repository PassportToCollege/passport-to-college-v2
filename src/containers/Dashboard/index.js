import "./Dashboard.css";

import React, { Component } from "react";
import { Route } from "react-router-dom";
import propTypes from "prop-types";

import * as routes from "../../constants/routes";

import NavigationAdmin from "../NavigationAdmin";
import SearchBar from "../SearchBar";
import Applications from "..//Dashboard/Applications";
import Users from "../Dashboard/Users";
import Profile from "../Dashboard/Profile";

export default class Dashboard extends Component {

  componentWillMount() {
    this.props.updateLocation("dashboard home");
  }

  render() {
    return (
      <div className="dashboard">
        <NavigationAdmin />
        <div className="dashboard__main">
          <SearchBar />
          <Route exact path={this.props.match.url} 
            render={this.renderDashboard}></Route>
          <Route path={routes.APPLICATIONS.route} component={Applications}></Route>
          <Route path={routes.USERS.route} component={Users}></Route>
          <Route path={routes.PROFILE.route} component={Profile}></Route>
        </div>
      </div>
    )
  }

  renderDashboard() {
    return (
      <div className="dashboard__home">
        home
      </div>
    )
  }
}

Dashboard.propTypes = {
  updateLocation: propTypes.func,
  match: propTypes.object
};