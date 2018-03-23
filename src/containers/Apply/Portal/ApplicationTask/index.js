import "./ApplicationTask.css";

import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from 'prop-types';

import * as applicationActions from "../../../../actions/applicationActions";
import * as userActions from "../../../../actions/userActions";
import * as userProfilePictureActions from "../../../../actions/userProfilePictureActions";

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
import Notification from "../../../../components/Notification";

class ApplicationTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      task: this.props.match.params.task,
      user: this.props.user.user,
      application: this.props.application.application,
      profilePicture: this.props.profilePicture,
      uid: "",
      email: "",
      isAddingTest: false,
      addTestModal: {},
      hasChanged: false, // flag to tell if user changed any fields so new application is fetched on component update
      complete: this.props.complete,
      notificationClosed: false
    };
  }

  componentWillMount() {
    this.props.setTask(this.state.task);
  }

  componentWillUpdate(nextProps, nextState) {
    if ((this.state.task !== nextState.task) && this.state.hasChanged) {
      if (nextState.task !== "personal" && nextState.task !== "profile-picture") {
        this.props.applicationActions.doApplicationGet(this.props.application.user);
      }

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

    if (nextProps.profilePicture.hasGotten)
      this.setState({ profilePicture: nextProps.profilePicture });
    
    this.setState({ complete: nextProps.complete });
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
                user={this.props.user.user} 
                disabled={this.state.application.wasSubmitted} /> :
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
              this.props.profilePicture.isGetting ?
                <span className="no__avatar">Fetching...</span>
              :
                null
            }
            {
              this.props.profilePicture.hasGotten && this.props.profilePicture.url ?
                <div className="avatar__container" style={{ backgroundImage: `url(${this.props.profilePicture.url})` }}></div>
                :
               null
            }
            {
              this.props.profilePicture.hasFailed && this.props.profilePicture.error.code === "storage/object-not-found" ?
                <span className="no__avatar">No profile image</span>
              :
                null
            }
            {
              this.props.application.hasGotten ?
                <DropUploader handleAvatarChange={this.handleAvatarChange} disabled={this.state.application.wasSubmitted}/>
              :
                null
            }
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
                updateApplicationField={this.updateApplicationField}
                disabled={this.state.application.wasSubmitted} />
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
                  updateApplicationField={this.updateApplicationField} 
                  disabled={this.state.application.wasSubmitted} />
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
            {
              this.props.application.hasGotten ?
                <Button type="button" text="Add Test" solid doClick={this.handleAddTestClick} disabled={this.state.application.wasSubmitted} />
              :
                null
            }
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
                updateApplicationField={this.updateApplicationField} 
                disabled={this.state.application.wasSubmitted}/>
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
                  content={this.state.application.essay} 
                  readonly={this.state.application.wasSubmitted} />
              :
                <span>Getting editor...</span>
            }
          </div>
        );
      case "review":
        if (this.props.user.hasGotten && this.props.application.hasGotten) {
          let { user, application } = this.state;
          let dataPersonal, dataEducation, dataUSTests, dataMisc;

          if (this.applicationComplete(this.state)) {
            dataPersonal = [
              { name: "name", value: user.name.full },
              { name: "email", value: user.email },
              { name: "phone", value: user.phone },
              { name: "gender", value: user.gender },
              { name: "dob", value: user.dob },
              { name: "country", value: user.address.country }
            ];
  
            dataEducation = [
              { name: "highest education level", value: application.educationLevel },
              { name: "last school", value: application.lastSchool },
              { name: "gpa", value: `${application.gpa}/4.00` }
            ];
  
            dataUSTests = [
              { name: "test", value: application.usTest },
              { name: "score", value: application.score }
            ];
  
            dataMisc = [
              { name: "family income", value: application.income },
              { name: "interest", value: application.interest },
              { name: "work ethic", value: application.workEthic }
            ];
          }
         
          return (
            <div className="application__portal_task review__task">
              <h1 className="application_task__heading">Review</h1>
              {
                !this.applicationComplete(this.state) ?
                  <p className="application_task__instructions type__margin_top">
                    Your application is not complete. Ensure that you have
                    provided all required information before reviewing your application.
                  </p>
                  :
                  <div className="review_blocks">
                    <p className="application_task__instructions">
                      Please review you application below before submitting it for consideration.
                      Once you submit your application you will not be able to make changes to it, so
                      ensure all the information you provide is accurate and correct.
                    </p>
                    <ReviewBlock heading="Personal" editLink={this.props.match.path.replace(":task", "personal")}
                      items={dataPersonal}
                      canEdit={!this.state.application.wasSubmitted} />

                    <ReviewBlock heading="Profile Picture" editLink={this.props.match.path.replace(":task", "profile-picture")}
                      renderImage imageUrl={this.props.profilePicture.url}
                      canEdit={!this.state.application.wasSubmitted} />

                    <ReviewBlock heading="Education" editLink={this.props.match.path.replace(":task", "education")}
                      items={dataEducation}
                      canEdit={!this.state.application.wasSubmitted} />

                    <ReviewBlock heading="U.S. Standardized Tests" editLink={this.props.match.path.replace(":task", "us-standardized-tests")}
                      items={dataUSTests}
                      canEdit={!this.state.application.wasSubmitted} />

                    <ReviewBlock heading="National Tests" editLink={this.props.match.path.replace(":task", "national-tests")} renderFromFunc
                      renderFunc={this.renderTestList}
                      canEdit={!this.state.application.wasSubmitted} />

                    <ReviewBlock heading="Miscellaneous" editLink={this.props.match.path.replace(":task", "miscellaneous")}
                      items={dataMisc}
                      canEdit={!this.state.application.wasSubmitted} />

                    <ReviewBlock heading="Essay" editLink={this.props.match.path.replace(":task", "essay")} renderFromFunc
                      renderFunc={this.renderReadOnlyEssay}
                      canEdit={!this.state.application.wasSubmitted} />
                  </div>
              }
            </div>
          );
        }

        return (
          <div className="application__portal_task review__task">
            <h1 className="application_task__heading">Review</h1>            
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
            {
              this.applicationComplete(this.state) && 
              !this.state.application.wasSubmitted ?
                <span>
                  <p className="application_task__instructions type__margin_top">
                    Congratulations!
                  </p>
                  <p className="application_task__instructions">
                    You&apos;ve provided all the required information
                    and you can now submit your application.
                  </p>
                  <p className="application_task__instructions">
                    Ensure that you review the information you provided because you will not
                    be able to make changes once you submit your application. If you feel like you&apos;ve
                    given accurate and correct information click the button below to submit your
                    application for review.
                  </p>
                  <Button type="button" solid text="Submit Application" doClick={this.handleApplicationSubmit} />
                </span>
              :
                this.props.application.isGetting ?
                  <p className="application_task__instructions type__margin_top">Checking your application for completeness....</p>
                :
                  null
            }
            {
              this.props.application.hasGotten && 
              !this.applicationComplete(this.state) && 
              !this.state.application.wasSubmitted ?
                <p className="application_task__instructions type__margin_top">
                  Your application is not complete. Ensure that you have
                  provided all required information before attempting
                  to submit your application.
                </p>
              :
                null
            }
            {
              this.props.application.hasGotten && 
              this.props.user.hasGotten && 
              this.state.application.wasSubmitted ?
                <p className="application_task__instructions type__margin_top">
                  Your application has been submitted for review.
                  We will be in touch with you through the email address
                  (<b>{this.state.user.email}</b>) you provided.
                </p>
              :
                null
            }
            {
              this.props.application.hasSubmitted &&
              this.props.application.hasSent &&
              !this.state.notificationClosed ?
                <Notification text="Application submitted! Check your email for confirmation."
                  doClose={this.handleNotificationClose} />
              :
                null
            }
            {
              this.props.application.hasSubmitted &&
              this.props.application.emailHasFailed ?
                <Notification text="Application submitted! We will be in touch."
                  doClose={this.handleNotificationClose} />
              :
                null
            }
          </div>
        )
    }
  }

  applicationComplete = state => {
    const { complete } = state;
    let keys = Object.keys(complete);

    for(let i = 0; i < keys.length; i++) {
      if (!complete[keys[i]])
        return false;
    }

    return true;
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
      this.state.application.tests &&
      Object.keys(this.state.application.tests).length > 0) {
      return (
        <TestList tests={this.state.application.tests}
          handleDelete={this.handleTestDelete}
          disabled={this.state.application.wasSubmitted} />
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

    this.props.userProfilePictureActions.doAvatarUpload(newGravatar);
  }

  handleEssaySave = html => {
    this.props.applicationActions.doApplicationUpdate(this.state.uid, { essay: html });
    this.setState({ hasChanged: true });
  }

  handleApplicationSubmit = () => {
    const submittedOn = new Date();
    this.props.applicationActions.doApplicationSubmit(this.state.uid, submittedOn);
  }

  handleNotificationClose = () => {
    this.setState({ notificationClosed: true });
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
      case "dob":
        this.props.userActions.doUserUpdateWithoutGet({ dob: new Date(e.target.value).getTime() });

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
  userProfilePictureActions: propTypes.object,
  profilePicture: propTypes.object,
  application: propTypes.object,
  userActions: propTypes.object,
  user: propTypes.object,
  complete: propTypes.object
};

const mapStateToProps = state => {
  return {
    profilePicture: state.userProfilePicture,
    user: state.user,
    application: state.application
  };
};

const mapDispatchToProps = dispatch => {
  return {
    applicationActions: bindActionCreators(applicationActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
    userProfilePictureActions: bindActionCreators(userProfilePictureActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationTask);