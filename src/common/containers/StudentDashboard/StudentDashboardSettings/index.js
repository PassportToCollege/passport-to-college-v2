import "./Settings.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import _ from "lodash";

import PageMeta from "../../../components/PageMeta";
import FlexContainer from "../../../components/FlexContainer";
import Button from "../../../components/Button";
import ConnectionsStrip from "../../../components/ConnectionsStrip";

import { auth } from "../../../utils/firebase";

class StudentSettings extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      student: props.student.student
    }
  }

  static propTypes = {
    student: propTypes.object,
    studentActions: propTypes.object
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        const pwProvider = auth.currentUser.providerData.findIndex(provider => {
          return provider.providerId === "password";
        })

        this.setState({ 
          userProviders: auth.currentUser.providerData,
          passwordSet: pwProvider > -1
        });
      }
    });
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

  render() {
    return (
      <React.Fragment>
        {
          this.state.student ?
            <PageMeta>
              <title>Settings | {this.state.student.user.name.full} | Student Dashboard | Passport to College</title>
            </PageMeta> :
            <PageMeta route="STUDENT_DASHBOARD" />
        }
        <section className="student_dashboard__container student_dashboard__settings">
          <h4>Account</h4>
          <p>Make changes to your account settings here</p>
          <FlexContainer styles={{ justifyContent: "space-between" }}>
            <span>
              <p className="type__uppercase type__caption">email</p>
              {
                this.state.student ?
                  <h6>{this.state.student.user.email}</h6> :
                  null
              }
            </span>
            <Button solid text="change"
              doClick={this.handleEmailChangeClick} />
          </FlexContainer>
          <FlexContainer styles={{ justifyContent: "space-between" }}>
            <span>
              <p className="type__uppercase type__caption">password</p>
              <h6>{ this.state.passwordSet ? "***********" : "not set" }</h6>
            </span>
            <Button solid text={ this.state.passwordSet ? "change" : "create" }
              doClick={this.handlePasswordChangeClick} />
          </FlexContainer>
          <h5>Connections</h5>
          <p>Connect you accounts</p>
          <ConnectionsStrip facebook twitter linkedin github google
            whenConnectionClicked={this.handleAddConnection} />
        </section>
      </React.Fragment>
    )
  }

  handleAddConnection = connection => {
    console.log(connection);
  }
}

export default StudentSettings;