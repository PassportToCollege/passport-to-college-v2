import "./Dashboard.css";

import React, { Component } from "react";
import { Route } from "react-router-dom";
import propTypes from "prop-types";

import * as routes from "../../constants/routes";

import PageMeta from "../../components/PageMeta";
import NavigationAdmin from "../NavigationAdmin";
import SearchBar from "../SearchBar";
import Applications from "./Applications";
import Users from "./Users";
import Profile from "./Profile";
import Application from "./Application";
import User from "./User";
import DashPosts from "./DashPosts";
import DashComments from "./DashPosts/DashComments";

export default class Dashboard extends Component {
  componentDidMount() {
    this.props.updateLocation("dashboard home");
  }

  render() {
    return (
      <div className="dashboard">
        <PageMeta route="DASHBOARD" />
        <NavigationAdmin />
        <main className="dashboard__main">
          <SearchBar />
          <Route exact path={this.props.match.url} 
            render={this.renderDashboard}></Route>
          <Route exact path={routes.APPLICATIONS.route} component={Applications}></Route>
          <Route exact path={routes.USERS.route} component={Users}></Route>
          <Route exact path={routes.USERS_BY_TYPE.route} component={Users}></Route>
          <Route path={routes.PROFILE.route} component={Profile}></Route>
          <Route path={routes.VIEW_APPLICATION.route} component={Application}></Route>
          <Route path={routes.VIEW_USER.route} component={User}></Route>
          <Route path={routes.DASH_POSTS.route} component={DashPosts}></Route>
          <Route path={routes.DASH_POSTS_COMMENTS.route} component={DashComments}></Route>
        </main>
      </div>
    )
  }

  renderDashboard() {
    return (
      <div className="dashboard__container dashboard__home">
        <div className="dashboard__welcome">
          home
        </div>
      </div>
    )
  }
}

Dashboard.propTypes = {
  updateLocation: propTypes.func,
  match: propTypes.object
};