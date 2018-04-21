import "./Applications.css";

import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import { queryToObject } from "../../../utils";

import * as applicationsActions from "../../../actions/applicationsActions";
import * as statsActions from "../../../actions/statsActions";

import LoadingText from "../../../components/LoadingText";

class Applications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      applications: props.applications.applications,
      stats: props.stats.stats
    };
  }

  componentDidMount() {
    const { search } = this.props.location;
    const { page } = queryToObject(search) || { page: 1 };

    this.props.applicationsActions.doApplicationsGet(parseInt(page, 10));
    this.setState({ page });

    this.props.statsActions.doStatsGet();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.applications.hasGotten) {
      this.setState({ applications: nextProps.applications.applications });

      const { search } = this.props.location;
      const { page } = queryToObject(search) || { page: 1 };

      if (page > 1 && nextProps.applications.applications.empty)
        this.props.history.goBack();
    }

    if (nextProps.stats.hasGotten)
      this.setState({ stats: nextProps.stats.stats });
  }

  render() {
    return (
      <div className="dashboard__container applications__container">
        <header>
          <h1>Applications</h1>
          {
            this.props.stats.hasGotten && this.state.stats &&
            this.props.applications.hasGotten ?
            <span className="applications__stats">
              Showing 
              <b> {this.state.stats.applications.total - this.state.stats.applications.draft} </b> 
              out of 
              <b> {this.state.applications.empty ? "0" : this.state.applications.length} </b>
              applications
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
                this.props.applications.hasGotten && !this.state.applications.empty ?
                  this.state.applications.map(application => {
                    return (
                      <tr key={application.uid}>
                        <td>
                          <span className="applications__state_indicator"
                            data-state={application.state.accepted ? "accepted" : application.state.rejected ? "rejected" : "pending"}></span>
                        </td>
                        <td>
                          <Link className="applications__name" 
                            to={`/admin/dashboard/applications/view/${application.uid}`}>
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
                  }) : this.props.applications.hasGotten && this.state.applications.empty ?
                    <tr>
                      <td colSpan="4" style={{textAlign: "center"}}>No applications found.</td>
                    </tr> :
                    <tr>
                      <td colSpan="4" style={{textAlign: "center"}}>Fetching applications...</td>
                    </tr>
              } 
            </tbody>
          </table>
        </div>
      </div>
    )
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

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Applications)
);