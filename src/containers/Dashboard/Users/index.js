import "./Users.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import propTypes from "prop-types";

import { queryToObject } from "../../../utils";

import * as usersActions from "../../../actions/usersActions";
import * as statsActions from "../../../actions/statsActions";

import LoadingText from "../../../components/LoadingText";
import Button from "../../../components/Button";
import Indicator from "../../../components/Indicator";
import { CreateUserModal } from "../../../components/Modal";

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stats: props.stats.stats,
      users: props.users.users,
      creatingUser: false
    }
  }

  componentWillMount() {
    const { search } = this.props.location;
    const { page } = queryToObject(search) || { page: 1 };

    this.props.usersActions.doUsersGet(parseInt(page, 10));
    this.setState({ page });

    this.props.statsActions.doStatsGet();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.users.hasGotten) {
      this.setState({ users: nextProps.users.users });

      const { search } = this.props.location;
      const { page } = queryToObject(search) || { page: 1 };

      if (page > 1 && nextProps.users.users.empty)
        this.props.history.goBack();
    }

    if (nextProps.stats.hasGotten)
      this.setState({ stats: nextProps.stats.stats });
  }

  render() {
    return (
      <div className="dashboard__container users__container">
        {
          this.state.creatingUser ?
            <CreateUserModal doClose={this.closeAddUserModal}/> :
            null
        }
        <header>
          <h1>Users</h1>
          {
            this.props.stats.hasGotten && this.state.stats &&
              this.props.users.hasGotten ?
              <span className="users__stats">
                Showing
              <b> {this.state.users.length} </b>
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
              right: "2em",
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "#FFCB61"
            }} />
        </header>
        <main className="users__main">
          <table className="table table__default" cellSpacing="0">
            <thead>
              <tr>
                <th>name</th>
                <th>email</th>
                <th>admin?</th>
                <th>applicant?</th>
                <th>student?</th>
                <th>staff?</th>
              </tr>
            </thead>
            <tbody>
              {
                this.props.users.hasGotten && !this.state.users.empty ?
                  this.state.users.map(user => {
                    return (
                      <tr key={user.uid}>
                        <td>
                          <Link className="users__name"
                            to={`/admin/dashboard/users/view/${user.uid}`}>
                            {user.name.full}
                          </Link>
                          <span>id: {user.uid}</span>
                        </td>
                        <td>
                          {/* TODO: clicking should open send email modal */}
                          <span className="users__email">
                            {user.email}
                          </span>
                        </td>
                        <td>
                          <Indicator solid={user.isAdmin} color="#FFCB61" />
                        </td>
                        <td>
                          <Indicator solid={user.isApplicant} color="#FFCB61" />
                        </td>
                        <td>
                          <Indicator solid={user.isStudent} color="#FFCB61" />
                        </td>
                        <td>
                          <Indicator solid={user.isStaff} color="#FFCB61" />
                        </td>
                      </tr>
                    )
                  }) :
                  this.props.users.hasGotten && this.state.users.empty ?
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>No users found.</td>
                    </tr> :
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>Fetching users...</td>
                    </tr>
              }
            </tbody>
          </table>
        </main>
      </div>
    )
  }

  openAddUserModal = () => this.setState({ creatingUser: true });
  closeAddUserModal = () => this.setState({ creatingUser: false });
  
}

Users.propTypes = {
  users: propTypes.oneOfType([propTypes.array, propTypes.object]),
  usersActions: propTypes.object,
  stats: propTypes.object,
  statsActions: propTypes.object,
  location: propTypes.object,
  history: propTypes.object
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