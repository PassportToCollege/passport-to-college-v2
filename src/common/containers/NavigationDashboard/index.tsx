import "./NavigationDashboard.css"

import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import propTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Cookies from "universal-cookie";
import { withRouter } from "react-router-dom";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { 
  faTachometerAlt, 
  faUsers, 
  faUser, 
  faHome, 
  faSignOutAlt, 
  faRss, 
  faBookOpen,
  faChalkboard,
  faSlidersH,
  faCaretLeft,
  faCaretRight, 
  faBars
} from "@fortawesome/fontawesome-free-solid";
import { faWpforms } from "@fortawesome/fontawesome-free-brands";

import LoadingText from "../../components/LoadingText";
import Loader from "../../components/Loader";

import { isBrowser } from "../../utils";
import * as userProfilePictureActions from "../../actions/userProfilePictureActions";
import * as authActions from "../../actions/authActions";
import * as userActions from "../../actions/userActions";
import * as menuActions from "../../actions/menuActions";
import * as routes from "../../constants/routes";

import defAvatar from "../../assets/images/default-gravatar.png";

const cookies = new Cookies();
const icons = {
  [routes.DASHBOARD.route]: faTachometerAlt,
  [routes.APPLICATIONS.route] : faWpforms,
  [routes.USERS.route]: faUsers,
  [routes.DASH_POSTS.route]: faRss,
  [routes.STUDENT_DASHBOARD.route]: faUser,
  [routes.STUDENT_DASHBOARD_BIO.route]: faBookOpen,
  [routes.STUDENT_DASHBOARD_EDUCATION.route]: faChalkboard,
  [routes.STUDENT_DASHBOARD_SETTINGS.route]: faSlidersH
}

class NavigationDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: ""
    }
  }

  componentDidMount() {
    this.props.userActions.doUserGet();
    
    if (isBrowser && this.props.menu.dash !== "closed") {
      this.selectNavigationState();
      window.addEventListener("resize", this.selectNavigationState);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.selectNavigationState);
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
    if (snapshot) {
      if (snapshot.gotUser) {
        if (this.props.user.user.hasProfilePicture && !this.props.profilePicture.isGetting) {
          this.props.userProfilePictureActions.doAvatarGet();
        }
      }
    }
  }

  render() {
    return (
      <nav className="dashboard__navigation" data-state={this.props.menu.dash}>
        <div className="dashboard__navigation__top">
          <div className="dashboard__navigation_avatar_container">
            {
              this.props.profilePicture.hasGotten && this.state.profilePicture ?
                !this.props.student && this.props.menu.dash === "compact" ?
                <Link to={routes.PROFILE.route}>
                  <img src={this.state.profilePicture} alt="User Avatar" />
                </Link> :
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
              <h5 className="type__color_white type__center">{this.state.username}</h5>
          }
          {
            !this.props.student && this.props.menu.dash === "full" ?
              <Link to={routes.PROFILE.route}>view profile</Link> :
              null
          }
        </div>
        <div className="dashboard__navigation_container">
          <ul>
            {this.selectMainNavElements()}
          </ul>
          <hr />
          <ul>
            {
              !this.props.student ?
                <li>
                  <NavLink exact to={routes.PROFILE.route}>
                    <FontAwesomeIcon icon={faUser} />
                    <span>profile</span>
                  </NavLink>
                </li> : null
            }
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
        <span className="dashboard__navigation_state_toggler"
          onClick={this.forceNavState}>
            {
              this.props.menu.dash === "full" ?
                <FontAwesomeIcon icon={faCaretLeft} /> :
                this.props.menu.dash === "compact" ?
                  <FontAwesomeIcon icon={faCaretRight} /> :
                  <FontAwesomeIcon icon={faBars} />

            }
        </span>
      </nav>
    )
  }

  handleSignOutClick = (e) => {
    e.preventDefault();

    const user = cookies.get("ssid");
    this.props.authActions.doSignOut(user);
    this.props.history.push("/")
  }

  selectMainNavElements = () => {
    let adminRoutes = [
      routes.DASHBOARD,
      routes.APPLICATIONS,
      routes.USERS,
      routes.DASH_POSTS
    ];

    let studentRoutes = [
      routes.STUDENT_DASHBOARD,
      routes.STUDENT_DASHBOARD_BIO,
      routes.STUDENT_DASHBOARD_EDUCATION,
      routes.STUDENT_DASHBOARD_SETTINGS
    ];

    if (this.props.student)
      return this.renderMainNavElements(studentRoutes);

    return this.renderMainNavElements(adminRoutes);
  }

  renderMainNavElements = (routes = []) => {
    return routes.map(route => {
      return (
          <li key={route.route}>
            <NavLink exact={(route.name === "Dashboard" || route.dashLabel === "profile")}
              to={route.route} activeClassName="active">
              <FontAwesomeIcon icon={icons[route.route]} />
              <span>{route.dashLabel || route.name}</span>
            </NavLink>
          </li>
        );
      });
  }

  selectNavigationState = () => {
    const { innerWidth } = window;

    if (innerWidth > 768 && this.props.menu.dash !== "full"
    && this.state.forcedState !== "compact")
      return this.props.menuActions.makeDashMenuFull();

    if ((innerWidth > 384 && innerWidth <= 768) && this.props.menu.dash !== "compact")
      return this.props.menuActions.makeDashMenuCompact();

    if (innerWidth <= 384 && this.props.menu.dash.indexOf("closed") === -1)
      return this.props.menuActions.closeDashMenu();

    return null;
  }

  forceNavState = () => {
    const { dash } = this.props.menu;
    let toState = "full";

    if (dash.indexOf("closed") > -1) {
      toState = dash.split(" ")[0];
    }

    if (dash === "full")
      toState = "compact";

    if (dash === "compact")
      toState = "full";

    this.setState({ forcedState: toState });
    
    if (toState === "full")
      return this.props.menuActions.makeDashMenuFull();

    this.props.menuActions.makeDashMenuCompact();
  }
}

NavigationDashboard.defaultProps = {
  student: false
};

NavigationDashboard.propTypes = {
  userProfilePictureActions: propTypes.object,
  authActions: propTypes.object,
  profilePicture: propTypes.object,
  userActions: propTypes.object,
  user: propTypes.object,
  history: propTypes.object,
  student: propTypes.bool,
  menu: propTypes.object,
  menuActions: propTypes.object
};

const mapStateToProps = state => {
  return {
    profilePicture: state.userProfilePicture,
    user: state.user,
    menu: state.menu
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userProfilePictureActions: bindActionCreators(userProfilePictureActions, dispatch),
    authActions: bindActionCreators(authActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
    menuActions: bindActionCreators(menuActions, dispatch)
  };
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationDashboard));