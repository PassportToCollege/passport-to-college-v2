import "./Apply.css";

import React, { Component } from "react";

import { SignInForm, StartApplication } from "../../components/Forms";

class Apply extends Component {
  componentWillMount() {
    this.props.updateLocation("apply");
  }

  render() {
    return (
      <div className="apply__container">
        <SignInForm 
          title="Continue Application"
          submitText="Continue"
          handleSignIn={this.handleSignIn}
          updateEmail={this.updateEmail}
          updatePassword={this.updatePassword} />

        <StartApplication
          title="Start New Application"
          handleSignIn={this.handleSignIn}
          updateEmail={this.updateEmail}
          updatePassword={this.updatePassword} />
      </div>
    )
  }

  updateEmail = (e) => this.setState({ email: e.target.value });
  updatePassword = (e) => this.setState({ password: e.target.value });

  handleSignIn = (e) => {
    e.preventDefault();

    const { email, password } = this.state;

    this.props.authActions.doSignIn(email, password);
  }
}

export default Apply;
