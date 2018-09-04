import "./Settings.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";
import _ from "lodash";

import * as authActions from "../../../actions/authActions";

import PageMeta from "../../../components/PageMeta";
import { InlineNotification } from "../../../components/Notification";
import FlexContainer from "../../../components/FlexContainer";
import Button from "../../../components/Button";
import ConnectionsStrip from "../../../components/ConnectionsStrip";
import SocialConnection from "../../SocialConnection";
import Modal from "../../../components/Modal";
import Form from "../../../components/Form";
import Input from "../../../components/Input";
import Select from "../../../components/Select";
import Loader from "../../../components/Loader";


import { auth } from "../../../utils/firebase";
import { isProviderLinked, isEmail } from "../../../utils";

class StudentSettings extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      student: props.student.student,
      addingPassword: false,
      newPasswordProvider: {}
    }
  }

  static propTypes = {
    auth: propTypes.object,
    authActions: propTypes.object,
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
            this.state.student.user.isAdmin ?
            <PageMeta route="PROFILE_SETTINGS" /> :
            <PageMeta>
              <title>Settings | {this.state.student.user.name.full} | Student Dashboard | Passport to College</title>
            </PageMeta> :
            <PageMeta>
              <title>Settings | Dashboard | Passport to College</title>
            </PageMeta>
        }
        {
          this.state.addingPassword ?
            <Modal classes={["modal__settings_add_password"]}
              doClose={() => this.setState({ addingPassword: false })}>
              {this.renderPasswordProviderForm()}
            </Modal> : null
        }
        <section className="student_dashboard__container student_dashboard__settings">
          <h4>Account</h4>
          <p>Make changes to your account settings here</p>
          {this.renderPasswordProviderActions()}
          <h5>Connections</h5>
          <p>Connect you accounts</p>
          {
            this.state.hasInlineNotification && !this.state.inlineNotificationClosed &&
            !this.state.inlineLocation ?
              <InlineNotification text={this.state.inlineNotification}
                doClose={this.closeInlineNotification} /> : null
          }
          <ConnectionsStrip facebook twitter linkedin github google
            whenConnectionClicked={this.handleAddConnection} />
          {
            this.state.userProviders ?
              this.state.userProviders.map(provider => {
                if (provider.providerId === "password")
                  return null;

                return <SocialConnection key={provider.providerId} provider={provider} />
              }) : 
              null
          }
        </section>
      </React.Fragment>
    )
  }

  renderPasswordProviderActions = () => {
    if (this.state.passwordSet) {
      return (
        <React.Fragment>
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
              <h6>***********</h6>
            </span>
            <Button solid text={this.state.passwordSet ? "change" : "create"}
              doClick={this.handlePasswordChangeClick} />
          </FlexContainer>
        </React.Fragment>
      )
    }

    return (
      <FlexContainer styles={{ justifyContent: "space-between" }}>
        <span>
          <p className="type__uppercase type__caption">no password provider</p>
          <h6>Would you like to add an email password to sign in?</h6>
        </span>
        <Button solid text="yes"
          doClick={() => this.setState({ addingPassword: true })} />
      </FlexContainer>
    )
  }

  renderPasswordProviderForm = () => {
    return (
      <Form doSubmit={this.handlePasswordProviderAdd}>
        <h4>Add Email and Password</h4>
        <p>Add an email and password to your account for signing in</p>
        <FlexContainer>
          <span>
            <Select selectDefault=""
              selectName="email"
              whenChange={this.handleInputChange}>
              <option value="" disabled>Select One</option>
              {
                this.state.userProviders.map(provider => {
                  return (
                    <option key={provider.providerId} 
                      value={provider.email}>
                      {provider.providerId}({provider.email})
                    </option>
                  )
                })
              }
            </Select>
            <p className="create_user__input_label required">Choose an email address from an existing provider</p>
          </span>
        </FlexContainer>
        <h5 className="type__center">or</h5>
        <FlexContainer>
          <span>
            <Input inputType="email"
              inputName="email"
              whenBlur={this.handleInputChange} />
            <p className="create_user__input_label required">Add new email address</p>
          </span>
        </FlexContainer>
        <FlexContainer>
          <span>
            <Input inputType="password"
              inputName="password"
              whenBlur={this.handleInputChange} />
            <p className="create_user__input_label required">Password</p>
          </span>
          <span>
            <Input inputType="password"
              inputName="password_confirm"
              whenBlur={this.handleInputChange} />
            <p className="create_user__input_label required">Confirm Password</p>
          </span>
        </FlexContainer>
        {
          this.state.hasInlineNotification && !this.state.inlineNotificationClosed &&
          this.state.inlineLocation === "modal" ?
            <InlineNotification doClose={this.closeInlineNotification}
              text={this.state.inlineNotification} /> : null
        }
        <Button solid
          doClick={() => this.setState({ addingPassword: false })}
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

  handleInputChange = e => {
     const { name, value } = e;

    this.setState({
      newPasswordProvider: Object.assign({}, this.state.newPasswordProvider, {
        [name]: value ? value : this.state.newPasswordProvider[name]
      })
    });
  }

  renderInlineNotification = (message, location) => {
    this.setState({
      hasInlineNotification: true,
      inlineNotificationClosed: false,
      inlineNotification: message,
      inlineLocation: location
    });
  }

  closeInlineNotification = () => {
    this.setState({
      hasInlineNotification: false,
      inlineNotificationClosed: true,
      inlineNotification: null,
      inlineLocation: null
    });
  }

  handleAddConnection = connection => {
    switch (connection) {
      case "google":
      case "twitter":
      case "github":
      case "facebook":
        if (isProviderLinked(connection))
          return this.renderInlineNotification("account already linked");
        
        this.props.authActions.doLinkSocialAccount(connection);
        break;
      case "linkedin":
        this.renderInlineNotification("coming soon");
        break;
      default:
        this.renderInlineNotification("unknown connection provided");
    }
  }

  handlePasswordProviderAdd = e => {
    e.preventDefault();

    const { newPasswordProvider } = this.state;

    if (Object.keys(newPasswordProvider).length) {
      const {
        email,
        password,
        password_confirm
      } = this.state.newPasswordProvider;

      if (!isEmail(email))
        return this.renderInlineNotification("invalid email address", "modal");

      if (!password)
        return this.renderInlineNotification("password required", "modal");

      if (!password_confirm)
        return this.renderInlineNotification("password confirmation required", "modal");

      if (password !== password_confirm)
        return this.renderInlineNotification("passwords do not match", "modal");

      
    }

    this.renderInlineNotification("nothing to save", "modal");
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
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
)(StudentSettings);