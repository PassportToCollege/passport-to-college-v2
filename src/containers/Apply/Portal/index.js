import "./ApplicationPortal.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as applicationActions from "../../../actions/applicationActions";
import * as userActions from "../../../actions/userActions";

class ApplicationPortal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      applicationId: this.props.match.params.application_id
    };
  }
  render() {
    return (
      <div className="application_portal">
        {this.state.applicationId}
      </div>
    )
  }

  componentWillMount() {
    this.props.updateLocation("application portal");
    
    // get user
    this.props.userActions.doUserGet();

    // get application
    this.props.applicationActions.doApplicationGet(this.state.applicationId); 
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.application.hasGotten)
      this.setState({ application: nextProps.application.application });
    
    if (nextProps.user.hasGotten)
      this.setState({ user: nextProps.user.user });
  }
}

ApplicationPortal.propTypes = {
  updateLocation: propTypes.func,
  match: propTypes.object,
  applicationActions: propTypes.object,
  application: propTypes.object,
  userActions: propTypes.object,
  user: propTypes.object
};

const mapStateToProps = state => {
  return {
    application: state.application,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    applicationActions: bindActionCreators(applicationActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationPortal);