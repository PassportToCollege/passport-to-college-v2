import "./ParallaxHeader.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import { Link } from "react-router-dom";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/fontawesome-free-solid";

import LinkButton from "../LinkButton";
import ScrollIndicator from "../ScrollIndicator";

class ParallaxHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currBg: props.bgImages[0].img,
      currBgColor: props.bgImages[0].color,
      bgCount: 1,
      bgImages: props.bgImages
    }
  }

  render() {
    return (
      <div className="parallax_header" style={{
        height: this.state.height || "100vh",
        backgroundImage: `url("${this.state.currBg}")`
      }}>
        <div className="parallax_header__overlay" style={{
          backgroundColor: this.state.currBgColor
        }}></div>
        <div className="parallax_header__content">
          <div className="parallax_header__big_text">
            <h1>{this.props.bigText}</h1>
          </div>
          {
            this.props.showLinkButton ?
            <LinkButton target={this.props.linkButton.target} text={this.props.linkButton.text} /> :
            ""
          }
        </div>
        {
          this.props.showScrollStrip ?
            <div className="parallax_header__scroll_strip" data-flip={this.props.flipStrip ? "active" : "inactive"}>
              <div className="scroll_strip__toggle_bg">
                <span className="toggle_bg__prev">
                  <FontAwesomeIcon icon={faCaretLeft} />
                </span>
                <span className="toggle_bg__divider"></span>
                <span className="toggle_bg__next">
                  <FontAwesomeIcon icon={faCaretRight} />
                </span>
                <div className="toggle_bg__counts">
                  <span className="toggle_bg__curr_bg">{this.state.bgCount}</span>
                  <span>-</span>
                  <span className="toggle_bg__count">{this.state.bgImages.length}</span>
                </div>
              </div>
              <ScrollIndicator />
              <span className="apply__button">
                <Link to="/apply">apply</Link>
              </span>
            </div> :
            null
        }
      </div>
    )
  }
}

ParallaxHeader.propTypes = {
  height: propTypes.string,
  bgImages: propTypes.array,
  overlayColor: propTypes.string,
  bigText: propTypes.string,
  showLinkButton:  propTypes.bool,
  linkButton: propTypes.object,
  showScrollStrip: propTypes.bool,
  flipStrip: propTypes.bool
}

export default ParallaxHeader;

