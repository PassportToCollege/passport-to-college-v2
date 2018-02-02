import "./NavigationAdmin.css"

import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import propTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Cookies from "universal-cookie";
import { withRouter } from "react-router-dom";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faTachometerAlt, faUsers, faHome, faSignOutAlt } from "@fortawesome/fontawesome-free-solid";
import { faWpforms } from "@fortawesome/fontawesome-free-brands";

import * as avatarActions from "../../actions/avatarActions";
import * as authActions from "../../actions/authActions";
import * as routes from "../../constants/routes";

const defAvatar = require("../../assets/images/default-gravatar.png");

const cookies = new Cookies();

class NavigationAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: cookies.get("ssid").name.full,
      gravatar: ""
    }
  }

  componentWillMount() {
    // get user avatar
    this.props.avatarActions.doAvatarGet();
  }

  render() {
    return (
      <nav className="dashboard__navigation">
        <div className="dashboard__navigation__top">
          <div className="dashboard__navigation_avatar_container">
            <img src={this.state.gravatar} alt="User Avatar" />
          </div>
          <h3>{this.state.username}</h3>
          <Link to={routes.PROFILE.route}>view profile</Link>
        </div>
        <div className="dashboard__navigation_container">
          <ul>
            {this.renderMainNavElements()}
          </ul>
          <hr/>
          <ul>
            <li>
              <NavLink exact to={routes.LANDING.route}>
                <FontAwesomeIcon icon={faHome}/>
                <span>Back To Website</span>
              </NavLink>
            </li>
            <li>
              <NavLink to={routes.SIGN_OUT.route} onClick={this.handleSignOutClick}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>sign out</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    )
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.avatar.url && nextProps.avatar.url !== "")
      this.setState({ gravatar: nextProps.avatar.url });

    if (nextProps.avatar.url === "")
      this.setState({ gravatar: defAvatar });
  }

  handleSignOutClick = (e) => {
    e.preventDefault();

    const user = cookies.get("ssid");
    this.props.authActions.doSignOut(user);
  }

  renderMainNavElements = () => {
    let mainRoutes = [
      routes.DASHBOARD,
      routes.APPLICATIONS,
      routes.USERS
    ]

    const els = mainRoutes.map((v, i) => {
      let icon;

      switch(v.route){
        case "/admin/dashboard":
          icon = faTachometerAlt;
          break;
        case "/admin/dashboard/applications":
          icon = faWpforms;
          break;
        case "/admin/dashboard/users":
          icon = faUsers;
          break;
        default:
          icon = "";
      }

      return (
        <li key={v.route}>
          <NavLink exact to={v.route} activeClassName="active">
            <FontAwesomeIcon icon={icon} />
            <span>{v.name}</span>
          </NavLink>
        </li>
      )
    });

    return els;
  }
}

NavigationAdmin.propTypes = {
  avatarActions: propTypes.object,
  authActions: propTypes.object,
  avatar: propTypes.object
};

const mapStateToProps = state => {
  return {
    avatar: state.avatar
  };
};

const mapDispatchToProps = dispatch => {
  return {
    avatarActions: bindActionCreators(avatarActions, dispatch),
    authActions: bindActionCreators(authActions, dispatch)
  };
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationAdmin));