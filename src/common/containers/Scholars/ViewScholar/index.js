import "./ViewScholar.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import _ from "lodash";

import ToTopContainer from "../../../components/ToTopContainer";
import PageMeta from "../../../components/PageMeta";

class ViewScholar extends Component {
  constructor(props) {
    super(props);

    let current;
    if (props.students.gotCurrentStudents) {
      current = props.students.students.find(student => {
        return student.uid === props.match.params.uid
      });
    }

    this.state = {
      current,
      students: props.students.gotCurrentStudents ? props.students.students : null
    }
  }

  static propTypes = {
    students: propTypes.object,
    match: propTypes.object
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.students.gotCurrentStudents &&
    !_.isEqual(nextProps.students.students, prevState.students)) {
      return {
        students: nextProps.students.students,
        current: nextProps.students.students.find(student => {
          return student.uid === nextProps.match.params.uid
        })
      }
    }

    return null;
  }

  render() {
    return (
      <ToTopContainer classes="scholar">
        {
          this.props.students.gotCurrentStudents && this.state.current ?
            <PageMeta>
              <title>{this.state.current.user.name.full} | Scholars | Passport to College</title>
            </PageMeta> : null
        }
      </ToTopContainer>
    )
  }
}

export default ViewScholar;

