import "./AddAccomplishment.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as studentsActions from "../../actions/studentsActions";

import WYSIWYGEditor from "../../components/Editor";
import Button from "../../components/Button";

class AddAccomplishment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      students: props.students.students,
      student: props.student
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
        <section className="add_accomplishment__section">
          <h3 className="section_heading">1. select student</h3>
          <div className="form__input_container">
            <label>Student</label>
            <select name="student" defaultValue={this.state.student.uid || ""} required>
              <option value="" disabled>Choose Student</option>
              {
                this.props.students.hasGotten && this.state.students ?
                  this.state.students.map(student => {
                    return (
                      <option key={student.uid} 
                        value={student.uid}>
                        {student.user.name.full}
                      </option>
                    )
                  }) :
                  null
              }
            </select>
          </div>
          <div className="form__input_container">
            <label>Full name</label>
            <input type="text" name="name" 
              defaultValue={this.state.student && this.state.student.user ? this.state.student.user.name.full : null} required />
          </div>
        </section>
        <section className="add_accomplishment__section">
          <h3 className="section_heading">2. about accomplishment</h3>
          <div className="form__input_container">
            <label>Title</label>
            <input type="text" name="title" required />
          </div>
          <div className="form__input_container">
            <label>Excerpt</label>
            <textarea name="details.brief" required rows="3"></textarea>
          </div>
          <div className="form__input_container">
            <label>Details</label>
            <WYSIWYGEditor saveButton
              editorStyles={{
                maxWidth: "100%"
              }}
              controlStyles={{
                maxWidth: "100%"
              }}/>
          </div>
        </section>
        <section className="add_accomplishment__section">
          <div className="form__input_container">
            <Button type="button" solid 
              text="save accomplishment" />
          </div>
        </section>
      </form>
    )
  }
}

AddAccomplishment.propTypes = {
  students: propTypes.object,
  studentsActions: propTypes.object,
  student: propTypes.object
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