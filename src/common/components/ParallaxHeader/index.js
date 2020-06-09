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
      bgCount: 0,
      bgImages: props.bgImages
    };
  }

  componentDidMount() {
    const interval = setInterval(() => { this.nextBg() }, 7000);
    this.props.setInterval(interval);
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
            <LinkButton 
              target={this.props.linkButton.target} 
              text={this.props.linkButton.text} 
              classes="parallax_header__link_button" /> :
            ""
          }
        </div>
        {
          this.props.showScrollStrip ?
            <div className="parallax_header__scroll_strip" data-flip={this.props.flipStrip ? "active" : "inactive"}>
              <div className="scroll_strip__toggle_bg">
                <span className="toggle_bg__prev"
                  onClick={this.previousBg}>
                  <FontAwesomeIcon icon={faCaretLeft} />
                </span>
                <span className="toggle_bg__divider"></span>
                <span className="toggle_bg__next"
                  onClick={this.nextBg}>
                  <FontAwesomeIcon icon={faCaretRight} />
                </span>
                <div className="toggle_bg__counts">
                  <span className="toggle_bg__curr_bg">{this.state.bgCount + 1}</span>
                  <span>-</span>
                  <span className="toggle_bg__count">{this.state.bgImages.length}</span>
                </div>
              </div>
              <ScrollIndicator />
              <span className="apply__button">
                  
                <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAO__S5A5tlUOVY4UUtTTU9NS0ozWUFBRVZJT0pJVklQUi4u" target="_blank">apply</a>
              </span>
            </div> :
            null
        }
      </div>
    )
  }

  previousBg = () => {
    const { bgImages, bgCount } = this.state;

    if (bgCount === 0) {
      this.setState({ 
        currBg: bgImages[bgImages.length - 1].img,
        currBgColor: bgImages[bgImages.length - 1].color,
        bgCount: bgImages.length - 1
      });
    } else {
      this.setState({
        currBg: bgImages[bgCount - 1].img,
        currBgColor: bgImages[bgCount - 1].color,
        bgCount: bgCount - 1
      })
    }
  }

  nextBg = () => {
    const { bgImages, bgCount } = this.state;

    if (bgCount === bgImages.length - 1) {
      this.setState({
        currBg: bgImages[0].img,
        currBgColor: bgImages[0].color,
        bgCount: 0
      });
    } else {
      this.setState({
        currBg: bgImages[bgCount + 1].img,
        currBgColor: bgImages[bgCount + 1].color,
        bgCount: bgCount + 1
      })
    }
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
  flipStrip: propTypes.bool,
  setInterval: propTypes.func
}

export default ParallaxHeader;

