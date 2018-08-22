import "./SocialConnection.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import{ faTimesCircle } from "@fortawesome/fontawesome-free-solid";
import {
  faFacebookSquare,
  faGoogle,
  faTwitterSquare,
  faGithubSquare,
  faLinkedin
} from "@fortawesome/fontawesome-free-brands";

import * as authActions from "../../actions/authActions";
import * as userActions from "../../actions/userActions";

class SocialConnection extends Component {
  static propTypes = {
    provider: propTypes.object,
    user: propTypes.object,
    userActions: propTypes.object,
    auth: propTypes.object,
    authActions: propTypes.object
  }

  icons = {
    "github.com": faGithubSquare,
    "facebook.com": faFacebookSquare,
    "google.com": faGoogle,
    "twitter.com": faTwitterSquare,
    "linkedin.com": faLinkedin
  }

  render() {
    if (this.props.provider.providerId === "password")
      return null;
      
    return (
      <div className="social_connection" data-id={this.props.provider.providerId}>
        <section>
          <span>
            <i>
              <FontAwesomeIcon icon={this.icons[this.props.provider.providerId]} />
            </i>
            <span>
              <h5>{this.props.provider.displayName}</h5>
              <p className="type__uppercase type__caption">account name</p>
            </span>
          </span>
          <i className="social_connection__unlink">
            <FontAwesomeIcon icon={faTimesCircle} />
          </i>
        </section>
        <section>
          <p>Display on public profile</p>
        </section>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SocialConnection);