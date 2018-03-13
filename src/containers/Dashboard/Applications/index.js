import "./Applications.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import { queryToObject } from "../../../utils";
import * as usersActions from "../../../actions/usersActions";
import * as statsActions from "../../../actions/statsActions";

class Applications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: this.props.users.users
    };
  }

  render() {
    return (
      <div className="dashboard__container applications__container">
        <header>
          <h1>Applications</h1>
          {
            this.props.stats.hasGotten ?
            <span className="applications__stats">
              Showing 
              <b> {this.state.stats.total} </b> 
              out of 
              <b> {this.state.users.length} </b>
              applications
            </span> :
            null
          }
        </header>
        <div className="applications__main">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>name</th>
                <th>email</th>
                <th>phone</th>
              </tr>
            </thead>
            <tbody>

            </tbody>
          </table>
        </div>
      </div>
    )
  }

  componentWillMount() {
    const { search } = this.props.location;
    const page = queryToObject(search) || 1;

    this.props.usersActions.doUsersGet(parseInt(page, 10), "applicants");
    this.setState({ page });

    this.props.statsActions.doApplicationStatsGet();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.users.hasGotten)
      this.setState({ users: nextProps.users.users });

    if (nextProps.stats.hasGotten)
      this.setState({ stats: nextProps.stats.stats });
  }
}

Applications.propTypes = {
  usersActions: propTypes.object,
  users: propTypes.object,
  location: propTypes.object,
  statsActions: propTypes.object,
  stats: propTypes.object
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
)(Applications);