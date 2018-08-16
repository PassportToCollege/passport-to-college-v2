import "./Education.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import _ from "lodash";

import PageMeta from "../../../components/PageMeta";
import Notification from "../../../components/Notification";
import Button from "../../../components/Button";
import AnnotatedList from "../../../components/AnnotatedList";

class StudentEducation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      student: props.student.student,
      hasNotification: false,
      notificationClosed: false,
      notification: null
    };
  }

  static propTypes = {
    student: propTypes.object,
    studentActions: propTypes.object
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.student.hasGotten &&
    !_.isEqual(prevState.student, nextProps.student.student)) {
      return {
        student: nextProps.student.student
      };
    }

    return null;
  }

  getSnapshotBeforeUpdate(props) {
    if (props.student.isUpdating && this.props.student.hasUpdated)
      return { updatedEducation: true };

    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot && snapshot.updatedEducation) {
      this.setState({
        hasNotification: true,
        notificationClosed: false,
        notification: "information updated successfully"
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        {
          this.state.hasNotification && !this.state.notificationClosed ?
            <Notification text={this.state.notification} 
              doClose={() => {
                this.setState({
                  hasNotification: false,
                  notificationClosed: true,
                  notification: null
                })
              }} /> : null
        }
        {
          this.state.student ?
            <PageMeta>
              <title>Education | {this.state.student.user.name.full} | Student Dashboard | Passport to College</title>
            </PageMeta> :
            <PageMeta route="STUDENT_DASHBOARD" />
        }
        <section className="student_dashboard__container student_dashboard__education">
          <span>
            <Button text="edit" solid
              doClick={() => this.setState({ editing: true })} />
          </span>
          {
            this.state.student ?
              <AnnotatedList data={[
                { label: "high school", text: this.state.student.highSchool },
                { label: "university", text: this.state.student.university },
                { label: "major", text: this.state.student.major },
                { label: "minor", text: this.state.student.minor || "none" },
                { label: "enrolled", text: this.state.student.enrollmentYear },
                { label: "expected graduation", text: this.state.student.graduationYear }
              ]} /> : null
            }
        </section>
      </React.Fragment>
    )
  }
}

export default StudentEducation;