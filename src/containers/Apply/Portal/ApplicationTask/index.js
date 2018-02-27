import "./ApplicationTask.css";

import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from 'prop-types';

import * as applicationActions from "../../../../actions/applicationActions";
import * as userActions from "../../../../actions/userActions";
import * as avatarActions from "../../../../actions/avatarActions";

import { getTestKey } from "../../../../utils";

import { PersonalInformation, EducationInformation, USTest, Miscellaneous } from './../../../../components/Forms/index';
import { ReauthenticateModal } from "../../../../components/Modal";
import DropUploader from "../../../../components/DropUploader";
import Button from "../../../../components/Button";
import { AddNationalTest } from "../../../../components/Modal";
import TestList from "../../../../components/TestList";
import WYSIWYGEditor from "../../../../components/Editor";
import ReviewBlock from "../../../../components/ReviewBlock";
import LoadingText from "../../../../components/LoadingText";

class ApplicationTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      task: this.props.match.params.task,
      user: this.props.user.user,
      application: this.props.application.application,
      avatar: this.props.avatar,
      uid: "",
      email: "",
      isAddingTest: false,
      addTestModal: {},
      hasChanged: false // flag to tell if user changed any fields so new application is fetched on component update
    };
  }

  componentWillMount() {
    this.props.setTask(this.state.task);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.task !== nextState.task && this.state.hasChanged) {
      if (nextState.task !== "personal" || nextState.task !== "profile-picture")
        this.props.applicationActions.doApplicationGet(this.props.application.user);
        
      if (nextState.task !== "profile-picture")
        this.props.userActions.doUserGet();
      
      this.setState({ hasChanged: false });
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

    if (nextProps.avatar.hasGotten)
      this.setState({ avatar: nextProps.avatar });
  }

  render() {
    switch (this.state.task) {
      case "personal":
        return (
          <div className="application__portal_task personal__task">
            <h1 className="application_task__heading">Personal Information</h1>
            <p className="application_task__instructions">
              Please provide personal information below.
            </p>
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
            <h1 className="application_task__heading">Profile Picture</h1>
            <p className="application_task__instructions">
              Upload a profile picture below.
            </p>
            {
              this.props.avatar.isGetting ?
                <span className="no__avatar">Fetching...</span>
              :
                null
            }
            {
              this.props.avatar.hasGotten && this.props.avatar.url ?
                <div className="avatar__container" style={{ backgroundImage: `url(${this.props.avatar.url})` }}></div>
                :
               null
            }
            {
              this.props.avatar.hasGotten && !this.props.avatar.url.length ?
                <span className="no__avatar">Fetching...</span>
              :
                null
            }
            <DropUploader handleAvatarChange={this.handleAvatarChange} />
          </div>
        );
      case "education":
        return (
          <div className="application__portal_task education__task">
            <h1 className="application_task__heading">Education Information</h1>
            <p className="application_task__instructions">
              Please provide information about your education below.
            </p>
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
            <h1 className="application_task__heading">US Standardized Tests</h1>
            <p className="application_task__instructions">
              Please provide information on whether you have taken the U.S. Scholastic Aptitude Test (SAT) 
              or American College Test (ACT). These tests are required for admission to most 
              U.S. college/university programs and, even though they are not required for the acceptance of 
              your application to Passport to College, we would like to have this information. 
              If you have not taken either test, select <i>None</i> and a score of <i>0</i>. 
              Again, not having taken either of these test will not affect your Passport to College application.
            </p>
            <p className="application_task__instructions">
              If you have done both tests provide your highest score.
            </p>
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
            <h1 className="application_task__heading">National Tests</h1>
            <p className="application_task__instructions">
              Please list all the country specific standardized tests you will or have taken. 
              These are the tests your country require students to sit in their final years of 
              high school. e.g. <i>CSEC, CAPE, etc.</i>
            </p>
            <p className="application_task__instructions">
              If you have not taken an exam but are registered to take said exam, provide the year
              you will take the exam and 0 as the grade.
            </p>
            <Button type="button" text="Add Test" solid doClick={this.handleAddTestClick} />
            {
              this.state.isAddingTest ?
              <AddNationalTest doClose={this.handleTestModalClose}
                handleInputChange={this.handleTestModalInputChange}
                handleTestAdded={this.handleTestAdded} />
                :
              null
            }
            {
              this.renderTestList()
            }
          </div>
        );
      case "miscellaneous":
        return (
          <div className="application__portal_task miscellaneous__task">
            <h1 className="application_task__heading">Miscellaneous</h1>
            <p className="application_task__instructions">
              Please provide information about your family&apos;s income,
              the area you are interested in studying and how you would
              describe your work ethic.
            </p>
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
            <h1 className="application_task__heading">Essay</h1>
            <p className="application_task__instructions">
              Please write an essay about yourself; your longterm life goals, things you have accomplished,
              and struggles you&apos;ve had to overcome gain your education.
            </p>
            <p className="application_task__instructions">
              You essay should be at least <b>300 words</b> and free of spelling and grammatical errors. Feel free
              to have a teacher review your essay before submitting your application.
            </p>
            {
              this.props.application.hasGotten ?
                <WYSIWYGEditor saveButton handleSave={this.handleEssaySave} 
                  content={this.state.application.essay} />
              :
                <span>Getting editor...</span>
            }
          </div>
        );
      case "review":
        if (this.props.user.hasGotten && this.props.application.hasGotten) {
          let { user, application } = this.state;

          const dataPersonal = [
            { name: "name", value: user.name.full },
            { name: "email", value: user.email },
            { name: "phone", value: user.phone },
            { name: "gender", value: user.gender },
            { name: "dob", value: user.dob },
            { name: "country", value: user.address.country }
          ];

          const dataEducation = [
            { name: "highest education level", value: application.educationLevel },
            { name: "last school", value: application.lastSchool },
            { name: "gpa", value: `${application.gpa}/4.00` }
          ];

          const dataUSTests = [
            { name: "test", value: application.usTest },
            { name: "score", value: application.score }
          ];

          const dataMisc = [
            { name: "family income", value: application.income },
            { name: "interest", value: application.interest },
            { name: "work ethic", value: application.workEthic }
          ];

          return (
            <div className="application__portal_task review__task">
              <h1 className="application_task__heading">Review</h1>
              <p className="application_task__instructions">
                Please review you application below before submitting it for consideration.
                Once you submit your application you will not be able to make changes to it, so 
                ensure all the information you provide is accurate and correct.
              </p>
              <ReviewBlock heading="Personal" editLink={this.props.match.path.replace(":task", "personal")}
                items={dataPersonal} />
              
              <ReviewBlock heading="Profile Picture" editLink={this.props.match.path.replace(":task", "profile-picture")}
                renderImage imageUrl={this.props.avatar.url} />

              <ReviewBlock heading="Education" editLink={this.props.match.path.replace(":task", "education")}
                items={dataEducation} />
              
              <ReviewBlock heading="U.S. Standardized Tests" editLink={this.props.match.path.replace(":task", "us-standardized-tests")}
                items={dataUSTests} />
              
              <ReviewBlock heading="National Tests" editLink={this.props.match.path.replace(":task", "national-tests")} renderFromFunc
                renderFunc={this.renderTestList} />
              
              <ReviewBlock heading="Miscellaneous" editLink={this.props.match.path.replace(":task", "miscellaneous")} items={dataMisc} />

              <ReviewBlock heading="Essay" editLink={this.props.match.path.replace(":task", "essay")} renderFromFunc
                renderFunc={this.renderReadOnlyEssay} />
            </div>
          );
        }

        return (
          <div className="application__portal_task review__task">
            <h1 className="application_task__heading">Review</h1>
            <p className="application_task__instructions">
              Please review you application below before submitting it for consideration.
              Once you submit your application you will not be able to make changes to it, so
              ensure all the informatino you provide is accurate and correct.
            </p>
            
            <LoadingText options={{
              class: "review_block__loading",
              bg: "transparent",
              height: "10px",
              lines: [
                { color: "rgba(51,51,51,0.4)", width: "50%" },
                { color: "rgba(51,51,51,0.2)", width: "80%" },
                { color: "rgba(51,51,51,0.4)", width: "50%" },
                { color: "rgba(51,51,51,0.2)", width: "80%" },
                { color: "rgba(51,51,51,0.4)", width: "50%" },
                { color: "rgba(51,51,51,0.2)", width: "80%" },
                { color: "rgba(51,51,51,0.4)", width: "50%" },
                { color: "rgba(51,51,51,0.2)", width: "80%" },
                { color: "rgba(51,51,51,0.4)", width: "50%" },
                { color: "rgba(51,51,51,0.2)", width: "80%" },
                { color: "rgba(51,51,51,0.4)", width: "50%" },
                { color: "rgba(51,51,51,0.2)", width: "80%" }
              ]
            }} />

            <LoadingText options={{
              class: "review_block__loading",
              bg: "transparent",
              height: "10px",
              lines: [
                { color: "rgba(51,51,51,0.4)", width: "50%" },
                { color: "rgba(51,51,51,0.2)", width: "80%" },
                { color: "rgba(51,51,51,0.4)", width: "50%" },
                { color: "rgba(51,51,51,0.2)", width: "80%" },
                { color: "rgba(51,51,51,0.4)", width: "50%" },
                { color: "rgba(51,51,51,0.2)", width: "80%" }
              ]
            }} />
          </div>
        );
      default:
        return (
          <div className="application__portal_task default_task">
            <h1 className="application_task__heading">Submit Application</h1>
          </div>
        )
    }
  }

  renderReadOnlyEssay = () => {
    return (
      <WYSIWYGEditor readonly content={this.state.application.essay} />
    )
  }

  renderTestList = () => {
    if (this.props.application.isGetting)
      return <p>Looking for your tests</p>

    if (this.props.application.hasGotten &&
      Object.keys(this.state.application.tests).length > 0) {
      return (
        <TestList tests={this.state.application.tests}
          handleDelete={this.handleTestDelete} />
      )
    }

    return <p>No tests added.</p>
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
    const key = getTestKey(modalData);

    const tests = Object.assign({}, this.state.application.tests, {
      [key] : modalData
    });

    this.props.applicationActions.doApplicationUpdate(this.state.uid, { tests });
    this.setState({ hasChanged: true });
  }

  handleTestDelete = test => {
    this.props.applicationActions.doTestDelete(this.state.uid, test);
    this.setState({ hasChanged: true });
  }

  handleReauthenticate = password => {
    this.props.userActions.doUserEmailUpdateWithReauthentication(this.state.email, password);
  }

  handleAvatarChange = e => {
    let newGravatar = e.files[0];

    this.props.avatarActions.doAvatarUpload(newGravatar);
  }

  handleEssaySave = html => {
    this.props.applicationActions.doApplicationUpdate(this.state.uid, { essay: html });
    this.setState({ hasChanged: true });
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

    this.setState({ hasChanged: true });
  }

  updateApplicationField = e => {
    let data = {};
    data[e.target.name] = e.target.value;

    this.props.applicationActions.doApplicationUpdateWithoutGet(this.props.application.user, data);
    this.setState({ hasChanged: true });
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