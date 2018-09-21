import "./Profile.css";

import React, { Component } from "react";
import { Route } from "react-router-dom";
import propTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import moment from "moment";
import _ from "lodash";

import * as userProfilePictureActions from "../../../actions/userProfilePictureActions";
import * as userActions from "../../../actions/userActions";
import * as studentActions from "../../../actions/studentActions";
import { auth } from "../../../utils/firebase";
import * as routes from "../../../constants/routes";

import PageMeta from "../../../components/PageMeta";
import LoadingText from "../../../components/LoadingText";
import ImageUploader from "../../../components/ImageUploader";
import Notification, { InlineNotification } from "../../../components/Notification";
import AnnotatedList from "../../../components/AnnotatedList";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import Form from "../../../components/Form";
import Input from "../../../components/Input";
import FlexContainer from "../../../components/FlexContainer";
import RadioList from "../../../components/RadioList";
import Loader from "../../../components/Loader";
import WYSIWYGEditor from "../../../components/Editor";
import InfoStrip from "../../../components/InfoStrip";
import Settings from "../../StudentDashboard/StudentDashboardSettings";

const defAvatar = require("../../../assets/images/default-gravatar.png");

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profilePicture: props.profilePicture.url,
      user: props.user.user,
      editingPersonal: false,
      editingEducation: false,
      updatedInfo: {}
    };
  }

  componentDidMount() {
    if (!this.state.profilePicture)
      this.props.userProfilePictureActions.doAvatarGet();

    if (!this.state.user)
      this.props.userActions.doUserGet();
    
    if (this.state.user && !this.state.student && this.state.user.isStudent)
      this.props.studentActions.doStudentGet(this.state.user.uid);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.profilePicture.url && nextProps.profilePicture.url !== "" &&
    nextProps.profilePicture.url !== prevState.profilePicture) {
      return {
        profilePicture: nextProps.profilePicture.url
      };
    }

    if (nextProps.profilePicture.hasFailed) {
      return {
        profilePicture: defAvatar
      };
    }

    if (nextProps.user.hasGotten &&
    !_.isEqual(nextProps.user.user, prevState.user)) {
      return {
        user: nextProps.user.user
      };
    }

    if (nextProps.student.hasGotten &&
      !_.isEqual(nextProps.student.student, prevState.student)) {
      return {
        student: nextProps.student.student
      };
    }

    return null;
  }

  getSnapshotBeforeUpdate(props) {
    if (props.user.isGetting && this.props.user.hasGotten) {
      return { gotUser: true };
    }

    if (props.user.isUpdating && this.props.user.hasUpdated) {
      return { updatedUser: true };
    }

    if (props.student.isUpdating && this.props.student.hasUpdated) {
      return { updatedStudent: true };
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot) {
      if (snapshot.gotUser && this.state.user && this.state.user.isStudent && !this.props.student.isGetting)
        this.props.studentActions.doStudentGet(this.state.user.uid);

      if (snapshot.updatedUser || snapshot.updatedStudent) {
        this.setState({ 
          editingPersonal: false,
          editingEducation: false, 
          updatedInfo: {},
          hasNotification: true,
          notificationClosed: false,
          notification: "information updated successfully" 
        });
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <Route exact path={routes.PROFILE.route}
          render={this.renderDefault} />
        <section className="profile__container_settings">
          <Route path={routes.PROFILE_SETTINGS.route}
            render={props => {
              return <Settings {...props} student={this.props.student}
                studentActions={this.props.studentActions} />
            }} />
        </section>
      </React.Fragment>
    )
  }

  renderDefault = () => {
    return (
      <React.Fragment>
        <PageMeta more={
          <title>Profile | Dashboard | Passport to College</title>
        } />
        {
          this.state.hasNotification && !this.state.notificationClosed ?
            <Notification doClose={() => {
                this.setState({
                  hasNotification: false,
                  notificationClosed: true,
                  notification: null
                })
              }}
              text={this.state.notification} /> :
            null
        }
        {
          this.state.editingPersonal ?
            <Modal classes={["modal__student_edit_profile"]}
              doClose={() => this.setState({ editingPersonal: false, updatedInfo: {} })}>
              {this.renderPersonalForm()}
            </Modal> : null
        }
        {
          this.state.editingEducation ?
            <Modal classes={["modal__student_edit_profile"]}
              doClose={() => this.setState({ editingEducation: false, updatedInfo: {} })}>
              {this.renderEducationForm()}
            </Modal> : null
        }
        <div className="profile__container">
          <div className="profile__header">
            <div className="dashboard__container profile__header_body">
              <ImageUploader default={this.state.profilePicture}
                onUpload={this.handleProfilePictureChange} />
              <div className="profile__header_info">
                {this.createHeaderInfo()}
              </div>
            </div>
          </div>
          <div className="dashboard__container profile__body">
            {this.renderUserData()}
            <FlexContainer styles={{ justifyContent: "space-between" }}>
              <h4>Education</h4>
              <Button text="edit" solid
                disabled={this.state.user && !this.state.user.isStudent}
                doClick={() => this.setState({ editingEducation: true })} />
            </FlexContainer>
            {this.renderEducation()}
            <FlexContainer styles={{ justifyContent: "space-between" }}>
              <h4 style={{ marginBottom: "16px" }}>Bio</h4>
            </FlexContainer>
            {this.renderBio()}
            <InfoStrip stripStyles={{
              padding: "2em 1em",
              backgroundColor: "#FF443F",
              fontSize: "12px",
              fontFamily: "inherit",
              textAlign: "left"
            }} >
              <p className="student_dashboard__meta_item">LAST SIGNED IN: {auth.currentUser ? auth.currentUser.metadata.lastSignInTime : null}</p>
            </InfoStrip>
          </div>
        </div>
      </React.Fragment>
    )
  }

  createHeaderInfo = () => {
    if (this.state.user) {
      let user = this.state.user;

      return (
        <span>
          <h3 className="profile__name">{user.name.full}</h3>
          <p className="type__caption">{user.email}</p>
          <span>
            <Button text="edit" solid
              doClick={() => this.setState({ editingPersonal: true })} />
            <Button text="settings" solid
              doClick={this.handleSettingsButtonClick} />
          </span>
        </span>
      );
    } 

    return (
      <LoadingText options={{
        class: "profile__header_loading",
        bg: "transparent",
        height: "10px",
        lines: [
          { color: "#FF443F", width: "100%" },
          { color: "#FF443F", width: "50%" }
        ]
      }} />
    )
  }

  renderUserData = () => {
    if (this.state.user) {
      return (
        <AnnotatedList data={[
          { label: "full name", text: this.state.user.name.full },
          {
            label: "born",
            text: `${moment.utc(moment(this.state.user.dob)).format("MMM DD, Y")} (${moment().diff(moment.utc(moment(this.state.user.dob)), "years")} years)`
          },
          { label: "gender", text: this.state.user.gender },
          { label: "country", text: this.state.user.address.country },
          { label: "phone", text: this.state.user.phone },
          { label: "role", text: this.state.user.isStaff ? this.state.user.role : "no role" }
        ]} />
      )
    }

    return (
      <LoadingText options={{
        class: "profile__about_loading",
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
          { color: "rgba(51,51,51,0.2)", width: "80%" }
        ]
      }} />
    );
  }

  renderEducation = () => {
    if (this.state.user) {
      if (!this.state.user.isStudent)
        return <p className="type__medium type__center type__margin_top type__uppercase type__caption" style={{ width: "100%" }}>you are not a student</p>
      
      if (this.state.student) {
        return (
          <AnnotatedList data={[
            { label: "high school", text: this.state.student.highSchool },
            { label: "university", text: this.state.student.university },
            { label: "major", text: this.state.student.major },
            { label: "minor", text: this.state.student.minor || "none" },
            { label: "enrolled", text: this.state.student.enrollmentYear },
            { label: "expected graduation", text: this.state.student.graduationYear }
          ]} />
        )
      }

      if (this.props.student.hasFailed) {
        return <p className="type__medium type__center type__margin_top type__uppercase type__caption" style={{ width: "100%" }}>no student data found</p>
      }
    }

    return (
      <LoadingText options={{
        class: "profile__about_loading",
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
          { color: "rgba(51,51,51,0.2)", width: "80%" }
        ]
      }} />
    )
  }

  renderBio = () => {
    if (this.state.user) {
      if (!this.state.user.isStudent)
        return <p className="type__medium type__center type__margin_top type__uppercase type__caption" style={{ width: "100%" }}>account type does not support bio</p>

      if (this.state.student) {
        return (
          <WYSIWYGEditor saveButton
            content={this.state.student.bio}
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
        )
      }

      return (
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
      )
    }
    
    return <Loader width="64px" />
  }

  renderPersonalForm = () => {
    return (
      <Form doSubmit={this.handleProfileSave}>
        <h4>Edit Personal Information</h4>
        <p>Make changes to your personal information here</p>
        <FlexContainer>
          <span>
            <Input inputName="name.first"
              inputDefault={this.state.user.name.first}
              inputPlaceholder="John"
              whenBlur={this.handleInputBlur} />
            <p className="create_user__input_label required">First Name</p>
          </span>
          <span>
            <Input inputName="name.middle"
              inputDefault={this.state.user.name.middle}
              inputPlaceholder="James"
              whenBlur={this.handleInputBlur} />
            <p className="create_user__input_label">Middle Name (optional)</p>
          </span>
          <span>
            <Input inputName="name.last"
              inputDefault={this.state.user.name.last}
              inputPlaceholder="Doe"
              whenBlur={this.handleInputBlur} />
            <p className="create_user__input_label required">Last Name</p>
          </span>
        </FlexContainer>
        <div className="inline_container">
          <p className="create_user__input_label required inline">Gender</p>
          <RadioList
            reset={this.state.resetRadios} 
            radios={[
              { label: "Female", value: "female" },
              { label: "Male", value: "male" }
            ]}
            checked={this.state.user.gender}
            onRadioChange={this.handleGenderSelect} />
        </div>
        <FlexContainer>
          <span>
              <Input inputName="dob" inputType="date"
              inputPlaceholder="Date of Birth"
              inputDefault={moment.utc(moment(this.state.user.dob)).format("YYYY-MM-DD")}
              whenBlur={this.handleInputBlur} />
            <p className="create_user__input_label required">Date of Birth</p>
          </span>
        </FlexContainer>
        <FlexContainer>
          <span>
            <Input inputName="country"
              inputDefault={this.state.user.address.country}
              inputPlaceholder="Jamaica"
              whenBlur={this.handleInputBlur} />
            <p className="create_user__input_label required">Country</p>
          </span>
        </FlexContainer>
        <FlexContainer>
          <span>
            <Input inputName="phone" inputType="phone"
              inputDefault={this.state.user.phone}
              inputPlaceholder="999 999 9999"
              whenBlur={this.handleInputBlur} />
            <p className="create_user__input_label">Phone Number</p>
          </span>
        </FlexContainer>
        {
          this.state.hasInlineNotification && !this.state.inlineNotificationClosed ?
            <InlineNotification doClose={this.closeInlineNotification}
              text={this.state.inlineNotification} /> : null
        }
        <Button solid
          doClick={() => this.setState({ editingPersonal: false })}
          styles={{
            backgroundColor: "#aaa"
          }}
          text="cancel" />
        <Button solid type="submit"
          styles={{
            margin: "0 1em",
          }}
          text="save" />
        {
          this.props.user.isUpdating ?
            <Loader width="32px"
              styles={{
                display: "inline-block",
                verticalAlign: "middle"
              }} /> : null
        }
      </Form>
    )
  }

  renderEducationForm = () => {
    return (
      <Form doSubmit={this.handleEducationSave}>
        <h4>Edit Education Information</h4>
        <p>Make changes to your education information here</p>
        <FlexContainer>
          <span>
            <Input inputName="highSchool"
              inputDefault={this.state.student.highSchool}
              whenBlur={this.handleInputBlur} />
            <p className="create_user__input_label required">High School</p>
          </span>
          <span>
            <Input inputName="university"
              inputDefault={this.state.student.university}
              whenBlur={this.handleInputBlur} />
            <p className="create_user__input_label required">University</p>
          </span>
        </FlexContainer>
        <FlexContainer>
          <span>
            <Input inputName="major"
              inputDefault={this.state.student.major}
              whenBlur={this.handleInputBlur} />
            <p className="create_user__input_label required">Major</p>
          </span>
          <span>
            <Input inputName="minor"
              inputDefault={this.state.student.minor}
              whenBlur={this.handleInputBlur} />
            <p className="create_user__input_label">Minor</p>
          </span>
        </FlexContainer>
        <FlexContainer>
          <span>
            <Input inputName="enrollmentYear"
              inputType="number"
              inputDefault={this.state.student.enrollmentYear}
              whenBlur={this.handleInputBlur} />
            <p className="create_user__input_label required">Enrollment Year</p>
          </span>
          <span>
            <Input inputName="graduationYear"
              inputType="number"
              inputDefault={this.state.student.graduationYear}
              whenBlur={this.handleInputBlur} />
            <p className="create_user__input_label required">Expected Graduation</p>
          </span>
        </FlexContainer>
        {
          this.state.hasInlineNotification && !this.state.inlineNotificationClosed ?
            <InlineNotification doClose={this.closeInlineNotification}
              text={this.state.inlineNotification} /> : null
        }
        <Button solid
          doClick={() => this.setState({ editingEducation: false })}
          styles={{
            backgroundColor: "#aaa"
          }}
          text="cancel" />
        <Button solid type="submit"
          styles={{
            margin: "0 1em",
          }}
          text="save" />
        {
          this.props.student.isUpdating ?
            <Loader width="32px"
              styles={{
                display: "inline-block",
                verticalAlign: "middle"
              }} /> : null
        }
      </Form>
    )
  }

  renderInlineNotification = message => {
    this.setState({
      hasInlineNotification: true,
      inlineNotificationClosed: false,
      inlineNotification: message
    });
  }

  closeInlineNotification = () => {
    this.setState({
      hasInlineNotification: false,
      inlineNotificationClosed: true,
      inlineNotification: null
    });
  }

  handleSettingsButtonClick = () => {
    this.props.history.push(routes.PROFILE_SETTINGS.route);
  }

  handleProfilePictureChange = e => {
    this.props.userProfilePictureActions.doAvatarUpload(e);
  }

  handleProfileSave = e => {
    e.preventDefault();

    const { updatedInfo } = this.state;

    if (Object.keys(updatedInfo).length) {
      if (updatedInfo.name) {
        let { name } = this.state.student.user;
        const { first, last } = updatedInfo.name;

        if (first === "") {
          return this.renderInlineNotification("first name is required");
        }

        if (last === "") {
          return this.renderInlineNotification("last name is required");
        }

        if (first && last) {
          updatedInfo.name.full = `${first} ${last}`;
        } else if (first) {
          updatedInfo.name.full = `${first} ${name.last}`;
          updatedInfo.name.last = last;
        } else if (last) {
          updatedInfo.name.full = `${name.first} ${last}`;
          updatedInfo.name.first = first;
        }
      }

      if (updatedInfo.dob === "")
        return this.renderInlineNotification("dob is required");

      if (updatedInfo.address && !updatedInfo.address.country)
        return this.renderInlineNotification("country is required");

      this.setState({ updatedInfo });

      return this.props.userActions.doUserUpdate(updatedInfo);
    }

    this.renderInlineNotification("you have not made any changes");
  }

  handleEducationSave = e => {
    e.preventDefault();

    const { updatedInfo } = this.state;

    if (Object.keys(updatedInfo).length) {
      const { 
        highSchool,
        university,
        major,
        enrollmentYear,
        graduationYear 
      } = updatedInfo;

      if (highSchool === "")
        return this.renderInlineNotification("high school is required");

      if (university === "")
        return this.renderInlineNotification("university is required");

      if (major === "")
        return this.renderInlineNotification("major is required");

      if (enrollmentYear === "")
        return this.renderInlineNotification("enrollment year is required");

      if (graduationYear === "")
        return this.renderInlineNotification("graduation year is required");

      return this.props.studentActions.doStudentUpdate(this.state.student.uid, updatedInfo);
    }

    this.renderInlineNotification("you have not made any changes");
  }

  handleBioSave = content => {
    if (_.isEqual(content, this.state.student.bio)) {
      return this.setState({
        hasNotification: true,
        notificationClosed: false,
        notification: "no changes made"
      });
    }

    this.props.studentActions.doStudentUpdate(this.state.student.uid, {
      bio: content
    });
  }

  handleInputBlur = e => {
    const { name, value } = e;

    switch (name) {
      case "name.first":
        this.setState({
          updatedInfo: Object.assign({}, this.state.updatedInfo, {
            name: Object.assign({}, this.state.updatedInfo.name, { first: value })
          })
        });
        break;
      case "name.middle":
        this.setState({
          updatedInfo: Object.assign({}, this.state.updatedInfo, {
            name: Object.assign({}, this.state.updatedInfo.name, { middle: value })
          })
        });
        break;
      case "name.last":
        this.setState({
          updatedInfo: Object.assign({}, this.state.updatedInfo, {
            name: Object.assign({}, this.state.updatedInfo.name, { last: value })
          })
        });
        break;
      case "dob":
        this.setState({
          updatedInfo: Object.assign({}, this.state.updatedInfo, {
            dob: new Date(value).getTime()
          })
        });
        break;
      case "country":
        this.setState({
          updatedInfo: Object.assign({}, this.state.updatedInfo, {
            address: { country: value }
          })
        });
        break;
      default:
        this.setState({ 
          updatedInfo: Object.assign({}, this.state.updatedInfo, {
            [name]: value
          }) 
        });
    }
  }

  handleGenderSelect = gender => {
    this.setState({ 
      updatedInfo: Object.assign({}, this.state.updatedInfo, {
        gender
      }) 
    });
  }
}

Profile.propTypes = {
  userProfilePictureActions: propTypes.object,
  profilePicture: propTypes.object,
  user: propTypes.object,
  userActions: propTypes.object,
  updateLocation: propTypes.func,
  student: propTypes.object,
  studentActions: propTypes.object,
  history: propTypes.object
};

const mapStateToProps = state => {
  return {
    profilePicture: state.userProfilePicture,
    user: state.user,
    student: state.student
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userProfilePictureActions: bindActionCreators(userProfilePictureActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
    studentActions: bindActionCreators(studentActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);