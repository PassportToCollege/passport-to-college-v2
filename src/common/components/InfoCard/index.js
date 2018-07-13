import "./InfoCard.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import { Link } from "react-router-dom";

import LinkButton from "../LinkButton";

class InfoCard extends Component {
  static propTypes = {
    bgImage: propTypes.string,
    bgColor: propTypes.string,
    title: propTypes.string,
    content: propTypes.string,
    blank: propTypes.bool,
    bgOverlay: propTypes.string,
    linkButton: propTypes.object,
    feature: propTypes.bool,
    university: propTypes.string
  }

  static defaultProps = {
    feature: false
  }

  render() {
    if (this.props.blank) {
      return (
        <div className="info_card info_card__blank" style={{
          backgroundColor: this.props.bgColor
        }}>
        </div>
      )
    }

    return (
      <div className="info_card" 
        style={{
          backgroundColor: this.props.bgColor,
          backgroundImage: this.props.bgImage ? `url("${this.props.bgImage}")` : ""
        }}>
        {
          this.props.bgOverlay ?
          <div className="info_card__overlay" style={{ backgroundColor: this.props.bgOverlay }}>
          </div> : null
        }
        {
          !this.props.feature ?
            <span className="info_card__content">
              <h3>{this.props.title}</h3>
              <p>{this.props.content}</p>
            </span> :
            <Link to="/" className="info_card__feature_content">
              <h2>{this.props.title}</h2>
              <h4>{this.props.university}</h4>
            </Link>
        }
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

export default InfoCard;