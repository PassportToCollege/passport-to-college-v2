import "./SocialShare.css";

import React, { Component } from "react";
import propTypes from "prop-types";

import IconButton from "../IconButton";

class SocialShare extends Component {
  state = {
    emailing: false
  }

  render() {
    return (
      <div className="social_share">
        <h4 className="social_share__label">Share:</h4>
        {
          this.props.facebook ?
            <IconButton icon="facebook" solid
              buttonTitle="Share on Facebook"
              doClick={this.shareFacebook}
              styles={{
                backgroundColor: "#3B5998",
                margin: "0.85rem"
              }} /> : null
        }
        {
          this.props.twitter ?
            <IconButton icon="twitter" solid
              buttonTitle="Share on Twitter"
              doClick={this.shareTwitter}
              styles={{
                backgroundColor: "#1DA1F2",
                margin: "0.85rem"
              }} /> : null
        }
        {
          this.props.mail ?
            <IconButton icon="email" solid
              buttonTitle="Email to Friends"
              doCLick={this.shareEmail}
              styles={{
                backgroundColor: "rgb(51,51,51)",
                margin: "0.85rem"
              }} /> : null
        }
      </div>
    );
  }

  shareFacebook = () => {
    window.FB.ui({
      method: "share",
      display: "popup",
      href: this.props.facebook.href
    }, () => {return});
  }

  shareTwitter = () => {
    window.open(`
      https://www.twitter.com/intent/tweet?text=${this.props.twitter.title}&url=${this.props.twitter.href}
    `);
  }

  shareEmail = () => {
    return;
  }
}

SocialShare.defaultProps = {
  mail: false
}

SocialShare.propTypes = {
  facebook: propTypes.object,
  twitter: propTypes.object,
  mail: propTypes.bool
};

export default SocialShare;