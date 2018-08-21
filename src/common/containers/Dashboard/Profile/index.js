import "./Profile.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import moment from "moment";

import * as userProfilePictureActions from "../../../actions/userProfilePictureActions";
import * as userActions from "../../../actions/userActions";
import * as studentActions from "../../../actions/studentActions";

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

import { auth } from "../../../utils/firebase";

const defAvatar = require("../../../assets/images/default-gravatar.png");

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profilePicture: props.profilePicture.url,
      user: props.user.user,
      editingHeaderInfo: false,
      editingAbout: false,
      editingRoles: false,
      emailChanged: false
    };
  }

  componentDidMount() {
    // get user avatar
    this.props.userProfilePictureActions.doAvatarGet();

    // get user data
    this.props.userActions.doUserGet();
  }

  static getDerivedStateFromProps(nextProps) {
    let newState = null;

    if (nextProps.profilePicture.url && nextProps.profilePicture.url !== "") {
      newState = {};
      newState.profilePicture = nextProps.profilePicture.url;
    }

    if (nextProps.profilePicture.url === "") {
      newState = newState || {};
      newState.profilePicture = defAvatar;
    }

    if (nextProps.user.hasGotten) {
      newState = newState || {};
      newState.user = nextProps.user.user;
    }

    return newState;
  }

  render() {
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
          this.state.editing ?
            <Modal classes={["modal__student_edit_profile"]}
              doClose={() => this.setState({ editing: false })}>
              {this.renderForm()}
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
          </div>
        </div>
      </React.Fragment>
    )
  }

  createHeaderInfo = () => {
    if (!this.props.user.hasGotten) {
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
    } else if (this.props.user.hasGotten) {
      let user = this.state.user;

      return (
        <span>
          <h3 className="profile__name">{user.name.full}</h3>
          <p className="type__caption">{user.email}</p>
          <span>
            <Button text="edit" solid
              doClick={() => this.setState({ editing: true })} />
            <Button text="settings" solid
              doClick={this.handleSettingsButtonClick} />
          </span>
        </span>
      );
    }
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

  renderForm = () => {
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
          doClick={() => this.setState({ editing: false })}
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

  handleProfilePictureChange = e => {
    this.props.userProfilePictureActions.doAvatarUpload(e);
  }

  handleNameEmailUpdate = () => {
    this.setState({ editingHeaderInfo: false });

    this.props.userActions.doUserUpdate({
      name: {
        first: this.nameInput.value.split(" ")[0],
        last: this.nameInput.value.split(" ").slice(1, 10).join(" "),
        full: this.nameInput.value
      },
      email: this.emailInput.value,
      password: this.state.emailChanged ? this.passwordInput.value : null
    });
  }

  handleEmailInputChange = (e) => {
    if(
      e.target.value !== this.state.user.email ||
      e.target.value !== auth.currentUser.email
    ) {
      this.setState({ emailChanged: true });
    } else {
      this.setState({ emailChanged: false });
    }
  }
}

Profile.propTypes = {
  userProfilePictureActions: propTypes.object,
  profilePicture: propTypes.object,
  user: propTypes.object,
  userActions: propTypes.object,
  updateLocation: propTypes.func,
  student: propTypes.object,
  studentActions: propTypes.object
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