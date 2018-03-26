import "./AddAccomplishment.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as studentsActions from "../../actions/studentsActions";

class AddAccomplishment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      students: props.students.students
    }
  }

  componentWillMount() {
    this.props.studentsActions.doStudentsGet();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.students.hasGotten)
      this.setState({ students: nextProps.students.students });
  }

  render() {
    return (
      <form className="add_accomplishment">

      </form>
    )
  }
}

AddAccomplishment.propTypes = {
  students: propTypes.object,
  studentsActions: propTypes.object
};

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
)(AddAccomplishment);