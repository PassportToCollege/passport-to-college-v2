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
      <div className="dashboard__container application__container">
        application
      </div>
    )
  }

  componentWillMount() {
    const { search } = this.props.location;

    if (search.length) {
      const { page } = queryToObject(search);
      this.props.applicationsActions.doApplicationsGet(parseInt(page, 10));
    } else {
      this.props.applicationsActions.doApplicationsGet(1);
    }
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