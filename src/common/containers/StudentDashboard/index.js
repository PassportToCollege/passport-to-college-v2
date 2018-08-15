import "./StudentDashboard.css";

import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";
import _ from "lodash";
import moment from "moment";

import * as studentActions from "../../actions/studentActions";
import * as userProfilePictureActions from "../../actions/userProfilePictureActions";
import * as userActions from "../../actions/userActions";
import { activeUser } from "../../utils";
import { auth } from "../../utils/firebase";
import * as routes from "../../constants/routes";

import NavigationDashboard from "../NavigationDashboard";
import PageMeta from "../../components/PageMeta";
import FlexContainer from "../../components/FlexContainer";
import ImageUploader from "../../components/ImageUploader";
import Button from "../../components/Button";
import InfoStrip from "../../components/InfoStrip";
import Modal from "../../components/Modal";
import Form from "../../components/Form";
import RadioList from "../../components/RadioList";
import Input from "../../components/Input";
import Loader from "../../components/Loader";
import { InlineNotification } from "../../components/Notification";

import Bio from "./StudentDashboardBio";

import defAvatar from "../../assets/images/default-gravatar.png";
import AnnotatedList from "../../components/AnnotatedList";

class StudentDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      student: props.student.student,
      picture: defAvatar,
      editing: false,
      updatedInfo: {},
      isProfile: true
    }
  }

  static propTypes = {
    student: propTypes.object,
    studentActions: propTypes.object,
    updateLocation: propTypes.func,
    match: propTypes.object,
    location: propTypes.object,
    menu: propTypes.object,
    menuActions: propTypes.object,
    userPPActions: propTypes.object,
    profilePicture: propTypes.object,
    user: propTypes.object,
    userActions: propTypes.object
  }

  componentDidMount() {
    this.props.updateLocation("dashboard student");
    this.props.studentActions.doStudentGet(activeUser());
    this.setAtProfile();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.student.hasGotten &&
    !_.isEqual(state.student, props.student.student)) {
      return {
        student: props.student.student
      };
    }

    if (props.profilePicture.hasGotten) {
      return {
        picture: props.profilePicture.url
      }
    }

    return null;
  }

  getSnapshotBeforeUpdate(props) {
    if (props.user.isUpdating && this.props.user.hasUpdated) {
      return { updatedUser: true };
    }

    if (props.user.isUpdating && this.props.user.hasFailed) {
      return { updateFailed: true };
    }

    if (props.location.pathname !== this.props.location.pathname) {
      return { locationChanged: true }
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot) {
      if (snapshot.updatedUser) {
        this.setState({
          editing: false,
          student: Object.assign({}, this.state.student, {
            user: Object.assign(this.state.student.user, this.state.updatedInfo)
          })
        })
      }

      if (snapshot.updateFailed) {
        this.setState({
          hasInlineNotification: true,
          inlineNotificationClosed: false,
          inlineNotification: this.props.user.error.message
        });
      }

      if (snapshot.locationChanged)
        this.setAtProfile();
    }
  }

  render() {
    return (
      <div className="student_dashboard" data-menu-state={this.props.menu.dash}>
        {
          this.state.student ?
            <PageMeta>
              <title>{this.state.student.user.name.full} | Student Dashboard | Passport to College</title>
            </PageMeta> :
            <PageMeta route="STUDENT_DASHBOARD" />
        }
        <NavigationDashboard student />
        <main>
          <header data-at-profile={this.state.isProfile}></header>
          <Route exact path={this.props.match.url}
            render={() => {
              return this.renderProfile()
            }} />
          <Route exact path={routes.STUDENT_DASHBOARD_BIO.route}
            render={props => {
              return <Bio {...props} student={this.props.student} />
            }} />
        </main>
      </div>
    )
  }

  renderProfile() {
    return (
      <React.Fragment>
        {
          this.state.editing ?
            <Modal classes={["modal__student_edit_profile"]}
              doClose={() => this.setState({ editing: false })}>
              <Form doSubmit={this.handleProfileSave}>
                <h4>Edit Personal Information</h4>
                <p>Make changes to your personal information here</p>
                <FlexContainer>
                  <span>
                    <Input inputName="name.first"
                      inputDefault={this.state.student.user.name.first}
                      inputPlaceholder="John"
                      whenBlur={this.handleInputBlur} />
                    <p className="create_user__input_label required">First Name</p>
                  </span>
                  <span>
                    <Input inputName="name.middle"
                      inputDefault={this.state.student.user.name.middle}
                      inputPlaceholder="James"
                      whenBlur={this.handleInputBlur} />
                    <p className="create_user__input_label">Middle Name (optional)</p>
                  </span>
                  <span>
                    <Input inputName="name.last"
                      inputDefault={this.state.student.user.name.last}
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
                    checked={this.state.student.user.gender}
                    onRadioChange={this.handleGenderSelect} />
                </div>
                <FlexContainer>
                  <span>
                     <Input inputName="dob" inputType="date"
                      inputPlaceholder="Date of Birth"
                      inputDefault={moment.utc(moment(this.state.student.user.dob)).format("YYYY-MM-DD")}
                      whenBlur={this.handleInputBlur} />
                    <p className="create_user__input_label required">Date of Birth</p>
                  </span>
                </FlexContainer>
                <FlexContainer>
                  <span>
                    <Input inputName="country"
                      inputDefault={this.state.student.user.address.country}
                      inputPlaceholder="Jamaica"
                      whenBlur={this.handleInputBlur} />
                    <p className="create_user__input_label required">Country</p>
                  </span>
                </FlexContainer>
                <FlexContainer>
                  <span>
                    <Input inputName="phone" inputType="phone"
                      inputDefault={this.state.student.user.phone}
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
            </Modal> : null
        }
        <FlexContainer classes={["student_dashboard__container", "student_dashboard__profile"]}>
          <section>
            <ImageUploader default={this.state.picture}
              onUpload={this.handleProfilePictureChange} />
            <Button solid text="edit"
              doClick={() => this.setState({ editing: true })} />
          </section>
          <section>
            {
              this.state.student ?
                <AnnotatedList data={[
                  { label: "name", text: this.state.student.user.name.full },
                  {
                    label: "born",
                    text: `${moment.utc(moment(this.state.student.user.dob)).format("MMM DD, Y")} (${moment().diff(moment.utc(moment(this.state.student.user.dob)), "years")} years)`
                  },
                  { label: "gender", text: this.state.student.user.gender },
                  { label: "country", text: this.state.student.user.address.country },
                  { label: "phone", text: this.state.student.user.phone },
                  { label: "role", text: this.state.student.user.isStaff ? this.state.student.user.role : "no role" }
                ]} /> : null
            }
            <InfoStrip stripStyles={{
              padding: "2em 1em",
              backgroundColor: "#FF443F",
              fontSize: "12px",
              fontFamily: "inherit",
              textAlign: "left"
            }} >
              <p className="student_dashboard__meta_item">LAST SIGNED IN: {auth.currentUser ? auth.currentUser.metadata.lastSignInTime : null}</p>
            </InfoStrip>
          </section>
        </FlexContainer>
      </React.Fragment>
    )
  }

  setAtProfile = () => {
    let { pathname } = this.props.location;
    const path = pathname.split("/").slice(-1)[0];

    this.setState({ isProfile: path === "dashboard" });
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

  handleProfilePictureChange = newImage => {
    this.props.userPPActions.doAvatarUpload(newImage);
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
}

const mapStateToProps = state => {
  return {
    student: state.student,
    menu: state.menu,
    profilePicture: state.userProfilePicture,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    studentActions: bindActionCreators(studentActions, dispatch),
    userPPActions: bindActionCreators(userProfilePictureActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentDashboard);