import "./ApplicationSection.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import moment from "moment";
import axios from "axios";

import AnnotatedList from "../../../../components/AnnotatedList";
import TestList from "../../../../components/TestList";
import LoadingText from "../../../../components/LoadingText";
import WYSIWYGEditor from "../../../../components/Editor";
import ReviewBlock from "../../../../components/ReviewBlock";
import Button from "../../../../components/Button";
import Notification from "../../../../components/Notification";

const EMAIL_API = process.env.REACT_APP_EMAIL_API;

class ApplicationSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      applicationId: props.applicationId,
      section: props.section,
      application: props.application.application,
      hasError: false,
      notificationClosed: true,
      error: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.section)
      this.setState({ section: nextProps.section });

    if (nextProps.application.hasGotten)
      this.setState({ application: nextProps.application.application });
  }

  render() {
    return this._render(this.props.section);
  }

  _render = section => {    
    switch (section) {
      case "tests":
        return (
          <section className="application__section tests__section">
            <div className="application__section_left">
              <div className="application__us_tests">
                <h2>U.S. Standardized Tests</h2>
                {
                  this.props.application.hasGotten && this.state.application ?
                    <AnnotatedList data={[
                      { label: "test taken", text: this.state.application.usTest },
                      { label: "score", text: this.state.application.score }
                    ]} />
                    :
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
            <div className="application__section_right">
              <div className="application__us_tests">
                <h2>National Tests</h2>
                {
                  this.props.application.hasGotten && this.state.application ?
                    this.renderTestList()
                    :
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
      case "essay":
        return (
          <section className="application__section essay__section">
            <div className="application__essay">
              <ReviewBlock renderFromFunc
                renderFunc={this.renderReadOnlyEssay}
                canEdit={false} />
            </div>
          </section>
        )
      case "decide":
        return (
          <section className="application__section decide__section">
            {
              this.state.hasError && !this.state.notificationClosed ?
                <Notification doClose={() => this.setState({
                    hasError: false,
                    notificationClosed: true,
                    error: ""
                  })}
                  text={this.state.error} /> :
                null

            }
            <div className="application__section_left">
              <div className="application__decide_accept">
                <h2>Accept</h2>
                <p>This student has met the financial, academic, and character requirements of a Passport to College scholar. Therefore, we will move forward and work with this student.</p>
                {
                  this.props.application.hasGotten && this.state.application
                  && this.state.application.state.accepted ?
                    <p style={{
                        fontWeight: "bold"
                      }}>
                      {`This application was accepted on ${moment(this.state.application.acceptedOn).format("MM-DD-Y")}`}
                    </p> :
                      this.props.application.hasGotten && this.state.application
                      && this.state.application.state.rejected ?
                        <p style={{
                            fontWeight: "bold"
                          }}>
                          {`This application was rejected on ${moment(this.state.application.rejectedOn).format("MM-DD-Y")}`}
                        </p> :
                      <Button solid text="notify student" type="button"
                        doClick={this.sendAcceptanceEmail} />
                }
              </div>
            </div>
            <div className="application__section_right">
              <div className="application__decide_reject">
                <h2>Reject</h2>
                <p>This student has not met the financial, academic, and/or character requirements of a Passport to College scholar. Therefore, we will not move forward and work with this student.</p>
                {
                  this.props.application.hasGotten && this.state.application
                  && this.state.application.state.rejected ?
                    <p style={{
                        fontWeight: "bold"
                      }}>
                      {`This application was rejected on ${moment(this.state.application.rejectedOn).format("MM-DD-Y")}`}
                    </p> :
                      this.props.application.hasGotten && this.state.application
                      && this.state.application.state.accepted ?
                      <p style={{
                          fontWeight: "bold"
                        }}>
                        {`This application was accepted on ${moment(this.state.application.acceptedOn).format("MM-DD-Y")}`}
                      </p> :
                      <span>
                        <div className="application__rejection_note">
                          <label>Include rejection message (optional)</label>
                          <textarea rows="4" ref={textarea => this.rejectText = textarea}></textarea>
                        </div>
                        <Button text="notify student" type="button"
                          doClick={this.sendRejectionEmail} />
                      </span>
                }
              </div>
            </div>
          </section>
        )
      case "information":
      default:
        return (
          <section className="application__section information__section">
            <div className="application__section_left">
              <div className="application__personal">
                <h2>Personal information</h2>
                {
                  this.props.application.hasGotten && this.state.application ?
                    <AnnotatedList data={[
                      { label: "full name", text: this.state.application.user.name.full },
                      { label: "dob", text: moment(this.state.application.user.dob).format("MM-DD-Y") },
                      { label: "email", text: this.state.application.user.email },
                      { label: "phone", text: this.state.application.user.phone },
                      { label: "gender", text: this.state.application.user.gender },
                      { label: "country", text: this.state.application.user.address.country }
                    ]} />
                  :
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
              <div className="application__personal">
                <h2>Education information</h2>
                {
                  this.props.application.hasGotten && this.state.application ?
                    <AnnotatedList data={[
                      { label: "highest education level", text: this.state.application.educationLevel },
                      { label: "last school", text: this.state.application.lastSchool },
                      { label: "gpa", text: this.state.application.gpa }
                    ]} />
                    :
                    <LoadingText options={{
                      class: "block__lines",
                      bg: "transparent",
                      height: "10px",
                      lines: [
                        { color: "rgba(255,101,97,0.2)", width: "80%" },
                        { color: "rgba(255,101,97,0.4)", width: "70%" },
                        { color: "rgba(255,101,97,0.2)", width: "80%" },
                        { color: "rgba(255,101,97,0.4)", width: "90%" },
                        { color: "rgba(255,101,97,0.4)", width: "70%" }
                      ]
                    }} />
                }
              </div>
            </div>
            <div className="application__section_right">
              <div className="application__misc">
                <h2>Miscellaneous</h2>
                {
                  this.props.application.hasGotten && this.state.application ?
                    <AnnotatedList data={[
                      { label: "family income", text: this.state.application.income },
                      { label: "work ethic", text: this.state.application.workEthic },
                      { label: "interest", text: this.state.application.interest },
                    ]} />
                    :
                    <LoadingText options={{
                      class: "block__lines",
                      bg: "transparent",
                      height: "10px",
                      lines: [
                        { color: "rgba(255,101,97,0.2)", width: "80%" },
                        { color: "rgba(255,101,97,0.4)", width: "70%" },
                        { color: "rgba(255,101,97,0.2)", width: "80%" }
                      ]
                    }} />
                }
              </div>
              <div className="application__misc">
                <h2>Meta</h2>
                {
                  this.props.application.hasGotten && this.state.application ?
                    <AnnotatedList data={[
                      { label: "started", text: moment(this.state.application.startedOn).format("MM-DD-Y") },
                      { label: "submitted", text: moment(this.state.application.submittedOn).format("MM-DD-Y") },
                      { label: "state", text: this.state.application.state.pending ? "pending" : this.state.application.state.accepted ? "accepted" : "rejected" }
                    ]} />
                    :
                    <LoadingText options={{
                      class: "block__lines",
                      bg: "transparent",
                      height: "10px",
                      lines: [
                        { color: "rgba(255,101,97,0.2)", width: "80%" },
                        { color: "rgba(255,101,97,0.4)", width: "70%" },
                        { color: "rgba(255,101,97,0.4)", width: "50%" }
                      ]
                    }} />
                }
              </div>
            </div>
          </section>
        )
    }
  }

  renderReadOnlyEssay = () => {
    if (this.props.application.hasGotten)
      return (
        <WYSIWYGEditor readonly content={this.state.application.essay} 
          editorStyles={{
            margin: "0 auto",
            maxWidth: "100%",
            padding: "0 1.875em 2em"
          }}/>
      )

    return (
      <LoadingText options={{
        class: "block__lines",
        bg: "transparent",
        height: "10px",
        lines: [
          { color: "rgba(255,101,97,0.2)", width: "80%" },
          { color: "rgba(255,101,97,0.4)", width: "70%" },
          { color: "rgba(255,101,97,0.4)", width: "50%" }
        ]
      }} />
    )
  }

  renderTestList = () => {
    if (this.props.application.isGetting)
      return <p>Looking for your tests</p>

    if (Object.keys(this.state.application.tests).length > 0) {
      return (
        <TestList tests={this.state.application.tests}
          disabled={true} />
      )
    }

    return <p>No tests added.</p>
  }

  sendAcceptanceEmail = () => {
    axios.get(`${EMAIL_API}/s/accept-application/${this.state.applicationId}`)
      .then(() => {
        this.props.applicationActions.doApplicationUpdate(this.state.applicationId, {
          state: Object.assign({}, this.state.application.state, {
            pending: false,
            accepted: true
          }),
          acceptedOn: new Date(moment.utc(moment().toDate())).getTime()
        });
      })
      .catch(error => {
        this.setState({
          hasError: true,
          notificationClosed: false,
          error: "There was a problem sending your message"
        });
        console.log(error);
      })
  }
}

ApplicationSection.propTypes = {
  applicationId: propTypes.string,
  section: propTypes.string,
  application: propTypes.object,
  applicationActions: propTypes.object
};

export default ApplicationSection;