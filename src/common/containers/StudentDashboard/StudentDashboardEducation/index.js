import "./Education.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import _ from "lodash";

import PageMeta from "../../../components/PageMeta";
import Notification, { InlineNotification } from "../../../components/Notification";
import Button from "../../../components/Button";
import AnnotatedList from "../../../components/AnnotatedList";
import Modal from "../../../components/Modal";
import Form from "../../../components/Form";
import FlexContainer from "../../../components/FlexContainer";
import Input from "../../../components/Input";
import Loader from "../../../components/Loader";

class StudentEducation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      student: props.student.student,
      hasNotification: false,
      notificationClosed: false,
      notification: null,
      updatedInfo: {}
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
        {
          this.state.editing ?
            <Modal classes={["modal__student_edit_education", "modal__student_edit_profile"]}
              doClose={() => this.setState({ editing: false })}>
              {this.renderForm()}
            </Modal> : null
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

  renderForm = () => {
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

  handleInputBlur = e => {
    const { name, value } = e;

    this.setState({
      updatedInfo: Object.assign({}, this.state.updatedInfo, {
        [name]: value
      })
    });
  }
}

export default StudentEducation;