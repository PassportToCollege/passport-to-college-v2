import "./StudentInfoCard.css";

import React, { Component } from "react";
import propTypes from "prop-types";

import { isBrowser } from "../../utils";

import ImageWithColoredShadow from "../ImageWithColoredShadow";
import WYSIWYGEditor from "../Editor";
import IconButton from "../IconButton";

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
        <p>{this.props.student.university}</p>
        {this.getBio()}
        <h4 className="type__boldest type__uppercase">education</h4>
        {this.getEducation()}
        <h4 className="type__boldest type__uppercase">social</h4>
        <IconButton solid icon="linkedin"
          doClick={this.handleLinkClick} 
          styles={{
            backgroundColor: "#0077B5",
            marginTop: "2em"
          }} />
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
          padding: "3em 0",
          minHeight: "auto"
        }} />
    )
  }

  getEducation = () => {
    return (
      <span>
        <p className="type__smaller type__uppercase">university</p>
        <p>{this.props.student.university}</p>
        <p className="type__smaller type__uppercase type__margin_top">major</p>
        <p>{this.props.student.major}</p>
        {
          this.props.student.minor ?
            <React.Fragment>
              <p className="type__smaller type__uppercase type__margin_top">minor</p>
              <p>{this.props.student.minor}</p>
            </React.Fragment> : null
        }
        <p className="type__smaller type__uppercase type__margin_top">graduation year</p>
        <p>{this.props.student.graduationYear}</p>
      </span>
    );
  }
}