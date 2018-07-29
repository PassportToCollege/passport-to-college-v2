import "./StudentDashboard.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";
import _ from "lodash";

import * as studentActions from "../../actions/studentActions";
import { activeUser } from "../../utils";
import { getProfilePicture } from "../../utils/firebase/functions";

import NavigationDashboard from "../NavigationDashboard";
import PageMeta from "../../components/PageMeta";

const Console = console;

class StudentDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      student: props.student.student
    };
  }

  static propTypes = {
    student: propTypes.object,
    studentActions: propTypes.object,
    updateLocation: propTypes.func,
    menu: propTypes.object,
    menuActions: propTypes.object
  }

  componentDidMount() {
    this.props.updateLocation("dashboard student");
    this.props.studentActions.doStudentGet(activeUser());
  }

  static getDerivedStateFromProps(props, state) {
    if (props.student.hasGotten &&
    !_.isEqual(state.student, props.student.student)) {
      return {
        student: props.student.student
      };
    }

    return null;
  }

  getSnapshotBeforeUpdate(props) {
    if (props.student.isGetting && this.props.student.hasGotten) {
      return { gotStudent: true };
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot) {
      if (snapshot.gotStudent && this.state.student && this.state.student.user.hasProfilePicture) {
        getProfilePicture(this.state.student.uid)
          .then(url => {
            this.setState({ picture: url });
          })
          .catch(error => {
            Console.log(error.message);
          })
      }
    }
  }

  render() {
    return (
      <div className="student_dashboard" data-menu-state={this.props.menu.dash}>
        {
          this.state.student ?
            <PageMeta>
              <title>{this.state.student.user.name.full} | Student Dashboard | Passport to College</title>
            </PageMeta> :
            <PageMeta route="STUDENT_DASHBOARD" />
        }
        <NavigationDashboard student />
        <main>
          <header></header>
        </main>
      </div>
    )
  }

  renderProfile() {

  }
}

const mapStateToProps = state => {
  return {
    student: state.student,
    menu: state.menu
  };
};

const mapDispatchToProps = dispatch => {
  return {
    studentActions: bindActionCreators(studentActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentDashboard);