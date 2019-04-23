import "./Users.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import propTypes from "prop-types";
import Cookies from "universal-cookie";

import { queryToObject } from "../../../utils";

import * as usersActions from "../../../actions/usersActions";
import * as statsActions from "../../../actions/statsActions";
import * as routes from "../../../constants/routes";

import PageMeta from "../../../components/PageMeta";
import LoadingText from "../../../components/LoadingText";
import Button from "../../../components/Button";
import Indicator from "../../../components/Indicator";
import { CreateUserModal } from "../../../components/Modal";
import Notification from "../../../components/Notification";
import { Table, TableData, TableHeader, TableRow } from "../../../components/Table";
import CardNavigation from "../../../components/CardNavigation";

const cookies = new Cookies();

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stats: props.stats.stats,
      users: props.users.users,
      creatingUser: false,
      createdUser: false,
      createUserModalData: {},
      notificationClosed: false
    }
  }

  componentDidMount() {
    const { search } = this.props.location;
    const { user_type } = this.props.match.params;
    const { page } = queryToObject(search) || { page: 1 };

    this.props.usersActions.doUsersGet(parseInt(page, 10), user_type || "all");
    this.setState({ page });

    this.props.statsActions.doStatsGet();
  }

  static getDerivedStateFromProps(nextProps) {
    let newState = null;

    if (nextProps.users.hasGottenUsers) {
      newState = {};
      newState.users = nextProps.users.users;

      const { search } = nextProps.location;
      const { page } = queryToObject(search) || { page: 1 };

      if (page > 1 && nextProps.users.users.empty)
        nextProps.history.goBack();
    }

    if (nextProps.stats.hasGotten) {
      newState = newState || {};
      newState = Object.assign({}, newState, {
        stats: nextProps.stats.stats
      });
    }

    if (!nextProps.users.hasCreated && nextProps.users.hasFailed) {
      newState = newState || {};
      newState = Object.assign({}, newState, {
        hasError: true, 
        error: nextProps.users.error.message
      });
    }

    return newState;
  }

  getSnapshotBeforeUpdate(props) {
    if (props.match.params.user_type !== this.props.match.params.user_type) {
      return {
        userTypeChanged: true
      };
    }

    if (props.users.isCreating && this.props.users.hasCreated) {
      return {
        createdUser: true
      };
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot && snapshot.userTypeChanged) {
        if (!this.props.users.isGettingUsers) {
        const { user_type } = this.props.match.params;
        this.props.usersActions.doUsersGet(1, user_type || "all");
      }
    }

    if (snapshot && snapshot.createdUser) {
      this.setState({ createdUser: true });
    }
  }

  render() {
    return (
      <div className="dashboard__container users__container">
        <PageMeta more={
          <title>Users | Dashboard | Passport to College</title>
        } />
        {
          this.state.creatingUser ?
            <CreateUserModal doClose={this.closeAddUserModal}
              handleInputChange={this.handleInputChange} 
              handleSubmit={this.handleNewUserCreated} /> :
            null
        }
        {
          this.state.createdUser ?
            <Notification doClose={this.handleNotificationClose}
              text="User created successfully. Close to refresh." /> :
            null
        }
        {
          !this.props.users.hasCreated && this.props.users.hasFailed && this.state.hasError ?
            <Notification doClose={this.handleNotificationClose}
              text={this.state.error} /> :
            null
        }
        <header>
          <h2>Users</h2>
          <CardNavigation locations={[
            { 
              pathname: routes.USERS.route,
              label: "All Users",
              icon: "users"
            },
            {
              pathname: routes.USERS_STUDENTS.route,
              label: routes.USERS_STUDENTS.name,
              icon: "students"
            },
            {
              pathname: routes.USERS_APPLICANTS.route,
              label: routes.USERS_APPLICANTS.name,
              icon: "applicants"
            },
            {
              pathname: routes.USERS_ADMINS.route,
              label: routes.USERS_ADMINS.name,
              icon: "admins"
            },
            {
              pathname: routes.USERS_STAFF.route,
              label: routes.USERS_STAFF.name,
              icon: "staff"
            }
          ]} />
          {
            this.props.stats.hasGotten && this.state.stats &&
              this.props.users.hasGottenUsers ?
              <span className="users__stats">
                Showing
              <b> {this.state.users.length || 0} </b>
                out of
              <b> {this.state.stats.users.total} </b>
                users
            </span> :
              <LoadingText options={{
                class: "block__lines",
                bg: "transparent",
                height: "10px",
                lines: [
                  { color: "rgba(255,101,97,0.2)", width: "100px" }
                ]
              }} />
          }
          <Button type="button" solid
            text="+ user"
            doClick={this.openAddUserModal}
            styles={{
              position: "absolute",
              right: "0",
              top: "1em",
              backgroundColor: "#FFCB61"
            }} />
        </header>
        <main className="users__main">
          <Table classes={["table__default"]}
            headers={
              <TableRow>
                <TableHeader heading="name" />
                <TableHeader heading="email" />
                <TableHeader heading="admin?" />
                <TableHeader heading="applicant?" />
                <TableHeader heading="student?" />
                <TableHeader heading="staff?" />
              </TableRow>
            }
            rows={this._renderTableData()} />
        </main>
      </div>
    )
  }

  openAddUserModal = () => this.setState({ creatingUser: true });
  closeAddUserModal = () => this.setState({ creatingUser: false });
  handleInputChange = e => {
    const { name, value } = e.target;
    if (name === "roles") {
      const { checked } = e.target;
      const newData = Object.assign({}, this.state.createUserModalData, {
          roles: Object.assign({}, this.state.createUserModalData.roles, {
            [value]: checked
        })
      });
      this.setState({ createUserModalData: newData });
    } else {
      const newData = Object.assign({}, this.state.createUserModalData, {
        [name]: value
      });
      this.setState({ createUserModalData: newData });
    }
  }
  handleNewUserCreated = e => {
    e.preventDefault();

    this.props.usersActions.doCreateUser(this.state.createUserModalData);
    this.setState({ createUserModalData: {} });
    this.closeAddUserModal();
  }
  
  handleNotificationClose = () => {
    this.setState({ notificationClosed: true, hasError: false, createdUser: false });

    // get users if user was created successfully
    if (this.props.users.hasCreated) {
      const { search } = this.props.location;
      const { page } = queryToObject(search) || { page: 1 };

      this.props.usersActions.doUsersGet(parseInt(page, 10));
    }
  }

  _renderTableData = () => {
    if (this.props.users.hasGottenUsers && !this.state.users.empty) {
      return this.state.users.map(user => {
        return (
          <TableRow key={user.uid}>
            <TableData>
              {
                user.isApplicant ?
                  <Link className="users__name"
                    to={`/admin/dashboard/applications/view/${user.uid}`}>
                    {user.name.full}
                  </Link> :
                  cookies.get("ssid").uid === user.uid ?
                    <Link className="users__name current_user"
                      to={"/admin/dashboard/profile"}>
                      {user.name.full} (you)
                    </Link> :
                    <Link className="users__name"
                      to={`/admin/dashboard/users/view/${user.uid}`}>
                      {user.name.full}
                    </Link>
              }
              <span>id: {user.uid}</span>
            </TableData>
            <TableData>
              {/* TODO: clicking should open send email modal */}
              <span className="users__email">
                {user.email}
              </span>
            </TableData>
            <TableData>
              <Indicator solid={user.isAdmin} color="#FFCB61" />
            </TableData>
            <TableData>
              <Indicator solid={user.isApplicant} color="#FFCB61" />
            </TableData>
            <TableData>
              <Indicator solid={user.isStudent} color="#FFCB61" />
            </TableData>
            <TableData>
              <Indicator solid={user.isStaff} color="#FFCB61" />
            </TableData>
          </TableRow>
        )
      });
    }

    if (this.props.users.hasGottenUsers && this.state.users.empty) {
      return (
        <TableRow>
          <TableData span="6" classes={["table__center_data"]}>
            No users found.
          </TableData>
        </TableRow>
      )
    }

    return (
      <TableRow>
        <TableData span="6" classes={["table__center_data"]}>
          Fetching users...
        </TableData>
      </TableRow>
    )
  }
}

Users.propTypes = {
  users: propTypes.oneOfType([propTypes.array, propTypes.object]),
  usersActions: propTypes.object,
  stats: propTypes.object,
  statsActions: propTypes.object,
  location: propTypes.object,
  history: propTypes.object,
  match: propTypes.object
};

const mapStateToProps = state => {
  return {
    users: state.users,
    stats: state.stats
  };
};

const mapDispatchToProps = dispatch => {
  return {
    usersActions: bindActionCreators(usersActions, dispatch),
    statsActions: bindActionCreators(statsActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Users);