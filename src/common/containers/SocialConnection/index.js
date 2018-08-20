import "./SocialConnection.css";

import React, { Component } from "react";
import propTypes from "prop-types";

class SocialConnection extends Component {
  static propTypes = {
    provider: propTypes.object
  }

  render() {
    if (this.props.provider.providerId === "password")
      return null;
      
    return (
      <div className="social_connection" data-id={this.props.provider.providerId}>
      
      </div>
    )
  }
}

export default SocialConnection;