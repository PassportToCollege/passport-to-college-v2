import "./UserSection.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";
import moment from "moment";
import _ from "lodash";

import { auth } from "../../../../utils/firebase";

import * as studentActions from "../../../../actions/studentActions";
import * as userProfilePictureActions from "../../../../actions/userProfilePictureActions";
import * as featuresActions from "../../../../actions/featuresActions";
import * as featureActions from "../../../../actions/featureActions";
import * as usersActions from "../../../../actions/usersActions";
import * as postActions from "../../../../actions/postActions";
import * as postsActions from "../../../../actions/postsActions";

import PageMeta from "../../../../components/PageMeta";
import AnnotatedList from "../../../../components/AnnotatedList";
import LoadingText from "../../../../components/LoadingText";
import InitialsAvatar from "../../../../components/InitialsAvatar";
import DropUploader from "../../../../components/DropUploader";
import Loader from "../../../../components/Loader";
import Notification from "../../../../components/Notification";
import WYSIWYGEditor from "../../../../components/Editor";
import Button from "../../../../components/Button";
import { AddRole, DeleteUser, EditUserPersonal, EditStudentEducation } from "../../../../components/Modal";
import AddAccomplishment from "../../../AddAccomplishment";
import AccomplishmentsList from "../../../../components/AccomplishmentsList";
import FeatureStudent from "../../../FeatureStudent";
import FeatureList from "../../../../components/FeatureList";
import Toggler from "../../../../components/Toggler";

class UserSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: props.userId,
      section: props.section,
      user: props.user.hasGotten ? props.user.user : null,
      student: props.student.student,
      profilePicture: props.picture.picture || "",
      features: props.features.userFeatures,
      accomplishments: props.posts.accomplishmentsByUser,
      notificationClosed: false,
      hasError: false,
      hasNotification: false,
      addingAccomplishment: false,
      noAccomplishments: !!(props.posts.failedToGetAccomplishmentsByUser && props.posts.error),
      noFeatures: !!(props.features.hasFailed && props.features.error),
      creatingFeature: false,
      addingRole: false,
      editingRole: false,
      deletingUser: false,
      editingPersonal: false
    }
  }

  componentDidMount() {
    if (this.state.user && this.state.user.hasProfilePicture && this.state.section === "profile-picture") {
      if ((!this.state.profilePicture) ||
        (this.state.profilePicture && 
        this.state.profilePicture.indexOf(this.props.userId) === -1))
        this.props.uppActions.doAvatarGetByUid(this.props.userId);
    }
    
    if (this.state.user) {
      if (!this.state.student && this.state.user.isStudent) {
        this.props.studentActions.doStudentGet(this.props.userId);
      }

      if (this.state.user.isStudent) {
        if (!this.state.features && this.state.section === "features") {
          this.props.featuresActions.doGetFeaturesByUser(this.props.userId);
        }
  
        if (!this.state.accomplishments && this.state.section === "accomplishments") {
          this.props.postsActions.doGetAccomplishmentsByUser(this.props.userId, "all");
        }
      }

      if (this.state.student && !this.state.user.isStudent)
        this.setState({ student: null });
    }
  }

  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.user.hasGottenUser &&
    !_.isEqual(state.user, nextProps.user.user)) {
      return {
        user: nextProps.user.user
      };
    }

    if (nextProps.picture.hasGottenByUid && 
    nextProps.picture.picture.indexOf(nextProps.userId) > -1 &&
    nextProps.picture.picture !== state.profilePicture) {
      return {
        profilePicture: nextProps.picture.picture
      };
    }

    if (nextProps.student.hasGotten &&
    !_.isEqual(state.student, nextProps.student.student)) {
      return { 
        student: nextProps.student.student 
      };
    }
    
    if (nextProps.features.hasGotten &&
    !_.isEqual(state.features, nextProps.features.userFeatures)) {
      return {
        features: nextProps.features.userFeatures,
        noFeatures: false
      };
    }

    if (nextProps.features.hasFailed && 
      nextProps.features.error.message === "no features found" &&
      !state.noFeatures) {
      return {
        noFeatures: true,
        features: []
      };
    }
    
    if (nextProps.student.hasFailed) {
      return {
        hasError: true, 
        notificationClosed: false, 
        error: nextProps.student.error.message
      };
    }

    if (nextProps.posts.gotAccomplishmentsByUser &&
    nextProps.posts.student === nextProps.userId) {
      return {
        accomplishments: nextProps.posts.accomplishmentsByUser,
        noAccomplishments: false
      };
    }

    if (nextProps.posts.failedToGetAccomplishmentsByUser &&
    nextProps.posts.error.message === "no accomplishments found") {
      return {
        noAccomplishments: true,
        accomplishments: []
      };
    }
    
    return null;
  }

  getSnapshotBeforeUpdate(prevProps) {
    if (prevProps.user.isGettingUser && this.props.user.hasGottenUser) {
      return {
        gotUser: true
      };
    }

    if (prevProps.feature.isCreating && this.props.feature.hasCreated) {
      return {
        createdFeature: true
      };
    }

    if (prevProps.post.isCreating && this.props.post.hasCreated) {
      return {
        createdAccomplishment: true
      };
    }

    if (prevProps.post.deletingPost && this.props.post.deletedPost) {
      return {
        deletedAccomplishment: true
      };
    }

    if (prevProps.user.addingBio && this.props.user.addedBio)
      return { addedBio: true };

    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot && snapshot.gotUser) {
      if (this.props.user.user.hasProfilePicture &&
      this.state.profilePicture.indexOf(this.props.userId) === -1)
        this.props.uppActions.doAvatarGetByUid(this.props.userId);

      if (this.props.user.user.isStudent) {
        this.props.studentActions.doStudentGet(this.props.userId);
        this.props.featuresActions.doGetFeaturesByUser(this.props.userId);
        this.props.postsActions.doGetAccomplishmentsByUser(this.props.userId, "all");
      }
    }

    if (snapshot && snapshot.createdFeature) {
      this.props.studentActions.doStudentUpdate(this.state.student.uid, {
        isFeatured: true
      });

      this.setState({
        hasNotification: true,
        notificationClosed: false,
        notification: "Feature created successefully. Use the edit button to review and publish the feature so it shows on the website."
      });
    }

    if (snapshot && snapshot.createdAccomplishment) {
      this.props.postsActions.doGetAccomplishmentsByUser(this.props.userId, "all");

      this.setState({
        addingAccomplishment: false,
        hasNotification: true,
        notificationClosed: false,
        notification: "Accomplishment added successefully. Use the edit button to review and publish the accomplishment so it shows on the website."
      });
    }

    if (snapshot && snapshot.deletedAccomplishment) {
      this.props.postsActions.doGetAccomplishmentsByUser(this.props.userId, "all");

      this.setState({
        hasNotification: true,
        notificationClosed: false,
        notification: "Accomplishment deleted successefully"
      });
    }

    if (snapshot && snapshot.addedBio) {
      this.setState({
        hasNotification: true,
        notification: "Bio saved",
        notificationClosed: false
      });
    }
  }

  render() {
    return (
      <div>
        {
          this.state.hasError && !this.notificationClosed ?
            <Notification doClose={this.handleNotificationClose}
              text={this.state.error} /> :
            null
        }
        {
          this.state.hasNotification && !this.notificationClosed ?
            <Notification doClose={this.handleNotificationClose}
              text={this.state.notification} /> :
            null
        }
        { this.getSection(this.props.section) }
        {
          this.props.post.deletingPost ||
          this.props.feature.isDeleting ?
            <Loader styles={{
              marginTop: "5em"
            }} /> : null
        }
      </div>
    )
  }

  getSection = section => {
    switch (section) {
      case "education":
        return this.getEducationSection();
      case "profile-picture":
        return this.getProfilePictureSection()
      case "bio":
        return this.getBioSection();
      case "accomplishments":
        return this.getAccomplishmentsSection();
      case "features":
        return this.getFeaturesSection();
      case "settings":
        return this.getSettingsSection();
      case "personal":
      default:
        return this.getPersonalSection();
    }
  }

  getEducationSection = () => {
    if (this.props.user.hasGottenUser && this.state.user &&
      !this.state.user.isStudent) {
      return (
        <section className="user__section education__section">
          <PageMeta more={
            <title>Education | {this.state.user.name.full} | User | Dashboard | Passport to College</title>
          } />
          {this.getNotAStudentFlag()}
        </section>
      )
    }

    return (
      <section className="user__section education__section">
        {
          this.props.user.hasGottenUser && this.state.user ?
            <PageMeta more={
              <title>Education | {this.state.user.name.full} | User | Dashboard | Passport to College</title>
            } /> : null
        }
        <div className="user__section_left">
          <div className="user__education">
            <Button solid type="button" text="edit"
              doClick={() => this.setState({ editingEducation: true })}
              styles={{
                position: "absolute",
                right: "0",
                top: "2em",
                backgroundColor: "rgb(147,166,176)"
              }} />
            {
              this.props.student.hasGotten && this.state.student ?
                <AnnotatedList data={[
                  { label: "high school", text: this.state.student.highSchool || "no high school provided" },
                  { label: "university", text: this.state.student.university || "no university provided" },
                  { label: "major", text: this.state.student.major || "no major provided" },
                  { label: "minor", text: this.state.student.minor || "no minor provided" }
                ]} /> :
                <LoadingText options={{
                  class: "block__lines",
                  bg: "transparent",
                  height: "10px",
                  lines: [
                    { color: "rgba(255,101,97,0.2)", width: "80%" },
                    { color: "rgba(255,101,97,0.4)", width: "70%" }
                  ]
                }} />
            }
            {
              this.props.student.hasGotten && this.state.student 
              && this.state.editingEducation ?
                <EditStudentEducation student={this.state.student}
                  doClose={() => this.setState({ editingEducation: false })}
                  doSubmit={this.handleStudentEducationEdit} /> :
                null
            }
          </div>
        </div>
        <div className="user__section_right">
          <div className="user__education_meta">
            <h5>Meta</h5>
            {
              this.props.student.hasGotten && this.state.student ?
                <AnnotatedList data={[
                  { label: "enrollment year", text: this.state.student.enrollmentYear || "no enrollment year provided" },
                  { label: "graduation year", text: this.state.student.graduationYear || "no graduation year provided" },
                  { 
                    label: "graduated?", 
                    text: this.state.student.hasGraduated ? "yes" : "no" 
                  }
                ]} /> :
                <LoadingText options={{
                  class: "block__lines",
                  bg: "transparent",
                  height: "10px",
                  lines: [
                    { color: "rgba(255,101,97,0.2)", width: "80%" },
                    { color: "rgba(255,101,97,0.4)", width: "70%" }
                  ]
                }} />
            }
          </div>
        </div>
      </section>
    );
  }

  getProfilePictureSection = () => {
    return (
      <section className="user__section profile_picture__section">
        {
          this.props.user.hasGottenUser && this.state.user ?
            <PageMeta more={
              <title>Profile Picture | {this.state.user.name.full} | User | Dashboard | Passport to College</title>
            } /> : null
        }
        {
          (this.props.picture.hasGottenByUid || this.props.user.hasGottenUser) &&
          (this.state.profilePicture || (this.state.user && this.state.user.photo)) ?
            <div className="user__profile_picture_container">
              <img src={this.state.profilePicture || this.state.user.photo} alt="User Avatar" />
            </div> :
            this.props.picture.hasFailedByUid || (this.state.user && !this.state.user.hasProfilePicture) ?
              <p>No profile picture</p> :
              <Loader />
        }
        <DropUploader handleAvatarChange={this.updateProfilePicture} />
      </section>
    );
  }

  getPersonalSection = () => {
    return (
      <section className="user__section personal__section">
        <Button solid type="button" text="edit"
          doClick={() => this.setState({ editingPersonal: true })}
          styles={{
            position: "absolute",
            right: "0",
            top: "2em",
            backgroundColor: "rgb(147,166,176)"
          }} />
        <div className="user__section_left">
          <div className="user__personal">
            {
              this.props.user.hasGottenUser && this.state.user ?
                <InitialsAvatar initials={`${this.state.user.name.first[0]}${this.state.user.name.last[0]}`} 
                styles={{ display: "flex", margin: "0 auto 1em" }}/> :
                null
            }
            {
              this.props.user.hasGottenUser && this.state.user ?
                <AnnotatedList data={[
                  { label: "full name", text: this.state.user.name.full },
                  { 
                    label: "dob", 
                    text: this.state.user.dob ? moment.utc(moment(this.state.user.dob)).format("MM-DD-Y") : "no dob" 
                  },
                  { label: "gender", text: this.state.user.gender || "no gender provided" }
                ]} /> :
                <LoadingText options={{
                  class: "block__lines",
                  bg: "transparent",
                  height: "10px",
                  lines: [
                    { color: "rgba(255,101,97,0.2)", width: "80%" },
                    { color: "rgba(255,101,97,0.4)", width: "70%" },
                    { color: "rgba(255,101,97,0.2)", width: "80%" },
                    { color: "rgba(255,101,97,0.4)", width: "90%" },
                    { color: "rgba(255,101,97,0.4)", width: "70%" },
                    { color: "rgba(255,101,97,0.2)", width: "80%" }
                  ]
                }} />
            }
            {
              this.props.user.hasGottenUser && this.state.user
                && this.state.editingPersonal ?
                <EditUserPersonal user={this.state.user}
                  doClose={() => this.setState({ editingPersonal: false })}
                  doSubmit={this.handleUserPersonalEdit} /> :
                null
            }
          </div>
        </div>
        <div className="user__section_right">
            <div className="user__contact">
              <h4>Contact Information</h4>
              {
                this.props.user.hasGottenUser && this.state.user ?
                  <AnnotatedList data={[
                    { label: "email", text: this.state.user.email },
                    { label: "phone", text: this.state.user.phone || "no phone number" },
                    { 
                      label: "country", 
                      text: this.state.user.address ? this.state.user.address.country : "no country" 
                    }
                  ]} /> :
                  <LoadingText options={{
                    class: "block__lines",
                    bg: "transparent",
                    height: "10px",
                    lines: [
                      { color: "rgba(255,101,97,0.2)", width: "80%" },
                      { color: "rgba(255,101,97,0.4)", width: "70%" },
                      { color: "rgba(255,101,97,0.2)", width: "80%" },
                      { color: "rgba(255,101,97,0.4)", width: "90%" },
                      { color: "rgba(255,101,97,0.4)", width: "70%" },
                      { color: "rgba(255,101,97,0.2)", width: "80%" }
                    ]
                  }} />
              }
            </div>
        </div>
      </section>
    );
  }

  getSettingsSection = () => {
    return (
      <section className="user__section settings__section">
        {
          this.props.user.hasGottenUser && this.state.user ?
            <PageMeta more={
              <title>Settings | {this.state.user.name.full} | User | Dashboard | Passport to College</title>
            } /> : null
        }
        <div className="user__section_left">
          <div className="settings__roles">
            <h4>User Roles</h4>
            <div className="settings__item">
              <p>Admin</p>
              {
                this.props.user.hasGottenUser && this.state.user ?
                  <Toggler state={this.state.user.isAdmin ? "yes" : "no"} 
                    doClick={this.toggleAdminSetting} /> :
                  <Loader width="16px" styles={{
                    margin: "0"
                  }} />
              }
            </div>
            <div className="settings__item">
              <p>Staff</p>
              {
                this.props.user.hasGottenUser && this.state.user ?
                  <Toggler state={this.state.user.isStaff ? "yes" : "no"}
                    doClick={this.toggleStaffSetting} /> :
                  <Loader width="16px" styles={{
                    margin: "0"
                  }} />
              }
            </div>
            <div className="settings__item">
              <p>Role</p>
              {
                this.props.user.hasGottenUser && this.state.user &&
                this.state.user.isStaff ?
                  this.state.user.role ?
                    <span>
                      <p>{this.state.user.role}</p>
                      <span className="settings__edit_role"
                        onClick={() => this.setState({ editingRole: true })}>edit</span>
                    </span> :
                    <span>
                      <p>no role yet</p>
                      <span className="settings__add_role"
                        onClick={() => this.setState({ addingRole: true })}>add</span>
                    </span>
                  :
                  null
              }
              {
                this.props.user.hasGottenUser && this.state.user &&
                  !this.state.user.isStaff ?
                  <p>user is not on staff</p>:
                  null
              }
              {
                this.state.addingRole ?
                  <AddRole doSubmit={this.handleAddRoleSubmit} 
                    doClose={() => this.setState({ addingRole: false })} /> :
                  null
              }
              {
                this.props.user.hasGottenUser && this.state.user &&
                this.state.user.role && this.state.editingRole ?
                  <AddRole doSubmit={this.handleAddRoleSubmit}
                    doClose={() => this.setState({ editingRole: false })} 
                    role={this.state.user.role} /> :
                  null
              }
            </div>
          </div>
          <div className="settings__account">
            <h4>Account</h4>
            <div className="settings__item">
              <p>Send password reset email</p>
              {
                this.props.user.hasGottenUser && this.state.user ?
                  <Button type="button" solid text="send"
                    doClick={this.sendPasswordResetEmail}
                    styles={{
                      backgroundColor: "rgb(147,166,176)"
                    }} /> :
                  null
              }
            </div>
          </div>
        </div>
        <div className="user__section_right">
          <div className="settings__students">
            <h4>Students</h4>
            {
              this.props.user.hasGottenUser && this.state.user &&
              this.state.user.isStudent ?
              <span>
                <div className="settings__item">
                  <p>Graduated</p>
                    {
                      this.props.student.hasGotten && this.state.student ?
                        <Toggler state={this.state.student.hasGraduated ? "yes" : "no"}
                        doClick={this.toggleGraduated} /> :
                        <Loader width="16px" styles={{
                          margin: "0"
                        }}/>
                    }
                </div>
                <div className="settings__item">
                  <p>Show on website</p>
                  {
                    this.props.student.hasGotten && this.state.student ?
                    <Toggler state={this.state.student.showOnSite ? "yes" : "no"}
                      doClick={this.toggleShowOnSite} />:
                    <Loader width="16px" styles={{
                      margin: "0"
                    }}/>
                  }
                </div>
              </span> :
              null
            }
            {
              this.props.user.hasGottenUser && this.state.user &&
                !this.state.user.isStudent ?
                this.getNotAStudentFlag() :
                null
            }
          </div>
          <div className="settings__delete_user">
            <h4>Remove User</h4>
            {
              this.props.user.hasGottenUser && this.state.user ?
                <Button solid text={`delete ${this.state.user.name.full}`}
                  doClick={() => this.setState({ deletingUser: true })} 
                  styles={{
                    backgroundColor: "rgb(147,166,176)"
                  }} /> :
                null
            }
            {
              this.props.user.hasGottenUser && this.state.user &&
              this.state.deletingUser ?
                <DeleteUser name={this.state.user.name.full}
                  doClose={() => this.setState({ deletingUser: false })}
                  doSubmit={this.handleUserDelete} /> :
                null
            }
          </div>
        </div>
      </section>
    );
  }

  getFeaturesSection = () => {
    if (this.props.user.hasGottenUser && this.state.user &&
      !this.state.user.isStudent) {
      return (
        <section className="user__section features__section">
          <PageMeta more={
            <title>Features | {this.state.user.name.full} | User | Dashboard | Passport to College</title>
          } />
          {this.getNotAStudentFlag()}
        </section>
      )
    }
    
    if (this.props.student.hasGotten) {
      return (
        <section className="user__section features__section">
          {
            this.props.user.hasGottenUser && this.state.user ?
              <PageMeta more={
                <title>Features | {this.state.user.name.full} | User | Dashboard | Passport to College</title>
              } /> : null
          }
          <Button text="+ feature student"
            doClick={this.toggleFeatureStudent}
            solid
            styles={{
              position: "absolute",
              right: "0",
              backgroundColor: "rgb(147,166,176)"
            }} />
          <div className="features__section_content">
            {
              this.props.features.hasFailed && this.state.noFeatures ?
                <div className="user__no_features">
                  <h6>student has not been featured</h6>
                </div> :
                null
            }
            {
              this.state.creatingFeature ?
                <FeatureStudent student={this.state.student}
                  doClose={() => this.setState({ creatingFeature: false })} /> :
                null
            }
            {
              this.props.features.hasGotten && this.state.features ?
                <FeatureList actions features={this.state.features} 
                  doDelete={this.handleFeatureDelete} 
                  doEdit={this.handleFeatureEdit} /> :
                null
            }
          </div>
        </section>
      )
    } else {
      return (
        <Loader styles={{
          marginTop: "5em"
        }} />
      )
    }
  }

  getAccomplishmentsSection = () => {
    if (this.props.user.hasGottenUser && this.state.user &&
      !this.state.user.isStudent) {
      return (
        <section className="user__section accomplishments__section">
          <PageMeta more={
            <title>Accomplishments | {this.state.user.name.full} | User | Dashboard | Passport to College</title>
          } />
          {this.getNotAStudentFlag()}
        </section>
      )
    }

    if (this.props.student.hasGotten) {
      return (
        <section className="user__section accomplishments__section">
          {
            this.props.user.hasGottenUser && this.state.user ?
              <PageMeta more={
                <title>Accomplishments | {this.state.user.name.full} | User | Dashboard | Passport to College</title>
              } /> : null
          }
          <Button text="+ accomplishment" 
            solid 
            styles={{
              position: "absolute",
              right: "0",
              backgroundColor: "rgb(147,166,176)"
            }} 
            doClick={this.toggleAddAccomplishment} />
          <div className="accomplishments__section_content">
            {
              this.state.noAccomplishments ?
                <div className="user__no_accomplishments">
                  <h6>no accomplishments listed yet</h6>
                </div> :
              null
            }
            {
              this.state.addingAccomplishment && this.state.student ?
                <AddAccomplishment student={this.state.student}
                  doClose={() => this.setState({ addingAccomplishment: false })} /> :
                  null
            }
            {
              this.state.accomplishments ?
                <div className="user__accomplishments">
                  <AccomplishmentsList actions
                    accomplishments={this.state.accomplishments} 
                    doDelete={this.handleAccomplishmentDelete} 
                    doEdit={this.handleAccomplishmentEdit} />
                </div> :
                null
            }
          </div>
        </section>
      )
    } else {
      return (
        <Loader styles={{
          marginTop: "5em"
        }}/>
      )
    }
  }

  getBioSection = () => {
    return (
      <section className="user__section bio__section">
        {
          this.props.user.hasGottenUser && this.state.user ?
            <PageMeta more={
              <title>Bio | {this.state.user.name.full} | User | Dashboard | Passport to College</title>
            } /> : null
        }
        {
          this.state.user && this.state.user.isStudent &&
          this.props.student.hasGotten && this.state.student
          && this.state.student.bio && this.state.student.bio.blocks ?
            <WYSIWYGEditor content={this.state.student.bio} saveButton
              handleSave={this.handleBioSave}
              editorStyles={{
                margin: "0 auto",
                maxWidth: "100%",
                padding: "2em 1.875em",
                backgroundColor: "#FFF",
                border: "none"
              }} 
              controlStyles={{
                maxWidth: "100%",
                position: "static",
                marginBottom: "0"
              }} />
              :
            this.state.user && this.state.user.bio &&
            this.state.user.bio.blocks ?
              <WYSIWYGEditor content={this.state.user.bio} saveButton
                handleSave={this.handleBioSave}
                editorStyles={{
                  margin: "0 auto",
                  maxWidth: "100%",
                  padding: "2em 1.875em",
                  backgroundColor: "#FFF",
                  border: "none"
                }} 
                controlStyles={{
                  maxWidth: "100%",
                  position: "static",
                  marginBottom: "0"
                }} /> :
              <WYSIWYGEditor saveButton
                handleSave={this.handleBioSave}
                editorStyles={{
                  margin: "0 auto",
                  maxWidth: "100%",
                  padding: "2em 1.875em",
                  backgroundColor: "#FFF",
                  border: "none"
                }}
                controlStyles={{
                  maxWidth: "100%",
                  position: "static",
                  marginBottom: "0"
                }} />
        }
      </section>
    );
  }

  getNotAStudentFlag = () => {
    return (
      <div className="user__not_student">
        <h6>user is no a student</h6>
      </div>
    )
  }

  toggleAddAccomplishment = () => {
    if (this.state.editingAccomplishment)
      return this.setState({ editingAccomplishment: false });

    this.setState({ addingAccomplishment: !this.state.addingAccomplishment });
  }

  toggleFeatureStudent = () => {
    let canAdd = true;

    if (!this.state.noFeatures) {
      let { features } = this.state;
      for (let i = 0; i < features.length; i++) {
        if (features[i].isActive) {
          canAdd = false;
          break;
        }
      }
    }

    if (canAdd) {
      this.setState({ creatingFeature: !this.state.creatingFeature });
    } else {
      this.setState({
        hasError: true,
        notificationClosed: false,
        error: "A student may only have one active feature. This student already has an active feature. Edit the current active feature or delete it before trying to add a new feature"
      });
    }
  }

  updateProfilePicture = e => {
    let newProfilePicture = e.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(newProfilePicture);
    reader.onload = event => {
      let dataUrl = event.target.result;

      let image = new Image();
      image.src = dataUrl;
      image.onload = () => {
        const { height, width } = image;
        
        // ensure image is squarish
        if (Math.abs(height - width) <= 100)
          return this.props.uppActions.doAvatarUpload(newProfilePicture, { uid: this.state.uid });
        
        this.setState({ hasError: true, error: "Profile picture dimensions should be 1:1" });
      }
    }
  }

  handleNotificationClose = () => {
    this.setState({ 
      hasError: false,
      hasNotification: false, 
      notificationClosed: true, 
      error: "",
      notification: "" 
    });
  }

  handleBioSave = content => {
    if (this.state.user.isStudent) {
      // update student with content
      // and refresh student
      return this.props.studentActions.doStudentUpdate(this.state.uid, { bio: content });
    }

    this.props.usersActions.doAddBio(this.state.uid, content, {
      refresh: true
    });
  }

  handleAccomplishmentDelete = accomplishment => {
    this.props.postActions.doPostDelete(accomplishment);
  }

  handleAccomplishmentEdit = accomplishment => {
    this.props.history.push(`/admin/dashboard/posts/e/${accomplishment.id}`);
  }

  handleFeatureDelete = feature => {
    if (feature.isActive)
      this.props.studentActions.doStudentUpdate(this.state.student.uid, { isFeatured: false });

    this.props.featureActions.doFeatureDelete(feature, { refresh: true });
  }

  handleFeatureEdit = feature => {
    this.props.history.push(`/admin/dashboard/posts/e/${feature.id}`);
  }

  toggleAdminSetting = () => {
    this.props.usersActions.doUserUpdate(this.state.user.uid, { 
      isAdmin: !this.state.user.isAdmin 
    }, { refresh: true });
  }

  toggleStaffSetting = () => {
    this.props.usersActions.doUserUpdate(this.state.user.uid, {
      isStaff: !this.state.user.isStaff
    }, { refresh: true });
  }

  toggleGraduated = () => {
    this.props.studentActions.doStudentUpdate(this.state.student.uid, { 
      hasGraduated: !this.state.student.hasGraduated
     });
  }

  toggleShowOnSite = () => {
    this.props.studentActions.doStudentUpdate(this.state.student.uid, {
      showOnSite: !this.state.student.showOnSite
    });
  }

  handleAddRoleSubmit = e => {
    this.props.usersActions.doUserUpdate(this.state.user.uid, {
      role: e.value
    }, { refresh: true });

    this.setState({ addingRole: false, editingRole: false });
  }

  handleUserDelete = () => {
    this.setState({
      hasError: true,
      notificationClosed: false,
      error: "Only support for removing users from the firebase console is available at the moment"
    })
  }

  sendPasswordResetEmail = () => {
    auth.sendPasswordResetEmail(this.state.user.email)
      .then(() => {
        this.setState({
          hasError: true,
          notificationClosed: false,
          error: "Password reset email sent"
        });
      })
      .catch(error => {
        this.setState({
          hasError: true,
          notificationClosed: false,
          error: error.message
        });
      });
  }

  handleUserPersonalEdit = user => {
    this.props.usersActions.doUserUpdate(user.uid, user, {
      refresh: true
    });

    this.setState({ editingPersonal: false });
  }

  handleStudentEducationEdit = student => {
    this.props.studentActions.doStudentUpdate(student.uid, student);
    this.setState({ editingEducation: false });
  }
}

UserSection.propTypes = {
  section: propTypes.string,
  history: propTypes.object,
  userId: propTypes.string,
  user: propTypes.object,
  student: propTypes.object,
  studentActions: propTypes.object,
  feature: propTypes.object,
  features: propTypes.object,
  featuresActions: propTypes.object,
  featureActions: propTypes.object,
  picture: propTypes.object,
  uppActions: propTypes.object,
  usersActions: propTypes.object,
  post: propTypes.object,
  postActions: propTypes.object,
  posts: propTypes.object,
  postsActions: propTypes.object
};

const mapStateToProps = state => {
  return {
    student: state.student,
    picture: state.userProfilePicture,
    feature: state.feature,
    features: state.features,
    post: state.post,
    posts: state.posts
  };
};

const mapDispatchToProps = dispatch => {
  return {
    studentActions: bindActionCreators(studentActions, dispatch),
    uppActions: bindActionCreators(userProfilePictureActions, dispatch),
    featuresActions: bindActionCreators(featuresActions, dispatch),
    featureActions: bindActionCreators(featureActions, dispatch),
    usersActions: bindActionCreators(usersActions, dispatch),
    postActions: bindActionCreators(postActions, dispatch),
    postsActions: bindActionCreators(postsActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserSection);