import "./Apply.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as authActions from "../../actions/authActions";

import { SignInForm, StartApplication } from "../../components/Forms";

class Apply extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    }
  }

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
          handleAccountCreation={this.handleAccountCreation}
          updateName={this.updateName}
          updateEmail={this.updateEmail}
          updatePassword={this.updatePassword} />
      </div>
    )
  }

  updateEmail = (e) => this.setState({ email: e.target.value });
  updatePassword = (e) => this.setState({ password: e.target.value });
  updateName = (e) => this.setState({ name: e.target.value });

  handleAccountCreation = (e) => {
    e.preventDefault();

    const data = {
      isApplicant: true,
      email: this.state.email,
      name: this.state.name,
      password: this.state.password
    };

    this.props.authActions.doAccountCreate(data);
  }
}

Apply.propTypes = {
  authActions: propTypes.object,
  updateLocation: propTypes.func
};

const mapStateToProps = state => {
  return {
    activeUser: state.activeUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authActions: bindActionCreators(authActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Apply);
