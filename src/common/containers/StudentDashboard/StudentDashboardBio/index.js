import "./Bio.css";

import React, { Component } from "react";
import propTypes from "prop-types";

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
      <main className="student_dashboard__container student_dashboard__bio">

      </main>
    )
  }
}

export default StudentBio;