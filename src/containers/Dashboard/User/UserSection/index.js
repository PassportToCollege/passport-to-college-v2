import "./UserSection.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as studentActions from "../../../../actions/studentActions";
import * as userProfilePictureActions from "../../../../actions/userProfilePictureActions";

import AnnotatedList from "../../../../components/AnnotatedList";
import LoadingText from "../../../../components/LoadingText";
import InitialsAvatar from "../../../../components/InitialsAvatar";
import DropUploader from "../../../../components/DropUploader";
import Loader from "../../../../components/Loader";

class UserSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: props.userId,
      section: props.section,
      user: props.user.user,
      student: props.student.student,
      profilePicture: props.picture.picture
    }
  }

  componentWillMount() {
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
    }

    if (nextProps.picture.hasGottenByUid)
      this.setState({ profilePicture: nextProps.picture.picture });

    if (nextProps.student.hasGotten)
      this.setState({ student: nextProps.student.student });
  }

  render() {
    return this._render(this.props.section);
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

  updateProfilePicture = e => {
    let newProfilePicture = e.files[0];
    this.props.uppActions.doAvatarUpload(newProfilePicture, { uid: this.state.uid });
  }
}

UserSection.propTypes = {
  section: propTypes.string,
  userId: propTypes.string,
  user: propTypes.object,
  student: propTypes.object,
  studentActions: propTypes.object,
  picture: propTypes.object,
  uppActions: propTypes.object
};

const mapStateToProps = state => {
  return {
    student: state.student,
    picture: state.userProfilePicture
  };
};

const mapDispatchToProps = dispatch => {
  return {
    studentActions: bindActionCreators(studentActions, dispatch),
    uppActions: bindActionCreators(userProfilePictureActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserSection);