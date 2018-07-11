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
import * as userActions from "../../actions/userActions";
import * as routes from "../../constants/routes";

import defAvatar from "../../assets/images/default-gravatar.png";

const cookies = new Cookies();

class NavigationAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: ""
    }
  }

  componentDidMount() {
    this.props.userActions.doUserGet();
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.profilePicture.hasGotten) {
      return {
        profilePicture: nextProps.profilePicture.url
      }
    }

    if (nextProps.profilePicture.hasFailed) {
      return {
        profilePicture: defAvatar
      }
    }

    if (nextProps.user.hasGotten) {
      return {
        username: nextProps.user.user.name.full
      }
    }
    
    return null;
  }

  getSnapshotBeforeUpdate(props) {
    if (props.user.isGetting && this.props.user.hasGotten) {
      return {
        gotUser: true
      };
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot && snapshot.gotUser) {
      if (this.props.user.user.hasProfilePicture && !this.props.profilePicture.isGetting) {
        this.props.userProfilePictureActions.doAvatarGet();
      }
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

  handleSignOutClick = (e) => {
    e.preventDefault();

    const user = cookies.get("ssid");
    this.props.authActions.doSignOut(user);
    this.props.history.push("/")
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
  authActions: propTypes.object,
  profilePicture: propTypes.object,
  userActions: propTypes.object,
  user: propTypes.object,
  history: propTypes.object
};

const mapStateToProps = state => {
  return {
    profilePicture: state.userProfilePicture,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userProfilePictureActions: bindActionCreators(userProfilePictureActions, dispatch),
    authActions: bindActionCreators(authActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch)
  };
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationAdmin));