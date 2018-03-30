import "./UserSection.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as studentActions from "../../../../actions/studentActions";
import * as userProfilePictureActions from "../../../../actions/userProfilePictureActions";
import * as featuresActions from "../../../../actions/featuresActions";
import * as featureActions from "../../../../actions/featureActions";
import * as usersActions from "../../../../actions/usersActions";

import AnnotatedList from "../../../../components/AnnotatedList";
import LoadingText from "../../../../components/LoadingText";
import InitialsAvatar from "../../../../components/InitialsAvatar";
import DropUploader from "../../../../components/DropUploader";
import Loader from "../../../../components/Loader";
import Notification from "../../../../components/Notification";
import WYSIWYGEditor from "../../../../components/Editor";
import Button from "../../../../components/Button";
import { AddRole, DeleteUser } from "../../../../components/Modal";
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
      user: props.user.user,
      student: props.student.student,
      features: props.features.features,
      profilePicture: props.picture.picture,
      notificationClosed: false,
      hasError: false,
      hasNotification: false,
      addingAccomplishment: false,
      editingAccomplishment: false,
      accomplishment: {},
      editingSlug: "",
      noFeatures: props.features.hasFailed && props.features.error,
      editingFeature: false,
      creatingFeature: false,
      featureBeingEdited: {},
      addingRole: false,
      editingRole: false,
      deletingUser: false
    }
  }

  componentWillMount() {
    if (!this.state.profilePicture)
      this.props.uppActions.doAvatarGetByUid(this.props.userId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.hasGottenUser)
      this.setState({ user: nextProps.user.user });
      
    if (nextProps.user.hasGottenUser 
      && nextProps.user.user.isStudent
      && !this.props.student.hasGotten
      && !this.props.student.isGetting) {
        this.props.studentActions.doStudentGet(this.state.uid);
        this.props.featuresActions.doGetFeaturesByUser(this.state.uid);
    }

    if (nextProps.picture.hasGottenByUid)
      this.setState({ profilePicture: nextProps.picture.picture });

    if (nextProps.student.hasGotten)
      this.setState({ student: nextProps.student.student });
    
    if (nextProps.features.hasGotten)
      this.setState({ features: nextProps.features.features });

    if (nextProps.features.hasFailed && 
      nextProps.features.error.message === "no features found")
      this.setState({ noFeatures: true });

    if (nextProps.student.hasFailed)
      this.setState({ hasError: true, notificationClosed: false, error: nextProps.student.error.message });
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
        { this._render(this.props.section) }
      </div>
    )
  }

  _render = section => {
    switch (section) {
      case "education":
        if (this.props.user.hasGottenUser && this.state.user &&
          !this.state.user.isStudent) {
          return (
            <section className="user__section education__section">
              <div className="user__not_student">
                <h4>user is no a student</h4>
              </div>
            </section>
          )
        }

        return (
          <section className="user__section education__section">
            <div className="user__section_left">
              <div className="user__education">
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
                      { label: "graduated?", text: this.state.student.hasGraduated || "don't know" }
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
        )
      case "profile-picture":
        return (
          <section className="user__section profile_picture__section">
            {
              this.props.picture.hasGottenByUid && this.state.profilePicture ?
                <div className="user__profile_picture_container">
                  <img src={this.state.profilePicture} alt="User Avatar" />
                </div> :
                this.props.picture.hasFailedByUid ?
                  <p>No profile picture</p> :
                  <Loader />
            }
            <DropUploader handleAvatarChange={this.updateProfilePicture} />
          </section>
        )
      case "bio":
        return (
          <section className="user__section bio__section">
            {
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
        )
      case "accomplishments":
        if (this.props.user.hasGottenUser && this.state.user &&
          !this.state.user.isStudent) {
          return (
            <section className="user__section accomplishments__section">
              <div className="user__not_student">
                <h4>user is no a student</h4>
              </div>
            </section>
          )
        }

        if (this.props.student.hasGotten) {
          return (
            <section className="user__section accomplishments__section">
              <Button text={this.state.addingAccomplishment || this.state.editingAccomplishment ? "- cancel" : "+ accomplishment"} 
                solid 
                styles={{
                  position: "absolute",
                  right: "0"
                }} 
                doClick={this.toggleAddAccomplishment} />
              <div className="accomplishments__section_content">
                {
                  this.props.student.hasGotten && this.state.student
                  && !this.state.student.accomplishments ?
                    <div className="user__no_accomplishments">
                      <h4>no accomplishments listed yet</h4>
                    </div> :
                  null
                }
                {
                  this.state.addingAccomplishment && this.props.student.hasGotten
                    && this.state.student ?
                    <AddAccomplishment student={this.state.student}
                      doClose={() => this.setState({ addingAccomplishment: false })} /> :
                      this.state.editingAccomplishment && this.props.student.hasGotten ?
                      <AddAccomplishment edit={true} student={this.state.student}
                        slug={this.state.editingSlug}
                        accomplishment={this.state.accomplishment}
                        doClose={() => 
                          this.setState({ 
                            editingAccomplishment: false,
                            editingSlug: "",
                            accomplishment: {} 
                          })
                        } /> :
                      null
                }
                {
                  this.props.student.hasGotten && this.state.student
                    && this.state.student.accomplishments ?
                    <div className="user__accomplishments">
                      <AccomplishmentsList actions
                        accomplishments={this.state.student.accomplishments} 
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
      case "features":
        if (this.props.user.hasGottenUser && this.state.user &&
          !this.state.user.isStudent) {
          return (
            <section className="user__section features__section">
              <div className="user__not_student">
                <h4>user is no a student</h4>
              </div>
            </section>
          )
        }
        
        if (this.props.student.hasGotten) {
          return (
            <section className="user__section features__section">
              <Button text={this.state.editingFeature ? "- cancel" : "+ feature student"}
                doClick={this.toggleFeatureStudent}
                solid
                styles={{
                  position: "absolute",
                  right: "0"
                }} />
              <div className="features__section_content">
                {
                  this.props.features.hasFailed && this.state.noFeatures ?
                    <div className="user__no_features">
                      <h4>student has not been featured</h4>
                    </div> :
                    null
                }
                {
                  this.state.editingFeature ?
                    <FeatureStudent editing student={this.state.student}
                      feature={this.state.featureBeingEdited}
                      doClose={() => this.setState({ editingFeature: false })} /> :
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
      case "settings":
        return (
          <section className="user__section settings__section">
            <div className="user__section_left">
              <div className="settings__roles">
                <h2>User Roles</h2>
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
            </div>
            <div className="user__section_right">
              <div className="settings__students">
                <h2>Students</h2>
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
                    <div className="user__not_student">
                      <h4>user is no a student</h4>
                    </div> :
                    null
                }
              </div>
              <div className="settings__delete_user">
                <h2>Remove User</h2>
                {
                  this.props.user.hasGottenUser && this.state.user ?
                    <Button solid text={`delete ${this.state.user.name.full}`}
                      doClick={() => this.setState({ deletingUser: true })} /> :
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
        )
      case "personal":
      default:
        return (
          <section className="user__section personal__section">
            <div className="user__section_left">
              <div className="user__personal">
                {
                  this.props.user.hasGottenUser && this.state.user ?
                    <InitialsAvatar initials={`${this.state.user.name.first[0]}${this.state.user.name.last[0]}`} 
                    styles={{ display: "block", margin: "0 auto 1em" }}/> :
                    null
                }
                {
                  this.props.user.hasGottenUser && this.state.user ?
                    <AnnotatedList data={[
                      { label: "full name", text: this.state.user.name.full },
                      { label: "dob", text: this.state.user.dob || "no dob" },
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
              </div>
            </div>
            <div className="user__section_right">
                <div className="user__contact">
                  <h2>Contact Information</h2>
                  {
                    this.props.user.hasGottenUser && this.state.user ?
                      <AnnotatedList data={[
                        { label: "email", text: this.state.user.email },
                        { label: "phone", text: this.state.user.phone || "no phone number" },
                        { label: "country", text: this.state.user.address || "no country" }
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
        )
    }
  }

  toggleAddAccomplishment = () => {
    if (this.state.editingAccomplishment)
      return this.setState({ editingAccomplishment: false });

    this.setState({ addingAccomplishment: !this.state.addingAccomplishment });
  }

  toggleFeatureStudent = () => {
    if (this.state.editingFeature) {
      return this.setState({ 
        editingFeature: !this.state.editingFeature,
        featureBeingEdited: {} 
      });
    }

    let canAdd = true;

    // check if student has an active feature
    // deny if true
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
    // update student with content
    // and refresh student
    this.props.studentActions.doStudentUpdate(this.state.uid, { bio: content });
    this.setState({
      hasNotification: true,
      notification: "Bio saved",
      notificationClosed: false
    });
  }

  handleAccomplishmentDelete = slug => {
    this.props.studentActions.doAccomplishmentDelete(this.state.student.uid, slug, {
      refresh: true
    });
  }

  handleAccomplishmentEdit = slug => {
    this.setState({
      editingAccomplishment: true,
      editingSlug: slug,
      accomplishment: this.state.student.accomplishments[slug]
    });
  }

  handleFeatureDelete = feature => {
    this.props.featureActions.doFeatureDelete(feature, { refresh: true });
  }

  handleFeatureEdit = feature => {
    this.setState({ editingFeature: true, featureBeingEdited: feature });
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
}

UserSection.propTypes = {
  section: propTypes.string,
  userId: propTypes.string,
  user: propTypes.object,
  student: propTypes.object,
  studentActions: propTypes.object,
  features: propTypes.object,
  featuresActions: propTypes.object,
  featureActions: propTypes.object,
  picture: propTypes.object,
  uppActions: propTypes.object,
  usersActions: propTypes.object
};

const mapStateToProps = state => {
  return {
    student: state.student,
    picture: state.userProfilePicture,
    features: state.features
  };
};

const mapDispatchToProps = dispatch => {
  return {
    studentActions: bindActionCreators(studentActions, dispatch),
    uppActions: bindActionCreators(userProfilePictureActions, dispatch),
    featuresActions: bindActionCreators(featuresActions, dispatch),
    featureActions: bindActionCreators(featureActions, dispatch),
    usersActions: bindActionCreators(usersActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserSection);