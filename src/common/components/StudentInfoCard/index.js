import "./StudentInfoCard.css";

import React, { Component } from "react";
import propTypes from "prop-types";

import { isBrowser } from "../../utils";

import ImageWithColoredShadow from "../ImageWithColoredShadow";
import WYSIWYGEditor from "../Editor";

export default class StudentInfoCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: "bio",
      singleColumn: isBrowser && window.innerWidth <= 768
    }
  }

  static propTypes = {
    student: propTypes.object,
    accent: propTypes.string,
    bgColor: propTypes.string
  }

  static defaultProps = {
    bgColor: "white"
  }

  render() {
    return this.renderSingleColumn();
  }

  renderSingleColumn = () => {
    return (
      <div className="student_info_card__container student_info_card__single_column"
        style={{ backgroundColor: this.props.bgColor }}>
        <ImageWithColoredShadow width="300px" shadowColor={this.props.accent} 
          image={this.props.student.user.profilePicture} />
        <h5 className="type__uppercase type__boldest">{this.props.student.user.name.full}</h5>
        <p className="type__medium">{this.props.student.university}</p>
        {this.getBio()}
      </div>
    )
  }

  getBio = () => {
    return (
      <WYSIWYGEditor readonly
        content={this.props.student.bio}
        editorStyles={{
          border: "none",
          margin: "0 auto",
          maxWidth: "100%",
          padding: "3em 0 2em",
        }} />
    )
  }
}