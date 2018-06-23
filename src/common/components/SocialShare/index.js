import "./SocialShare.css";

import React from "react";
import propTypes from "prop-types";

import IconButton from "../IconButton";

const SocialShare = props => {
  const shareFacebook = () => {
    window.FB.ui({
      method: "share",
      display: "popup",
      href: props.facebook.href
    }, () => {return});
  }

  const shareTwitter = () => {
    window.open(`
      https://www.twitter.com/intent/tweet?text=${props.twitter.title}&url=${props.twitter.href}
    `);
  }

  return (
    <div className="social_share">
      <h4 className="social_share__label">Share:</h4>
      {
        props.facebook ?
          <IconButton icon="facebook" solid
            buttonTitle="Share on Facebook"
            doClick={shareFacebook}
            styles={{
              backgroundColor: "#3B5998",
              margin: "0.85rem"
            }} /> : null
      }
      {
        props.twitter ?
          <IconButton icon="twitter" solid
            buttonTitle="Share on Twitter"
            doClick={shareTwitter}
            styles={{
              backgroundColor: "#1DA1F2",
              margin: "0.85rem"
            }} /> : null
      }
    </div>
  );
};

SocialShare.propTypes = {
  facebook: propTypes.object,
  twitter: propTypes.object
};

export default SocialShare;