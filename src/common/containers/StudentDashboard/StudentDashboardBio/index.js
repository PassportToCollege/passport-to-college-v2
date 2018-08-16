import "./Bio.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import _ from "lodash";

import WYSIWYGEditor from "../../../components/Editor";
import Notification from "../../../components/Notification";

class StudentBio extends Component {
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
      return { updatedBio: true };

    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot && snapshot.updatedBio) {
      this.setState({
        hasNotification: true,
        notificationClosed: false,
        notification: "bio updated successfully"
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
        <section className="student_dashboard__container student_dashboard__bio">
          {
            this.state.student ?
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
      </React.Fragment>
    )
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
}

export default StudentBio;