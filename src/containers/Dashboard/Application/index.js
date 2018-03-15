import "./Application.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as applicationActions from "../../../actions/applicationActions";

class Application extends Component {
  constructor(props) {
    super(props);

    this.state = {
      application: this.props.application.application
    };
  }

  componentWillMount() {
    const { application_id } = this.props.match.params;

    this.props.applicationActions.doApplicationGet(application_id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.application.hasGotten)
      this.setState({ application: nextProps.application.application });
  }

  render() {
    return (
      <div className="dashboard__container">
        application
      </div>
    )
  }
}

Application.propTypes = {
  application: propTypes.object,
  applicationActions: propTypes.object,
  match: propTypes.object
};

const mapStateToProps = state => {
  return {
    application: state.application
  };
};

const mapDispatchToProps = dispatch => {
  return {
    applicationActions: bindActionCreators(applicationActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Application);