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
      application: {},
      uid: ""
    };
  }

  componentWillMount() {
    this.props.setTask(this.state.task);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.task !== nextState.task)
      this.props.userActions.doUserGet();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match && nextProps.match.params)
      this.setState({ task: nextProps.match.params.task });

    if (this.state.task !== nextProps.match.params.task)
      nextProps.setTask(nextProps.match.params.task);

    if (nextProps.user.hasGotten)
      this.setState({ user: nextProps.user.user });
    
    if (nextProps.application.hasGotten) {
      this.setState({ 
        application: nextProps.application.application, 
        uid: nextProps.application.user 
      });
    }
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
                updateField={this.updateField}
                user={this.props.user.user} /> :
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

  updateField = (e) => {
    let fieldName = e.target.name;

    switch (fieldName) {
      case "name":
        let name = e.target.value;

        // do nothign if name hasn't changed
        if (name === this.state.user.name.full)
          break;

        let data = {};
        name = name.split(" ");

        if (name.length > 2) {
          data.name = {
            first: name[0],
            middle: name.slice(1, name.length - 1).join(" "),
            last: name[name.length - 1],
            full: [name[0], name[name.length - 1]].join(" ")
          }
        } else {
         data.name = {
            first: name[0],
            last: name[1],
            full: [name[0], name[1]].join(" ")
          }
        }

        this.props.userActions.doUserUpdateWithoutGet(data);
        break;
      default:
        console.log(fieldName);
    }
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