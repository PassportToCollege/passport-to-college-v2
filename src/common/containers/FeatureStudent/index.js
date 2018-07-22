import "./FeatureStudent.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";
import moment from "moment";

import * as featureActions from "../../actions/featureActions";

import WYSIWYGEditor from "../../components/Editor";
import DropUploader from "../../components/DropUploader";
import Button from "../../components/Button";
import Notification from "../../components/Notification";
import Modal from "../../components/Modal";
import Input from "../../components/Input";

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
        excerpt: props.editing ? props.feature.excerpt : "",
        details: props.editing ? props.feature.details : "",
        createdAt: props.editing ? props.feature.createdAt : new Date(moment().add(30, "days").toDate()).getTime(),
        expDate: props.editing ?
          props.feature.expDate : 
          new Date(moment().add(30, "days").toDate()).getTime()
      }
    }
  }

  static propTypes = {
    student: propTypes.object,
    featureActions: propTypes.object,
    doClose: propTypes.func,
    editing: propTypes.bool,
    feature: propTypes.object,
  }

  static defaultProps = {
    editing: false
  }

  render() {
    return (
      <Modal classes={["modal__feature_student"]}
        doClose={this.handleModalClose}>
        <main className="feature_student">
          {
            this.state.hasError && !this.state.notificationClosed ?
              <Notification text={this.state.error}
                doClose={this.handleNotificationClose} /> :
              null
          }
          <section className="feature_student__section">
            <h6>Note:</h6>
            <p>A student feature is a special type of post/story. It will be rendered as a story on the website under the <i>Features</i> category and will always be available for reading even after expiration. The expiration date determines how long the student will appear on the websites homepage under the <i>Featured Students</i> section.</p>
          </section>
          <section className="feature_student__section">
            <h5 className="section_heading">1. Student</h5>
            <div className="form__input_container">
              <label>UID</label>
              <Input inputType="text" inputDisabled inputDefault={this.state.student.uid} />
            </div>
            <div className="form__input_container">
              <label>Full name</label>
              <Input inputType="text" inputDisabled inputDefault={this.state.student.user.name.full} />
            </div>
          </section>
          <section className="feature_student__section">
            <h5 className="section_heading">2. Hero Image</h5>
            <label>This is an optional hero image for the feature. It will appear after the feature title when a user opens the feature.</label>
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
          <section className="feature_student__section">
            <h5 className="section_heading">3. Excerpt</h5>
            <label>Provide an excerpt of the feature&apos;s full details. It is usually the first paragragh of the full details, or the first couple sentences. This is what readers will see as a preview on the <i>Stories</i> page. Try to keep your excerpt under 100 words.</label>
            <textarea name="excerpt" rows="5"
              onChange={this.handleInputChange}
              value={this.state.newFeature.excerpt}></textarea>
          </section>
          <section className="feature_student__section">
            <h5 className="section_heading">4. Full Details</h5>
            <label>Provide the full details about why this student is being featured. This is what readers will see.</label>
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
            <h5 className="section_heading">5. Expiration</h5>
            <div className="form__input_container">
              <label>Default is 30 days from today.</label>
              <Input inputType="date" inputName="expDate" 
                inputDefault={moment(this.state.newFeature.expDate).format("Y-MM-DD")}
                whenBlur={this.handleInputChange} />
            </div>
          </section>
          <section className="feature_student__section">
            <div className="form__input_container">
              <Button type="button" solid
                text="save feature" 
                doClick={this.handleFeatureSave} />
            </div>
          </section>
        </main>
      </Modal>
    )
  }

  handleModalClose = () => {
    if ("function" === typeof this.props.doClose)
      this.props.doClose();
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

  handleHeroImageChange = e => {
    
  }

  handleFeatureSave = () => {
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

