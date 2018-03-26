import "./AddAccomplishment.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as studentsActions from "../../actions/studentsActions";

import WYSIWYGEditor from "../../components/Editor";
import Button from "../../components/Button";
import Notification from "../../components/Notification";

class AddAccomplishment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      students: props.students.students,
      student: props.student,
      accomplishment: {
        student: props.student.uid,
        name: props.student.user.name.full,
        title: "",
        slug: "",
        details: {
          excerpt: "",
          full: ""
        }
      },
      notificationClosed: true,
      hasError: false,
      error: ""
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
      <form className="add_accomplishment" onSubmit={this.handleAccomplishmentSave}>
        {
          this.state.hasError && !this.state.notificationClosed ?
            <Notification text={this.state.error}
              doClose={this.handleNotificationClose} /> :
            null
        }
        <section className="add_accomplishment__section">
          <h3 className="section_heading">1. select student</h3>
          <div className="form__input_container">
            <label>Student</label>
            <select name="student" defaultValue={this.state.student.uid} required
              onChange={this.handleInputChange}>
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
              defaultValue={this.state.student && this.state.student.user ? this.state.student.user.name.full : null} required 
              onBlur={this.handleInputChange} />
          </div>
        </section>
        <section className="add_accomplishment__section">
          <h3 className="section_heading">2. about accomplishment</h3>
          <div className="form__input_container">
            <label>Title</label>
            <input type="text" name="title" required 
              onBlur={this.handleInputChange} />
          </div>
          <div className="form__input_container">
            <label>Slug (unique accomplishment identifier)</label>
            <input type="text" name="slug" required 
              onBlur={this.handleInputChange} 
              ref={input => this.slugInput = input} />
          </div>
          <div className="form__input_container">
            <label>Excerpt</label>
            <textarea name="details.brief" required rows="3"
              onBlur={this.handleInputChange}></textarea>
          </div>
          <div className="form__input_container">
            <label>Details</label>
            <WYSIWYGEditor saveButton
              editorStyles={{
                maxWidth: "100%"
              }}
              controlStyles={{
                maxWidth: "100%"
              }} handleSave={this.handleDetailsSave} />
          </div>
        </section>
        <section className="add_accomplishment__section">
          <div className="form__input_container">
            <Button type="submit" solid 
              text="save accomplishment" />
          </div>
        </section>
      </form>
    )
  }

  handleNotificationClose = () => {
    this.setState({
      notificationClosed: true,
      hasError: false,
      error: ""
    })
  }

  handleDetailsSave = content => {
    let { full } = this.state.accomplishment.details;
    full = content;

    const newAccomplishment = Object.assign({}, this.state.accomplishment, {
        details: Object.assign({}, this.state.accomplishment.details, {
          full
        })
    });

    this.setState({ accomplishment: newAccomplishment });
  }

  handleInputChange = e => {
    let { excerpt } = this.state.accomplishment.details;

    switch (e.target.name) {
      case "details.brief":
        excerpt = e.target.value;

        this.setState({
          accomplishment: Object.assign({}, this.state.accomplishment, {
            details: Object.assign({}, this.state.accomplishment.details, {
              excerpt
            })
          }) 
        });
        break;
      case "title":
        if (!this.state.accomplishment.slug) {
          this.slugInput.value = e.target.value.toLowerCase().split(" ").join("-");

          this.setState({
            accomplishment: Object.assign({}, this.state.accomplishment, {
              slug: this.slugInput.value
            })
          });
        }

        this.setState({ accomplishment: Object.assign({}, this.state.accomplishment, {
            "title": e.target.value
          })
        });

        break;
      default:
        this.setState({ accomplishment: Object.assign({}, this.state.accomplishment, {
          [e.target.name]: e.target.value
        })
      });
    }
  }

  handleAccomplishmentSave = e => {
    e.preventDefault();

    let { accomplishment } = this.state;

    if ("object" === typeof accomplishment.details.full) {
      // update student
      return console.log("everythings good");
    }

    this.setState({
      hasError: true,
      notificationClosed: false,
      error: "You need to provide full details of the accomplishment"
    });
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