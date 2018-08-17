import "./ConnectionsStrip.css";

import React from "react";
import propTypes from "prop-types";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import {
  faFacebookSquare,
  faGoogle,
  faTwitterSquare,
  faGithubSquare,
  faLinkedin
} from "@fortawesome/fontawesome-free-brands";

import FlexContainer from "../FlexContainer";

const ConnectionsStrip = props => {
  const handleConnectionClick = e => {
    const connection = e.currentTarget.getAttribute("data-connection");

    if ("function" === typeof props.whenConnectionClicked)
      props.whenConnectionClicked(connection);
  }

  return (
    <FlexContainer classes={["connections_strip"]}
      styles={{ justifyContent: "flex-start" }}>
      {
        props.google ?
          <span className="connection__item connection__item_google" 
            data-connection="google"
            onClick={handleConnectionClick}>
            <FontAwesomeIcon icon={faGoogle} />
          </span> :
          null
      }
      {
        props.facebook ?
          <span className="connection__item connection__item_facebook" 
            data-connection="facebook"
            onClick={handleConnectionClick}>
            <FontAwesomeIcon icon={faFacebookSquare} />
          </span> :
          null
      }
      {
        props.twitter ?
          <span className="connection__item connection__item_twitter" 
            data-connection="twitter"
            onClick={handleConnectionClick}>
            <FontAwesomeIcon icon={faTwitterSquare} />
          </span> :
          null

      }
      {
        props.linkedin ?
          <span className="connection__item connection__item_linkedin" 
            data-connection="linkedin"
            onClick={handleConnectionClick}>
            <FontAwesomeIcon icon={faLinkedin} />
          </span> :
          null
      }
      {
        props.github ?
          <span className="connection__item connection__item_github" 
            data-connection="github"
            onClick={handleConnectionClick}>
            <FontAwesomeIcon icon={faGithubSquare} />
          </span> :
          null
      }
    </FlexContainer>
  )
}

ConnectionsStrip.defaultProps = {
  facebook: false,
  google: false,
  twitter: false,
  github: false,
  linkedin: false
};

ConnectionsStrip.propTypes = {
  facebook: propTypes.bool,
  google: propTypes.bool,
  twitter: propTypes.bool,
  github: propTypes.bool,
  linkedin: propTypes.bool,
  whenConnectionClicked: propTypes.func
};

export default ConnectionsStrip;