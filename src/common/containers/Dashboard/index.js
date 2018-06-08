import "./Dashboard.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Route } from "react-router-dom";
import propTypes from "prop-types";

import * as routes from "../../constants/routes";
import * as userActions from "../../actions/userActions";
import { isProfileComplete } from "../../utils";

import { CompleteProfileModal } from "../../components/Modal";
import PageMeta from "../../components/PageMeta";
import NavigationAdmin from "../NavigationAdmin";
import SearchBar from "../SearchBar";
import Applications from "./Applications";
import Users from "./Users";
import Profile from "./Profile";
import Application from "./Application";
import User from "./User";
import DashPosts from "./DashPosts";

class Dashboard extends Component {
  state = {
    user: this.props.user.user
  }

  static propTypes = {
    updateLocation: propTypes.func,
    match: propTypes.object,
    user: propTypes.object,
    userActions: propTypes.object,
  };

  componentDidMount() {
    this.props.updateLocation("dashboard home");

    if (!this.state.user)
      this.props.userActions.doUserGet();
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.user.hasGotten) {
      return {
        user: nextProps.user.user
      }
    }

    return null;
  }

  render() {
    return (
      <div className="dashboard">
        <PageMeta route="DASHBOARD" />
        <NavigationAdmin user={this.props.user} />
        {
          this.props.user.hasGotten && this.state.user && !isProfileComplete(this.state.user) ?
            <CompleteProfileModal user={this.state.user} 
              doSubmit={this.handleProfileComplete} /> : null
        }
        <main className="dashboard__main">
          <SearchBar />
          <Route exact path={this.props.match.url} 
            render={this.renderDashboard}></Route>
          <Route exact path={routes.APPLICATIONS.route} component={Applications}></Route>
          <Route exact path={routes.USERS.route} component={Users}></Route>
          <Route path={routes.PROFILE.route}
            render={props => {
              return <Profile {...props} user={this.props.user} />
            }}></Route>
          <Route path={routes.VIEW_APPLICATION.route} component={Application}></Route>
          <Route path={routes.VIEW_USER.route} component={User}></Route>
          <Route path={routes.DASH_POSTS.route} component={DashPosts}></Route>
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

  handleProfileComplete = state => {
    let data = {};

    Object.keys(state).map(key => {
      if (key === "country" && state[key]) {
        return data.address = {
          [key]: state[key]
        }
      }

      if (key === "dob" && state[key]) {
        return data.dob = new Date(state[key]).getTime();
      }

      if (state[key])
        return data[key] = state[key];

      return null;
    });

    this.props.userActions.doUserUpdate(data);

    return new Promise(resolve => {
      resolve({ message: "done!" });
    });
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userActions: bindActionCreators(userActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);