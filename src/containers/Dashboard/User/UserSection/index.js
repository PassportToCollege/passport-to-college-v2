import "./UserSection.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as studentActions from "../../../../actions/studentActions";

import AnnotatedList from "../../../../components/AnnotatedList";
import LoadingText from "../../../../components/LoadingText";
import InitialsAvatar from "../../../../components/InitialsAvatar";

class UserSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: props.userId,
      section: props.section,
      user: props.user.user,
      student: props.student.student
    }
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

    if (nextProps.student.hasGotten)
      this.setState({ student: nextProps.student.student });
  }

  render() {
    return this._render(this.props.section);
  }

  _render = section => {
    switch (section) {
      case "education":
        return (
          <section className="user__section education__section">
            {
              this.props.user.hasGottenUser && this.state.user ?
                this.state.user.isStudent ?
                  <p>is student</p> :
                  <p>not a student</p>
                :
                null
            }
          </section>
        )
      case "personal":
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
                      { label: "dob", text: this.state.user.dob ? this.state.user.dob : "no dob" },
                      { label: "gender", text: this.state.user.gender ? this.state.user.gender : "no gender provided" }
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
                        { label: "phone", text: this.state.user.phone ? this.state.user.phone : "no phone number" },
                        { label: "country", text: this.state.user.address ? this.state.user.address.country : "no country" }
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
      default:
        return (
          <p>{this.props.section}</p>
        )
    }
  }
}

UserSection.propTypes = {
  section: propTypes.string,
  userId: propTypes.string,
  user: propTypes.object,
  student: propTypes.object,
  studentActions: propTypes.object
};

const mapStateToProps = state => {
  return {
    student: state.student
  };
};

const mapDispatchToProps = dispatch => {
  return {
    studentActions: bindActionCreators(studentActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserSection);