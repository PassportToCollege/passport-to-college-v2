import "./Applications.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import { queryToObject } from "../../../utils";
import * as applicationsActions from "../../../actions/applicationsActions";

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
          <h2>Applications</h2>
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
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.applications.hasGotten)
      this.setState({ applications: nextProps.applications })
  }
}

Applications.propTypes = {
  applicationsActions: propTypes.object,
  applications: propTypes.oneOfType([propTypes.object, propTypes.array]),
  location: propTypes.object
};

const mapStateToProps = state => {
  return {
    applications: state.applications
  };
};

const mapDispatchToProps = dispatch => {
  return {
    applicationsActions: bindActionCreators(applicationsActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Applications);