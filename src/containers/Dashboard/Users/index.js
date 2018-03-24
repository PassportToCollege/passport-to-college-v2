import "./Users.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import { queryToObject } from "../../../utils";

import * as usersActions from "../../../actions/usersActions";
import * as statsActions from "../../../actions/statsActions";

import LoadingText from "../../../components/LoadingText";
import Button from "../../../components/Button";

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stats: props.stats.stats,
      users: props.users.users
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
              transform: "translateY(-50%)"
            }} />
        </header>
      </div>
    )
  }
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