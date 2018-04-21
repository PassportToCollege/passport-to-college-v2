import "./AddAccomplishment.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as studentsActions from "../../actions/studentsActions";
import * as studentActions from "../../actions/studentActions";

import WYSIWYGEditor from "../../components/Editor";
import Button from "../../components/Button";
import Notification from "../../components/Notification";

class AddAccomplishment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      students: props.students.students,
      student: props.student,
      newAccomplishment: {
        student: props.student.uid,
        name: props.student.user.name.full,
        title: props.edit ? props.accomplishment.title : "",
        slug: props.edit ? props.slug : "",
        details: {
          excerpt: props.edit ? props.accomplishment.details.excerpt : "",
          full: props.edit ? props.accomplishment.details.full : ""
        }
      },
      notificationClosed: false,
      hasError: false,
      error: ""
    }
  }

  componentDidMount() {
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
              onChange={this.handleInputChange} disabled={this.props.edit}>
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
              onBlur={this.handleInputChange} 
              disabled={this.props.edit} />
          </div>
        </section>
        <section className="add_accomplishment__section">
          <h3 className="section_heading">2. about accomplishment</h3>
          <div className="form__input_container">
            <label>Title</label>
            <input type="text" name="title" required 
              onBlur={this.handleInputChange} 
              defaultValue={this.props.edit ? this.props.accomplishment.title : null}/>
          </div>
          <div className="form__input_container">
            <label>Slug (unique accomplishment identifier)</label>
            <input type="text" name="slug" required 
              onBlur={this.handleInputChange} 
              ref={input => this.slugInput = input} 
              disabled={this.props.edit} 
              defaultValue={this.props.edit ? this.props.slug : null} />
          </div>
          <div className="form__input_container">
            <label>Excerpt</label>
            <textarea name="details.brief" required rows="5"
              onBlur={this.handleInputChange}
              defaultValue={
                this.props.edit ?
                  this.props.accomplishment.details.excerpt :
                  null
              }>
              </textarea>
          </div>
          <div className="form__input_container">
            <label>Details</label>
            {
              this.props.edit ?
                <WYSIWYGEditor
                  captureBlur={this.handleDetailsBlur}
                  content={this.state.newAccomplishment.details.full}
                  editorStyles={{
                    maxWidth: "100%"
                  }}
                  controlStyles={{
                    maxWidth: "100%"
                  }} /> :
                <WYSIWYGEditor
                  captureBlur={this.handleDetailsBlur}
                  editorStyles={{
                    maxWidth: "100%"
                  }}
                  controlStyles={{
                    maxWidth: "100%"
                  }} />
            }
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

  handleDetailsBlur = content => {
    let { full } = this.state.newAccomplishment.details;
    full = content;

    const newAccomplishment = Object.assign({}, this.state.newAccomplishment, {
        details: Object.assign({}, this.state.newAccomplishment.details, {
          full
        })
    });

    this.setState({ newAccomplishment });
  }

  handleInputChange = e => {
    let { excerpt } = this.state.newAccomplishment.details;

    switch (e.target.name) {
      case "details.brief":
        excerpt = e.target.value;

        this.setState({
          newAccomplishment: Object.assign({}, this.state.newAccomplishment, {
            details: Object.assign({}, this.state.newAccomplishment.details, {
              excerpt
            })
          }) 
        });
        break;
      case "title":
        if (!this.state.newAccomplishment.slug && !this.props.edit) {
          this.slugInput.value = e.target.value.toLowerCase().split(" ").join("-");

          this.setState({
            newAccomplishment: Object.assign({}, this.state.newAccomplishment, {
              slug: this.slugInput.value
            })
          });
        }

        this.setState({ newAccomplishment: Object.assign({}, this.state.newAccomplishment, {
            "title": e.target.value
          })
        });

        break;
      default:
        this.setState({ newAccomplishment: Object.assign({}, this.state.newAccomplishment, {
          [e.target.name]: e.target.value
        })
      });
    }
  }

  handleAccomplishmentSave = e => {
    e.preventDefault();

    let { newAccomplishment } = this.state;

    if ("object" === typeof newAccomplishment.details.full) {
      // update student
      const accomplishments = Object.assign({}, this.state.student.accomplishments, {
        [newAccomplishment.slug]: newAccomplishment
      });

      this.props.studentActions.doStudentUpdate(this.state.student.uid, { accomplishments });

      if (this.props.doClose && "function" === typeof this.props.doClose)
        this.props.doClose();
    } else {
      this.setState({
        hasError: true,
        notificationClosed: false,
        error: "You need to provide full details of the accomplishment"
      });
    }
  }
}

AddAccomplishment.defaultProps = {
  edit: false
};

AddAccomplishment.propTypes = {
  students: propTypes.object,
  studentsActions: propTypes.object,
  student: propTypes.object,
  studentActions: propTypes.object,
  doClose: propTypes.func,
  edit: propTypes.bool,
  accomplishment: propTypes.object,
  slug: propTypes.string
};

const mapStateToProps = state => {
  return {
    students: state.students
  };
};

const mapDispatchToProps = dispatch => {
  return {
    studentsActions: bindActionCreators(studentsActions, dispatch),
    studentActions: bindActionCreators(studentActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddAccomplishment);