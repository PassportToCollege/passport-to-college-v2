import "./Bio.css";

import React, { Component } from "react";
import propTypes from "prop-types";

import WYSIWYGEditor from "../../../components/Editor";

class StudentBio extends Component {
  constructor(props) {
    super(props);

    this.state = {
      student: props.student.student
    };
  }

  static propTypes = {
    student: propTypes.object
  }

  render() {
    return (
      <section className="student_dashboard__container student_dashboard__bio">
        {
          this.state.student ?
            <WYSIWYGEditor saveButton
              content={this.state.student.bio}
              handleSave={this.handleBioSave}
              editorStyles={{
                margin: "0 auto",
                maxWidth: "100%",
                padding: "2em 1.875em",
                backgroundColor: "#FFF",
                border: "none"
              }} 
              controlStyles={{
                maxWidth: "100%",
                position: "static",
                marginBottom: "0"
              }} /> :
              <WYSIWYGEditor saveButton
                handleSave={this.handleBioSave}
                editorStyles={{
                  margin: "0 auto",
                  maxWidth: "100%",
                  padding: "2em 1.875em",
                  backgroundColor: "#FFF",
                  border: "none"
                }}
                controlStyles={{
                  maxWidth: "100%",
                  position: "static",
                  marginBottom: "0"
                }} />
        }
      </section>
    )
  }
}

export default StudentBio;