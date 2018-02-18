import "./ApplicationTask.css";

import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from 'prop-types';

import * as applicationActions from "../../../../actions/applicationActions";
import * as userActions from "../../../../actions/userActions";
import * as avatarActions from "../../../../actions/avatarActions";

import { auth } from "../../../../utils/firebase";

import { PersonalInformation, EducationInformation, USTest, Miscellaneous } from './../../../../components/Forms/index';
import { ReauthenticateModal } from "../../../../components/Modal";
import DropUploader from "../../../../components/DropUploader";

class ApplicationTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      task: this.props.match.params.task,
      user: {},
      application: {},
      uid: "",
      email: ""
    };
  }

  componentWillMount() {
    this.props.setTask(this.state.task);

    auth.onAuthStateChanged(user => {
      if (user)
        this.props.avatarActions.doAvatarGet(user.uid);
    });
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.task !== nextState.task) {
      if (nextState.task !== "profile-picture")
        this.props.userActions.doUserGet();
    }
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
              (this.props.user.hasFailed && this.props.user.error.code === "auth/requires-recent-login") ?
              <ReauthenticateModal doAuthenticate={this.handleReauthenticate}/>
                :
              null
            }
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
            {
              this.props.avatar.url ?
              <div className="avatar__container" style={{ backgroundImage: `url(${this.props.avatar.url})` }}>
              </div>
                :
              <span className="no__avatar">No profile</span>
            }
            <DropUploader handleAvatarChange={this.handleAvatarChange} />
          </div>
        );
      case "education":
        return (
          <div className="application__portal_task education__task">
            <h1>Education Information</h1>
            <EducationInformation />
          </div>
        );
      case "us-standardized-tests":
        return (
          <div className="application__portal_task us_tests__task">
            <h1>US Standardized Tests</h1>
            <USTest />
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
            <Miscellaneous />
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

  handleReauthenticate = password => {
    this.props.userActions.doUserEmailUpdateWithReauthentication(this.state.email, password);
  }

  handleAvatarChange = e => {
    let newGravatar = e.files[0];

    this.props.avatarActions.doAvatarUpload(newGravatar);
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
      case "email":
        let email = e.target.value;

        // set email in state incase reauathentication is required
        this.setState({ email });

        if (email !== this.state.user.email) {
          this.props.userActions.doUserEmailUpdate(email);
        }

        break;
      case "country":
        this.props.userActions.doUserUpdateWithoutGet({ address: { country: e.target.value } });

        break;
      default:
        let defaultData = {};
        defaultData[fieldName] = e.target.value;

        this.props.userActions.doUserUpdateWithoutGet(defaultData);
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
    avatar: state.avatar,
    user: state.user,
    application: state.application
  };
};

const mapDispatchToProps = dispatch => {
  return {
    applicationActions: bindActionCreators(applicationActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
    avatarActions: bindActionCreators(avatarActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationTask);