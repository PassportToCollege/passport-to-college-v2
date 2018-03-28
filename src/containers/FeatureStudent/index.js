import "./FeatureStudent.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as featureActions from "../../actions/featureActions";

import WYSIWYGEditor from "../../components/Editor";
import Button from "../../components/Button";
import Notification from "../../components/Notification";

class FeatureStudent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      student: props.student,
      notificationClosed: false,
      hasError: false,
      error: ""
    }
  }

  render() {
    return (
      <form className="feature_student" onSubmit={this.handleSubmit}>
        {
          this.state.hasError && !this.state.notificationClosed ?
            <Notification text={this.state.error}
              doClose={this.handleNotificationClose} /> :
            null
        }
        <section className="feature_student__section">
          <h3 className="section_heading">1. student</h3>
          <div className="form__input_container">
            <label>UID</label>
            <input type="text" disabled value={this.state.student.uid} />
          </div>
          <div className="form__input_container">
            <label>Full name</label>
            <input type="text" disabled value={this.state.student.user.name.full} />
          </div>
        </section>
        <section className="feature_student__section">
          <h3 className="section_heading">2. excerpt</h3>
          <textarea name="excerpt" required rows="5"
            onBlur={this.handleInputChange}></textarea>
        </section>
        <section className="feature_student__section">
          <h3 className="section_heading">3. full details</h3>
          <WYSIWYGEditor
            captureBlur={this.handleDetailsBlur}
            editorStyles={{
              maxWidth: "100%"
            }}
            controlStyles={{
              maxWidth: "100%"
            }} />
        </section>
        <section className="feature_student__section">
          <h3 className="section_heading">4. expiration</h3>
          <div className="form__input_container">
            <label>Date</label>
            <input type="date" name="expDate" required />
          </div>
        </section>
        <section className="feature_student__section">
          <div className="form__input_container">
            <Button type="submit" solid
              text="save feature" />
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
}

FeatureStudent.propTypes = {
  student: propTypes.object,
  featureActions: propTypes.object
};

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    featureActions: bindActionCreators(featureActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeatureStudent);

