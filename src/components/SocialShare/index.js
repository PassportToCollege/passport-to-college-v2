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

  return (
    <div className="social_share">
      <h4 className="social_share__label">Share:</h4>
      {
        props.facebook ?
          <IconButton icon="facebook" solid
            doClick={shareFacebook}
            styles={{
              backgroundColor: "#3B5998",
              margin: "0.85rem"
            }} /> : null
      }
    </div>
  );
};

SocialShare.propTypes = {
  facebook: propTypes.object
};

export default SocialShare;