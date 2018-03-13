import "./Applications.css";

import React, { Component } from "react";
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
              <b> {this.state.stats.total} </b> 
              out of 
              <b> {this.state.applications.length} </b>
              applications
            </span> :
            null

          }
        </header>
        application
      </div>
    )
  }

  componentWillMount() {
    const { search } = this.props.location;
    const page = queryToObject(search) || 1;

    this.props.applicationsActions.doApplicationsGet(parseInt(page, 10));
    this.setState({ page });

    this.props.statsActions.doApplicationStatsGet();
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
  applications: propTypes.oneOfType([propTypes.object, propTypes.array]),
  location: propTypes.object,
  statsActions: propTypes.object,
  stats: propTypes.object
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