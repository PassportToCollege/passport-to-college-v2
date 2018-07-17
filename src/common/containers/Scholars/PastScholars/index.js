import "./PastScholars.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";
import _ from "lodash";

import * as studentsActions from "../../../actions/studentsActions";

import PageMeta from "../../../components/PageMeta";
import StudentInfoCard from "../../../components/StudentInfoCard";

class PastScholars extends Component {
  constructor(props) {
    super(props);

    this.state = {
      students: props.students.pastStudents
    }
  }

  static propTypes = {
    students: propTypes.object,
    studentsActions: propTypes.object
  }

  componentDidMount() {
    this.props.studentsActions.doGetPastStudents();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.students.gotPastStudents &&
    !_.isEqual(state.students, props.students.pastStudents)) {
      return {
        students: props.students.pastStudents
      };
    }

    return null;
  }

  render() {
    return (
      <React.Fragment>
        <PageMeta route="SCHOLARS_PAST" />
        <main className="scholars__past">
          {
            this.state.students && this.state.students.length ?
              this.state.students.map(student => {
                return (
                  <StudentInfoCard key={student.uid} 
                    student={student}
                    accent="#FF6561" />
                )
              }) : null
          }
        </main>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    students: state.students
  };
};

const mapDispatchToProps = dispatch => {
  return {
    studentsActions: bindActionCreators(studentsActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PastScholars);