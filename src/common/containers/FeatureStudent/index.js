import "./FeatureStudent.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";
import moment from "moment";

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
      error: "",
      editing: props.editing,
      feature: props.feature,
      newFeature: {
        student: props.student.uid,
        name: props.student.user.name.full,
        details: props.editing ? props.feature.details : "",
        createdAt: props.editing ? props.feature.createdAt : new Date(moment().add(30, "days").toDate()).getTime(),
        expDate: props.editing ?
          props.feature.expDate : 
          new Date(moment().add(30, "days").toDate()).getTime()
      }
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
          <h3 className="section_heading">2. details</h3>
          <label>Provide the details about why this student is being featured. This is what readers will see.</label>
          {
            this.state.editing ?
              <WYSIWYGEditor
                content={this.state.feature.details}
                captureBlur={this.handleDetailsBlur}
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
        </section>
        <section className="feature_student__section">
          <h3 className="section_heading">3. expiration</h3>
          <div className="form__input_container">
            <label>Default is 30 days from today.</label>
            <input type="date" name="expDate" required 
              defaultValue={moment(this.state.newFeature.expDate).format("Y-MM-DD")}
              onBlur={this.handleInputChange} />
          </div>
        </section>
        <section className="feature_student__section">
          <div className="form__input_container">
            <Button type="submit" solid
              text="save feature" 
              doClick={this.handleFeatureSave} />
          </div>
        </section>
      </form>
    )
  }

  handleDetailsBlur = content => {
    this.setState({ newFeature: Object.assign({}, this.state.newFeature, {
        details: content
      }) 
    });
  }

  handleInputChange = e => {
    if (e.target.name === "expDate") {
      this.setState({
        newFeature: Object.assign({}, this.state.newFeature, {
          [e.target.name]: new Date(e.target.value).getTime()
        })
      });
    } else {
      this.setState({
        newFeature: Object.assign({}, this.state.newFeature, {
          [e.target.name]: e.target.value
        })
      });
    }
  }

  handleFeatureSave = e => {
    e.preventDefault();

    const { newFeature } = this.state;

    if ("object" === typeof newFeature.details) {
      if (this.state.editing) {
        this.props.featureActions.doFeatureUpdate(this.state.feature.fid, newFeature, {
          refresh: true,
          student: this.state.student.uid
        });
      } else {
        this.props.featureActions.doCreateFeature(newFeature, { refresh: true });
      }

      if ("function" === typeof this.props.doClose)
        this.props.doClose();
    } else {
      this.setState({
        hasError: true,
        notificationClosed: false,
        error: "You need to provide full details of the feature"
      });
    }
  }

  handleNotificationClose = () => {
    this.setState({
      notificationClosed: true,
      hasError: false,
      error: ""
    })
  }
}

FeatureStudent.defaultProps = {
  editing: false
};

FeatureStudent.propTypes = {
  student: propTypes.object,
  featureActions: propTypes.object,
  doClose: propTypes.func,
  editing: propTypes.bool,
  feature: propTypes.object
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

