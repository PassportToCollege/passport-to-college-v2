import "./SocialConnection.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import {
  faFacebookSquare,
  faGoogle,
  faTwitterSquare,
  faGithubSquare,
  faLinkedin
} from "@fortawesome/fontawesome-free-brands";

class SocialConnection extends Component {
  static propTypes = {
    provider: propTypes.object
  }

  icons = {
    "github.com": faGithubSquare,
    "facebook.com": faFacebookSquare,
    "google.com": faGoogle,
    "twitter.com": faTwitterSquare,
    linkedin: faLinkedin
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
        </section>
        <section>
          <p>Display on public profile</p>
        </section>
      </div>
    )
  }
}

export default SocialConnection;