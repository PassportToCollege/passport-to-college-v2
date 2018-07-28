import "./StudentDashboard.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";

import * as studentActions from "../../actions/studentActions";

class StudentDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  static propTypes = {
    student: propTypes.object,
    studentActions: propTypes.object,
    updateLocation: propTypes.func
  }

  componentDidMount() {
    this.props.updateLocation("dashboard student");
  }

  render() {
    return (
      <main></main>
    )
  }
}

const mapStateToProps = state => {
  return {
    student: state.student
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