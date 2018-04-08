import "./InfoCard.css";

import React, { Component } from "react";
import propTypes from "prop-types";

import LinkButton from "../LinkButton";

class InfoCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bgImage: props.bgImage,
      bgColor: props.bgColor,
      title: props.title,
      content: props.content
    }
  }

  render() {
    if (this.props.blank) {
      return (
        <div className="info_card info_card__blank" style={{
          backgroundColor: this.state.bgColor
        }}>
        </div>
      )
    }

    return (
      <div className="info_card" 
        style={{
          backgroundColor: this.state.bgColor,
          backgroundImage: this.state.bgImage ? `url("${this.state.bgImage}")` : ""
        }}>
        {
          this.props.bgOverlay ?
          <div className="info_card__overlay" style={{ backgroundColor: this.props.bgOverlay }}>
          </div> : null
        }
        <h3>{this.state.title}</h3>
        <p>{this.state.content}</p>
        {
          this.props.linkButton ?
            <LinkButton target={this.props.linkButton.to}
              text={this.props.linkButton.text} 
              classes={this.props.linkButton.classes} /> : null
        }
      </div>
    )
  }
}

InfoCard.propTypes = {
  bgImage: propTypes.string,
  bgColor: propTypes.string,
  title: propTypes.string,
  content: propTypes.string,
  blank: propTypes.bool,
  bgOverlay: propTypes.string,
  linkButton: propTypes.object
};

export default InfoCard;