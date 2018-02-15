import "./ApplicationTask.css";

import React, { Component } from 'react';
import propTypes from 'prop-types';

class ApplicationTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      task: this.props.match.params.task
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
  }

  render() {
    switch (this.state.task) {
      case "personal":
        return (
          <div className="application__portal_task personal__task">
            <h1>Personal Information</h1>
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
}

ApplicationTask.propTypes = {
  setTask: propTypes.func
};

export default ApplicationTask;