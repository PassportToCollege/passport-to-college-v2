import "./InfoCard.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import { Link } from "react-router-dom";
import { getPostHero, getProfilePicture } from "../../utils/firebase/functions";

import LinkButton from "../LinkButton";

class InfoCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bgImage: props.bgImage || ""
    };
  }

  static propTypes = {
    bgImage: propTypes.string,
    bgColor: propTypes.string,
    title: propTypes.string,
    content: propTypes.string,
    blank: propTypes.bool,
    bgOverlay: propTypes.string,
    linkButton: propTypes.object,
    feature: propTypes.bool,
    university: propTypes.string,
    target: propTypes.string,
    featureData: propTypes.object,
    founder: propTypes.bool,
    uid: propTypes.string
  }

  static defaultProps = {
    feature: false,
    founder: false
  }

  componentDidMount() {
    if (this.props.feature && !this.props.bgImage &&
      this.props.featureData) {
        getPostHero(this.props.featureData.id)
          .then(url => {
            this.setState({ bgImage: url });
          })
          .catch(error => {
            console.log(error);
          })
    }

    if (this.props.founder && !this.props.bgImage) {
      getProfilePicture(this.props.uid)
        .then(url => {
            this.setState({
              bgImage: url
            });
          })
          .catch(error => {
            console.log(error);
          })
    }
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
      < div className = {
        `info_card${this.props.feature ? " info_card__feature" : ""} ${this.props.founder ? "info_card__founder" : ""}`
      }
        style={{
          backgroundColor: this.props.bgColor,
          backgroundImage: `url("${this.props.bgImage || this.state.bgImage}")`
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
            <Link to={this.props.target || "/"} className="info_card__feature_content">
              <p>{this.props.university}</p>
              <h3>{this.props.title}</h3>
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