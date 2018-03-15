import "./Applications.css";

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import { queryToObject } from "../../../utils";
import * as applicationsActions from "../../../actions/applicationsActions";
import * as statsActions from "../../../actions/statsActions";

class Applications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      applications: this.props.applications.applications
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
              <b> {this.state.stats.applications.total} </b> 
              out of 
              <b> {this.state.applications.length} </b>
              applications
            </span> :
            null
          }
        </header>
        <div className="applications__main">
          <table className="table table__default" cellSpacing="0">
            <thead>
              <tr>
                <th></th>
                <th>name</th>
                <th>email</th>
                <th>phone</th>
              </tr>
            </thead>
            <tbody>
              {
                this.props.applications.hasGotten ?
                  this.state.applications.map(application => {
                    return (
                      <tr key={application.uid}>
                        <td>
                          <span className="applications__state_indicator"
                            data-state={application.state}></span>
                        </td>
                        <td>
                          <Link className="applications__name" 
                            to={`/admin/dashboard/applications/v/${application.uid}`}>
                            {application.user.name.full}
                          </Link>
                          <span>{application.user.address.country}</span>
                        </td>
                        <td>
                          {/* TODO: clicking should open send email modal */}
                          <span className="applications__email"> 
                            {application.user.email}
                          </span>
                        </td>
                        <td>{application.user.phone}</td>
                      </tr>
                    )
                  }) :
                  null
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  componentWillMount() {
    const { search } = this.props.location;
    const page = queryToObject(search) || 1;

    this.props.applicationsActions.doApplicationsGet(parseInt(page, 10));
    this.setState({ page });

    this.props.statsActions.doStatsGet();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.applications.hasGotten)
      this.setState({ applications: nextProps.applications.applications });

    if (nextProps.stats.hasGotten)
      this.setState({ stats: nextProps.stats.stats });
  }
}

Applications.propTypes = {
  applicationsActions: propTypes.object,
  applications: propTypes.object,
  location: propTypes.object,
  statsActions: propTypes.object,
  stats: propTypes.object,
  history: propTypes.object
};

const mapStateToProps = state => {
  return {
    applications: state.applications,
    stats: state.stats
  };
};

const mapDispatchToProps = dispatch => {
  return {
    applicationsActions: bindActionCreators(applicationsActions, dispatch),
    statsActions: bindActionCreators(statsActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Applications);