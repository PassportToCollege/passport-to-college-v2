import "./ApplicationTask.css";

import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from 'prop-types';

import * as applicationActions from "../../../../actions/applicationActions";
import * as userActions from "../../../../actions/userActions";

import { PersonalInformation } from './../../../../components/Forms/index';

class ApplicationTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      task: this.props.match.params.task,
      user: {},
      application: {}
    };
  }

  componentWillMount() {
    this.props.setTask(this.state.task);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match && nextProps.match.params)
      this.setState({ task: nextProps.match.params.task });

    if (this.state.task !== nextProps.match.params.task)
      nextProps.setTask(nextProps.match.params.task);
    
    if (nextProps.user.hasGotten)
      this.setState({ user: nextProps.user.user });

    if (nextProps.application.hasGotten)
      this.setState({ application: nextProps.application })
  }

  render() {
    switch (this.state.task) {
      case "personal":
        return (
          <div className="application__portal_task personal__task">
            <h1>Personal Information</h1>
            {
              this.props.user.hasGotten ?
              <PersonalInformation 
                updateName={this.updateName}
                updateEmail={this.updateEmail}
                updateCountry={this.updateCountry}
                updatePhone={this.updatePhone}
                updateGender={this.updateGender}
                updateDOB={this.updateDOB}
                user={this.state.user} /> :
              null
            }
          </div>
        );
      case "profile-picture":
        return (
          <div className="application__portal_task profile_picture__task">
            <h1>Profile Picture</h1>
          </div>
        );
      case "education":
        return (
          <div className="application__portal_task education__task">
            <h1>Education Information</h1>
          </div>
        );
      case "us-standardized-tests":
        return (
          <div className="application__portal_task us_tests__task">
            <h1>US Standardized Tests</h1>
          </div>
        );
      case "national-tests":
        return (
          <div className="application__portal_task national_tests__task">
            <h1>National Tests</h1>
          </div>
        );
      case "miscellaneous":
        return (
          <div className="application__portal_task miscellaneous__task">
            <h1>Miscellaneous</h1>
          </div>
        );
      case "essay":
        return (
          <div className="application__portal_task essay__task">
            <h1>Essay</h1>
          </div>
        );
      case "review-and-sign":
        return (
          <div className="application__portal_task review__task">
            <h1>Review and Sign</h1>
          </div>
        );
      default:
        return (
          <div className="application__portal_task default_task">
            <h1>Submit Application</h1>
          </div>
        )
    }
  }

  updateName = (e) => {
    console.log(e.target);
  }
}

ApplicationTask.propTypes = {
  setTask: propTypes.func,
  match: propTypes.object,
  applicationActions: propTypes.object,
  application: propTypes.object,
  userActions: propTypes.object,
  user: propTypes.object
};

const mapStateToProps = state => {
  return {
    user: state.user,
    application: state.application
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
)(ApplicationTask);