import "./Settings.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import _ from "lodash";

import PageMeta from "../../../components/PageMeta";

class StudentSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      student: props.student.student
    }
  }

  static propTypes = {
    student: propTypes.object,
    studentActions: propTypes.object
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.student.hasGotten &&
    !_.isEqual(prevState.student, nextProps.student.student)) {
      return {
        student: nextProps.student.student
      };
    }

    return null;
  }

  render() {
    return (
      <React.Fragment>
        {
          this.state.student ?
            <PageMeta>
              <title>Settings | {this.state.student.user.name.full} | Student Dashboard | Passport to College</title>
            </PageMeta> :
            <PageMeta route="STUDENT_DASHBOARD" />
        }
        <section className="student_dashboard__container student_dashboard__settings">

        </section>
      </React.Fragment>
    )
  }
}

export default StudentSettings;