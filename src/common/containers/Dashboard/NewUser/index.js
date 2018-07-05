import "./NewUser.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";

import * as userActions from "../../../actions/userActions";
import { USERS } from "../../../constants/routes";
import { User } from "../../../utils";

import ToTopContainer from "../../../components/ToTopContainer";
import PageMeta from "../../../components/PageMeta";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import Checkbox from  "../../../components/Checkbox";

class NewUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: new User().data
    }
  }

  static propTypes = {
    user: propTypes.object,
    userActions: propTypes.object,
    history: propTypes.object
  }

  render() {
    return (
      <ToTopContainer classes="dashboard__container create_user__container">
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
          </section>
        </main>
      </ToTopContainer>
    )
  }

  handleRolesCheckboxChange = (name, value) => {
    this.setState({ user: Object.assign({}, this.state.user, {
        [name]: value
      }) 
    });
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userActions: bindActionCreators(userActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewUser);