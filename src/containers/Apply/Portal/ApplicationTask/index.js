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
import Button from "../../../../components/Button";
import { AddNationalTest } from "../../../../components/Modal";
import TestList from "../../../../components/TestList";

class ApplicationTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      task: this.props.match.params.task,
      user: {},
      application: {},
      uid: "",
      email: "",
      isAddingTest: false,
      addTestModal: {}
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
      if (nextState.task !== "personal" || nextState.task !== "profile-picture")
        this.props.applicationActions.doApplicationGet(this.props.application.user);
        
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
            {
              this.props.application.hasGotten ?
              <EducationInformation application={this.props.application} 
                updateApplicationField={this.updateApplicationField} />
                :
              null
            }
          </div>
        );
      case "us-standardized-tests":
        return (
          <div className="application__portal_task us_tests__task">
            <h1>US Standardized Tests</h1>
            {
              this.props.application.hasGotten ?
                <USTest application={this.props.application} 
                  updateApplicationField={this.updateApplicationField} />
                :
              null
            }
          </div>
        );
      case "national-tests":
        return (
          <div className="application__portal_task national_tests__task">
            <h1>National Tests</h1>
            <Button type="button" text="Add New Test" doClick={this.handleAddTestClick} />
            {
              this.state.isAddingTest ?
              <AddNationalTest doClose={this.handleTestModalClose}
                handleInputChange={this.handleTestModalInputChange}
                handleTestAdded={this.handleTestAdded} />
                :
              null
            }
            {
              this.props.application.hasGotten && Object.keys(this.state.application.tests).length ?
              <TestList tests={this.state.application.tests}
                handleDelete={this.handleTestDelete} />
                :
              <p>No tests added.</p>
            }
          </div>
        );
      case "miscellaneous":
        return (
          <div className="application__portal_task miscellaneous__task">
            <h1>Miscellaneous</h1>
            {
              this.props.application.hasGotten ?
              <Miscellaneous application={this.props.application}
                updateApplicationField={this.updateApplicationField} />
                :
              null
            }
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

  handleAddTestClick = () => this.setState({ isAddingTest: true });
  handleTestModalClose = () => this.setState({ isAddingTest: false, addTestModal: {} });
  handleTestModalInputChange = e => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    const newData = Object.assign({}, this.state.addTestModal, {
      [name]: value
    });

    this.setState({ addTestModal: newData });
  }

  handleTestAdded = () => {
    const modalData =  this.state.addTestModal;
    const key = modalData.subject.toLowerCase().split(" ").join("-");

    const newTest = Object.assign({}, this.state.application.tests, {
      [key] : modalData
    });

    this.props.applicationActions.doApplicationUpdate(this.state.uid, { tests: newTest });
  }

  handleTestDelete = test => {
    this.props.applicationActions.doTestDelete(this.state.uid, test);
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
      case "name": {
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
      }
      case "email": {
        let email = e.target.value;

        // set email in state incase reauathentication is required
        this.setState({ email });

        if (email !== this.state.user.email) {
          this.props.userActions.doUserEmailUpdate(email);
        }

        break;
      }
      case "country":
        this.props.userActions.doUserUpdateWithoutGet({ address: { country: e.target.value } });

        break;
      default: {
        let defaultData = {};
        defaultData[fieldName] = e.target.value;

        this.props.userActions.doUserUpdateWithoutGet(defaultData);
      }
    }
  }

  updateApplicationField = e => {
    let data = {};
    data[e.target.name] = e.target.value;

    this.props.applicationActions.doApplicationUpdateWithoutGet(this.props.application.user, data);
  }
}

ApplicationTask.propTypes = {
  setTask: propTypes.func,
  match: propTypes.object,
  applicationActions: propTypes.object,
  avatarActions: propTypes.object,
  avatar: propTypes.object,
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