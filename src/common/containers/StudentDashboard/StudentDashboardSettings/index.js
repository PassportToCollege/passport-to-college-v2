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

import { auth } from "../../../utils/firebase";
import { isProviderLinked } from "../../../utils";

class StudentSettings extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      student: props.student.student
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
        <section className="student_dashboard__container student_dashboard__settings">
          <h4>Account</h4>
          <p>Make changes to your account settings here</p>
          {this.renderPasswordProviderActions()}
          <h5>Connections</h5>
          <p>Connect you accounts</p>
          {
            this.state.hasInlineNotification && !this.state.inlineNotificationClosed ?
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
          doClick={this.handleAddPasswordProvider} />
      </FlexContainer>
    )
  }

  renderInlineNotification = message => {
    this.setState({
      hasInlineNotification: true,
      inlineNotificationClosed: false,
      inlineNotification: message
    });
  }

  closeInlineNotification = () => {
    this.setState({
      hasInlineNotification: false,
      inlineNotificationClosed: true,
      inlineNotification: null
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