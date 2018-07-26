import "./AddAccomplishment.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as studentsActions from "../../actions/studentsActions";
import * as studentActions from "../../actions/studentActions";

import Modal from "../../components/Modal";
import WYSIWYGEditor from "../../components/Editor";
import DropUploader from "../../components/DropUploader";
import Input from "../../components/Input";
import Button from "../../components/Button";

class AddAccomplishment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      students: props.students.students,
      student: props.student,
      newAccomplishment: {
        student: props.student.uid,
        name: props.student.user.name.full,
        title: "",
        excerpt: "",
        full: {},
        createdAt: new Date().getTime()
      },
      notificationClosed: false,
      hasError: false,
      error: ""
    }
  }

  componentDidMount() {
    this.props.studentsActions.doStudentsGet();
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.students.hasGotten) {
      return {
        students: nextProps.students.students
      }
    }

    return null;
  }

  render() {
    return (
      <Modal classes={["modal__add_accomplishment"]}
        doClose={this.props.doClose}>
        <main className="add_accomplishment">
          <section className="add_accomplishment__section">
            <h6>Note:</h6>
            <p>A student acomplishment is a special type of post/story. It will always be available for reading in the blog and will appear on the student&apos;s profile page. Unlike student features, accomplishments do not have expirations.</p>
          </section>
          <section className="add_accomplishment__section">
            <h5 className="section_heading">1. Student</h5>
            <label>UID</label>
            <Input inputType="text" inputDisabled inputDefault={this.state.student.uid} />
            <label>Full name</label>
            <Input inputType="text" inputDisabled inputDefault={this.state.student.user.name.full} />
          </section>
          <section className="feature_student__section">
            <h5 className="section_heading">2. Hero Image</h5>
            <label>This is an optional hero image for the accomplishment. It will appear after the accomplishment title when a user opens the accomplishment.</label>
            <DropUploader overlay
              label={<span><b>Choose a hero image</b> or drag it here</span>}
              uploaderStyles={{
                backgroundColor: "white",
                backgroundImage: `url(${this.state.hero})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                padding: "4em"
              }}
              handleAvatarChange={this.handleHeroImageChange} 
              dropAreaStyles={{
                background: "none",
                color: "#FFF",
                borderColor: "#FFF"
              }}
              labelStyles={{
                color: "#FFF"
              }} />
          </section>
          <section className="add_accomplishment__section">
            <h5 className="section_heading">3. Accomplishment Title</h5>
            <Input inputType="text" inputName="title"
              inputPlaceholder="Insert awesome title here"
              whenBlur={this.handleInputChange} />
          </section>
          <section className="add_accomplishment__section">
            <h5 className="section_heading">4. Excerpt</h5>
            <label>Provide an excerpt of the accomplishment&apos;s full details. It is usually the first paragragh of the full details, or the first couple sentences. This is what readers will see as a preview on the <i>Stories</i> page. Try to keep your excerpt under 100 words.</label>
            <textarea name="excerpt" rows="5"
              onChange={this.handleInputChange}
              value={this.state.newAccomplishment.excerpt} />
          </section>
          <section className="add_accomplishment__section">
            <h5 className="section_heading">5. Full Details</h5>
            <label>Provide the full details about this student&apos;s accomplishment. This is what readers will see when the open the accomplishment.</label>
            <WYSIWYGEditor
              captureBlur={this.handleDetailsBlur}
              editorStyles={{
                maxWidth: "100%"
              }}
              controlStyles={{
                maxWidth: "100%"
              }} />
          </section>
          <section className="add_accomplishment__section">
            <Button type="button" solid
              text="cancel" 
              doClick={this.props.doClose} 
              styles={{
                backgroundColor: "rgb(128, 150, 162)",
                marginRight: "1em"
              }} />
            <Button type="button" solid 
              text="save accomplishment" 
              doClisk={this.handleAccomplishmentSave} />
          </section>
        </main>
      </Modal>
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