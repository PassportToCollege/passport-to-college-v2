import "./NavigationAdmin.css"

import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import propTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Cookies from "universal-cookie";
import { withRouter } from "react-router-dom";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faTachometerAlt, faUsers, faUser, faHome, faSignOutAlt, faRss } from "@fortawesome/fontawesome-free-solid";
import { faWpforms } from "@fortawesome/fontawesome-free-brands";
import LoadingText from "../../components/LoadingText";
import Loader from "../../components/Loader";

import * as userProfilePictureActions from "../../actions/userProfilePictureActions";
import * as authActions from "../../actions/authActions";
import * as routes from "../../constants/routes";

const defAvatar = require("../../assets/images/default-gravatar.png");

const cookies = new Cookies();

class NavigationAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      profilePicture: props.profilePicture.url
    }
  }

  componentDidMount() {
    // get user avatar
    this.props.userProfilePictureActions.doAvatarGet();
  }

  static getDerivedStateFromProps(nextProps) {
    let newState = null;

    if (nextProps.profilePicture.url && nextProps.profilePicture.url !== "") {
      newState = {};
      newState.profilePicture = nextProps.profilePicture.url;
    }

    if (nextProps.profilePicture.url === "") {
      newState = newState || {};
      newState.profilePicture = defAvatar;
    }

    if (nextProps.user.hasGotten) {
      newState = newState || {};
      newState.username = nextProps.user.user.name.full;
    }

    return newState;
  }

  getSnapshotBeforeUpdate(prevProps) {
    let snapshot = null;

    if (prevProps.auth.isAuthorizing && this.props.auth.hasSignedOut) {
      snapshot = {
        wasUnauthorized: true
      };
    }

    return snapshot;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot && snapshot.wasUnauthorized) {
      this.props.history.push("/auth/sign-in");
    }
  }

  render() {
    return (
      <nav className="dashboard__navigation">
        <div className="dashboard__navigation__top">
          <div className="dashboard__navigation_avatar_container">
            {
              this.props.profilePicture.hasGotten && this.state.profilePicture ?
                <img src={this.state.profilePicture} alt="User Avatar" />
              :
              <Loader />
            }
          </div>
          {
            this.state.username === "" ?
              <LoadingText options={{
                class: "dashboard__navigation_username_loader",
                bg: "transparent",
                height: "8px",
                lines: [
                  { width: "50%", color: "#fff" }
                ]
              }} />
            :
              <h3>{this.state.username}</h3>
          }
          <Link to={routes.PROFILE.route}>view profile</Link>
        </div>
        <div className="dashboard__navigation_container">
          <ul>
            {this.renderMainNavElements()}
          </ul>
          <hr />
          <ul>
            <li>
              <NavLink exact to={routes.PROFILE.route}>
                <FontAwesomeIcon icon={faUser} />
                <span>profile</span>
              </NavLink>
            </li>
            <li>
              <a href={routes.LANDING.route}>
                <FontAwesomeIcon icon={faHome}/>
                <span>Back To Website</span>
              </a>
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

  handleSignOutClick = (e) => {
    e.preventDefault();

    const user = cookies.get("ssid");
    this.props.authActions.doSignOut(user);
  }

  renderMainNavElements = () => {
    let mainRoutes = [
      routes.DASHBOARD,
      routes.APPLICATIONS,
      routes.USERS,
      routes.DASH_POSTS
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
        case "/admin/dashboard/posts":
          icon = faRss;
          break;
        default:
          icon = "";
      }

      return (
        <li key={i}>
          <NavLink exact={v.name === "Dashboard" ? true : false}
            to={v.route} activeClassName="active">
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
  userProfilePictureActions: propTypes.object,
  auth: propTypes.object,
  authActions: propTypes.object,
  profilePicture: propTypes.object,
  user: propTypes.object,
  history: propTypes.object
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
    profilePicture: state.userProfilePicture
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userProfilePictureActions: bindActionCreators(userProfilePictureActions, dispatch),
    authActions: bindActionCreators(authActions, dispatch)
  };
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationAdmin));