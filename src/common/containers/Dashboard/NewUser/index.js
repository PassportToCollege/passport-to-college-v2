import "./NewUser.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import { uid } from "rand-token";
import propTypes from "prop-types";

import * as usersActions from "../../../actions/usersActions";
import * as studentActions from "../../../actions/studentActions";
import { USERS } from "../../../constants/routes";
import { DefaultUser, Student } from "../../../utils";

import ToTopContainer from "../../../components/ToTopContainer";
import FlexContainer from "../../../components/FlexContainer";
import PageMeta from "../../../components/PageMeta";
import Button from "../../../components/Button";
import Form from "../../../components/Form";
import Input from "../../../components/Input";
import Checkbox from  "../../../components/Checkbox";
import RadioList from "../../../components/RadioList";
import WYSIWYGEditor from "../../../components/Editor";
import Notification from "../../../components/Notification";
import Loader from "../../../components/Loader";

class NewUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: new DefaultUser({ uid: `${uid(24)}_ac_less` }).data,
      notificationClosed: true,
      hasNotification: false,
      notification: ""
    }
  }

  static propTypes = {
    users: propTypes.object,
    usersActions: propTypes.object,
    history: propTypes.object,
    student: propTypes.object,
    studentActions: propTypes.object
  }

  static getDerivedStateFromProps(props, state) {
    if (props.users.hasFailed && state.notificationClosed) {
      return {
        notificationClosed: false,
        hasNotification: true,
        notification: props.users.error.message
      }
    }

    return null;
  }

  render() {
    return (
      <ToTopContainer classes="dashboard__container create_user__container">
        {
          !this.state.notificationClosed && this.state.hasNotification && this.state.notification.length ?
            <Notification text={this.state.notification}
              doClose={() => this.setState({
                hasNotification: false,
                notificationClosed: true,
                notification: ""
              })} /> : null
        }
        <PageMeta more={
          <title>New User | Dashboard | Passport to College</title>
        } />
        <header>
          <h1>Create New User</h1>
          <span>Use this form to create a full, accountless new user. You will have the options to add a user profile picture and send a create account email after you create the user.</span>
          <Button type="button" solid
            text="Back to Users"
            doClick={() => this.props.history.push(USERS.route)}
            styles={{
              position: "absolute",
              right: "0",
              top: "1em",
              backgroundColor: "#FFCB61"
            }} />
        </header>
        <main className="create_user__content">
          <Form doSubmit={this.handleUserSave}>
            <section className="create_user__section">
              <h2>Roles</h2>
              <Checkbox boxName="isAdmin"
                boxLabel="Admin"
                boxChecked={this.state.user.isAdmin}
                doClick={this.handleRolesCheckboxChange} />
              <Checkbox boxName="isStudent"
                boxLabel="Student"
                boxChecked={this.state.user.isStudent}
                doClick={this.handleRolesCheckboxChange} />
              <Checkbox boxName="isStaff"
                boxLabel="Staff"
                boxChecked={this.state.user.isStaff}
                doClick={this.handleRolesCheckboxChange} />
            </section>
            <section className="create_user__section">
              <h2>Personal Information</h2>
              <div className="inline_container">
                <p className="create_user__input_label required inline">Gender</p>
                <RadioList 
                  radios={[
                    { label: "Female", value: "female" },
                    { label: "Male", value: "male" }
                  ]}
                  onRadioChange={this.handleGenderSelect} />
              </div>
              <FlexContainer>
                <span>
                  <Input inputName="name.first"
                    inputPlaceholder="John"
                    whenBlur={this.handleInputBlur} />
                  <p className="create_user__input_label required">First Name</p>
                </span>
                <span>
                  <Input inputName="name.middle"
                    inputPlaceholder="James"
                    whenBlur={this.handleInputBlur} />
                  <p className="create_user__input_label">Middle Name (optional)</p>
                </span>
                <span>
                  <Input inputName="name.last"
                    inputPlaceholder="Doe"
                    whenBlur={this.handleInputBlur} />
                  <p className="create_user__input_label required">Last Name</p>
                </span>
              </FlexContainer>
              <FlexContainer>
                <span>
                  <Input inputName="email" inputType="email"
                    inputPlaceholder="johndoe@gmail.com"
                    whenBlur={this.handleInputBlur} />
                  <p className="create_user__input_label required">Email Address</p>
                </span>
                <span>
                  <Input inputName="phone" inputType="phone"
                    inputPlaceholder="999 999 9999"
                    whenBlur={this.handleInputBlur} />
                  <p className="create_user__input_label">Phone Number (optional)</p>
                </span>
              </FlexContainer>
              <FlexContainer>
                <span>
                  <Input inputName="dob" inputType="date"
                    inputPlaceholder="Date of Birth"
                    whenBlur={this.handleInputBlur} />
                  <p className="create_user__input_label required">Date of Birth</p>
                </span>
                <span>
                  <Input inputName="country"
                    inputPlaceholder="Jamaica"
                    whenBlur={this.handleInputBlur} />
                  <p className="create_user__input_label required">Country</p>
                </span>
              </FlexContainer>
            </section>
            {
              this.state.user.isStaff ?
                <section className="create_user__section">
                  <h2>Staff Role</h2>
                  <FlexContainer>
                    <span>
                      <Input inputName="role"
                        inputPlaceholder="Interviewer"
                        whenBlur={this.handleInputBlur} />
                      <p className="create_user__input_label">Role</p>
                    </span>
                  </FlexContainer>
                </section> : null
            }
            {
              this.state.user.isStudent ?
                <section className="create_user__section">
                  <h2>Student Information</h2>
                  <FlexContainer>
                    <span>
                      <Input inputName="highSchool"
                        inputPlaceholder="Lorem High School"
                        whenBlur={this.handleInputBlurStudent} />
                      <p className="create_user__input_label">High School (optional)</p>
                    </span>
                    <span>
                      <Input inputName="university"
                        inputPlaceholder="Ipsum College"
                        whenBlur={this.handleInputBlurStudent} />
                      <p className="create_user__input_label required">University</p>
                    </span>
                  </FlexContainer>
                  <FlexContainer>
                    <span>
                      <Input inputName="major"
                        inputPlaceholder="Biology"
                        whenBlur={this.handleInputBlurStudent} />
                      <p className="create_user__input_label required">Major</p>
                    </span>
                    <span>
                      <Input inputName="minor"
                        inputPlaceholder="Chemistry"
                        whenBlur={this.handleInputBlurStudent} />
                      <p className="create_user__input_label">Minor (optional)</p>
                    </span>
                  </FlexContainer>
                  <FlexContainer>
                    <span>
                      <Input inputName="enrollmentYear"
                        inputPlaceholder="2011"
                        whenBlur={this.handleInputBlurStudent} />
                      <p className="create_user__input_label required">Enrollment Year</p>
                    </span>
                    <span>
                      <Input inputName="graduationYear"
                        inputPlaceholder="2015"
                        whenBlur={this.handleInputBlurStudent} />
                      <p className="create_user__input_label required">Graduation Year</p>
                    </span>
                  </FlexContainer>
                  <p className="create_user__input_label required heading">About Student</p>
                  <WYSIWYGEditor
                    captureBlur={this.handleBioBlur} 
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
                </section> : null
            }
            <Button solid 
              doClick={this.handleUserSave}
              text="Save User" />
            {
              this.props.users.isCreating || this.props.student.creatingStudent ?
                <Loader width="32px"
                  styles={{
                    display: "inline-block",
                    marginLeft: "1em"
                  }} /> : null
            }
          </Form>
        </main>
      </ToTopContainer>
    )
  }

  handleRolesCheckboxChange = (name, value) => {
    const newUser = Object.assign({}, this.state.user, {
      [name]: value
    });

    const newStudent = newUser.isStudent ? 
      Object.assign({}, this.state.student, {
        uid: newUser.uid
      }) : this.state.student;

    this.setState({ 
      user: newUser,
      student: newStudent  
    });
  }

  handleGenderSelect = gender => {
    this.setState({ 
      user: Object.assign({}, this.state.user, { gender }) 
    });
  }

  handleInputBlur = e => {
    const { name, value } = e;

    switch (name) {
      case "name.first":
        this.setState({ 
          user: Object.assign({}, this.state.user, {
            name: Object.assign({}, this.state.user.name, { first: value })
          }) 
        });
        break;
      case "name.middle":
        this.setState({ 
          user: Object.assign({}, this.state.user, {
            name: Object.assign({}, this.state.user.name, { middle: value })
          }) 
        });
        break;
      case "name.last":
        this.setState({ 
          user: Object.assign({}, this.state.user, {
            name: Object.assign({}, this.state.user.name, { last: value })
          }) 
        });
        break;
      case "dob":
        this.setState({
          user: Object.assign({}, this.state.user, {
            dob: new Date(value).getTime()
          })
        });
        break;
      case "country":
        this.setState({
          user: Object.assign({}, this.state.user, {
            address: { country: value }
          })
        });
        break;
      default:
        this.setState({ 
          user: Object.assign({}, this.state.user, {
            [name]: value
          }) 
        });
    }
  }

  handleInputBlurStudent = e => {
    const { name, value } = e;

    this.setState({ 
      student: Object.assign({}, this.state.student, {
        [name]: value
      })  
    });
  }

  handleBioBlur = content => {
    this.setState({
      student: Object.assign({}, this.state.student, {
        bio: content
      })
    });
  }

  handleUserSave = e => {
    e.preventDefault();
    
    const user = new DefaultUser(this.state.user);
    const student = new Student(this.state.student, user.data);

    if (user.isComplete) {
      if (user.isStudent) {
        if (student.isComplete)
          return this.props.usersActions.doCreateFullUser(user.data, this.state.student);

        return this.setState({
          notificationClosed: false,
          hasNotification: true,
          notification: "required student data field(s) left empty"
        });
      }

      return this.props.usersActions.doCreateFullUser(user.data);
    }

    this.setState({
      notificationClosed: false,
      hasNotification: true,
      notification: `missing user property: ${user.missingProps[0]}`
    });
  }
}

const mapStateToProps = state => {
  return {
    users: state.users,
    student: state.student
  };
};

const mapDispatchToProps = dispatch => {
  return {
    usersActions: bindActionCreators(usersActions, dispatch),
    studentActions: bindActionCreators(studentActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewUser);