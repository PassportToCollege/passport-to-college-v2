import "./Applications.css";

import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import { queryToObject } from "../../../utils";

import * as applicationsActions from "../../../actions/applicationsActions";
import * as statsActions from "../../../actions/statsActions";

import PageMeta from "../../../components/PageMeta";
import LoadingText from "../../../components/LoadingText";
import { Table, TableData, TableHeader, TableRow } from "../../../components/Table";

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

  static getDerivedStateFromProps(nextProps) {
    let newState = null;

    if (nextProps.applications.hasGotten) {
      newState = { applications: nextProps.applications.applications };

      const { search } = nextProps.location;
      const { page } = queryToObject(search) || { page: 1 };

      if (page > 1 && nextProps.applications.applications.empty)
        nextProps.history.goBack();
    }

    if (nextProps.stats.hasGotten) {
      newState = newState || {};
      newState = Object.assign({}, newState, {
        stats: nextProps.stats.stats
      });
    }
    
    return newState;
  }

  render() {
    return (
      <div className="dashboard__container applications__container">
        <PageMeta more={
          <title>Applications | Dashboard | Passport to College</title>
        } />
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
          <Table classes={["table__default"]}
            headers={
              <TableRow>
                <TableHeader />
                <TableHeader heading="name" />
                <TableHeader heading="email" />
                <TableHeader heading="phone" />
                <TableHeader heading="state" />
              </TableRow>
            }
            rows={this._renderTableData()} />
        </div>
      </div>
    )
  }

  _renderTableData = () => {
    if (this.props.applications.hasGotten &&
      !this.state.applications.empty) {
      return this.state.applications.map(application => {
        const keys = Object.keys(application.state);
        const values = Object.values(application.state);
        const state = keys[values.indexOf(true)];

        return (
          <TableRow key={application.uid}>
            <TableData>
              <span className="applications__state_indicator"
                data-state={application.state.accepted ? "accepted" : application.state.rejected ? "rejected" : "pending"}></span>
            </TableData>
            <TableData>
              {
                state === "draft" ? application.user.name.full :
                  <Link className="applications__name" 
                    to={`/admin/dashboard/applications/view/${application.uid}`}>
                    {application.user.name.full}
                  </Link>
              }
            </TableData>
            <TableData>
              {/* TODO: clicking should open send email modal */}
              <span className="applications__email"> 
                {application.user.email}
              </span>
            </TableData>
            <TableData>
              {application.user.email}
            </TableData>
            <TableData>
              {state}
            </TableData>
          </TableRow>
        )
      });
    }

    if (this.props.applications.hasGotten && this.state.applications.empty) {
      return (
        <TableRow>
          <TableData span="4" classes={["table__center_data"]}>
            No applications found.
          </TableData>
        </TableRow>
      )
    }

    return (
      <TableRow>
        <TableData span="4" classes={["table__center_data"]}>
          Fetching applications...
        </TableData>
      </TableRow>
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