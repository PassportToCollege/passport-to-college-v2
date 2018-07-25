import "./FeatureStudent.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";
import moment from "moment";

import { verifyImageDimensions } from "../../utils";
import { auth } from "../../utils/firebase";
import { Feature } from "../../utils/utilityClasses";
import * as featureActions from "../../actions/featureActions";
import * as postActions from "../../actions/postActions";
import * as postCategoryActions from "../../actions/postCategoryActions";

import WYSIWYGEditor from "../../components/Editor";
import DropUploader from "../../components/DropUploader";
import Button from "../../components/Button";
import { InlineNotification } from "../../components/Notification";
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
    postActions: propTypes.object,
    postCategoryActions: propTypes.object
  }

  static defaultProps = {
    editing: false
  }

  getSnapshotBeforeUpdate(props) {
    if (props.feature.isCreating && this.props.feature.hasCreated) {
      return {
        createdFeature: true
      };
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot && snapshot.createdFeature) {
      this.handleModalClose();
    }
  }

  render() {
    return (
      <Modal classes={["modal__feature_student"]}
        doClose={this.handleModalClose}>
        <main className="feature_student">
          <section className="feature_student__section">
            <h6>Note:</h6>
            <p>A student feature is a special type of post/story. It will be rendered as a story on the website under the <i>Features</i> category and will always be available for reading even after expiration. The expiration date determines how long the student will appear on the website&apos;s homepage under the <i>Featured Students</i> section.</p>
          </section>
          <section className="feature_student__section">
            <h5 className="section_heading">1. Student</h5>
            <label>UID</label>
            <Input inputType="text" inputDisabled inputDefault={this.state.student.uid} />
            <label>Full name</label>
            <Input inputType="text" inputDisabled inputDefault={this.state.student.user.name.full} />
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
            {
              this.state.hasExcerptNotification && !this.state.excerptNotificationClosed ?
                <InlineNotification text={this.state.excerptNotification}
                  doClose={this.closeExcerptNotification} /> : null
            }
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
            {
              this.state.hasDetailsNotification && !this.state.detailsNotificationClosed ?
                <InlineNotification text={this.state.detailsNotification}
                  doClose={this.closeDetailsNotification} /> : null
            }
          </section>
          <section className="feature_student__section">
            <h5 className="section_heading">5. Expiration</h5>
            <label>Default is 30 days from today.</label>
            <Input inputType="date" inputName="expDate" 
              inputDefault={moment(this.state.newFeature.expDate).format("Y-MM-DD")}
              whenBlur={this.handleInputChange} />
          </section>
          <section className="feature_student__section">
            <Button type="button" solid
                text="cancel" 
                doClick={this.handleModalClose} 
                styles={{
                  backgroundColor: "rgb(128, 150, 162)",
                  marginRight: "1em"
                }} />
            <Button type="button" solid
              text="save feature" 
              doClick={this.handleFeatureSave} />
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
    if (e.name === "expDate") {
      this.setState({
        newFeature: Object.assign({}, this.state.newFeature, {
          [e.name]: new Date(e.value).getTime()
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
    verifyImageDimensions(e)
      .then(({ image, url }) => {
        this.setState({ 
          hero: url,
          newFeature: Object.assign({}, this.state.newFeature, {
            hero: image
          }) 
        });
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  handleFeatureSave = () => {
    const newFeature = new Feature({
      title: `Featured Student: ${this.state.student.user.name.full} (${moment.utc(moment(this.state.newFeature.createdAt)).format("MMM D, YYYY")})`,
      author: auth.currentUser.uid,
      excerpt: this.state.newFeature.excerpt,
      full: this.state.newFeature.details
    }, true, this.state.student.uid, this.state.newFeature.expDate);

    if (!newFeature.excerpt)
      return this.setExcerptErrorNotification();

    if (!newFeature.full)
      return this.setDetailsErrorNotification();

    if (this.state.newFeature.hero) {
      newFeature.hero = true;

      this.props.postActions.doHeroUpload(
        this.state.newFeature.hero,
        newFeature.id
      );
    }

    this.props.postCategoryActions.doCategoryPostsUpdate("student_features");

    this.props.featureActions.doCreateFeature(newFeature.data, {
      refresh: true
    });
  }

  setDetailsErrorNotification = () => {
    this.setState({
      hasDetailsNotification: true,
      detailsNotificationClosed: false,
      detailsNotification: "Full details required before saving this feature."
    });
  }

  closeDetailsNotification = () => {
    this.setState({
      hasDetailsNotification: false,
      detailsNotificationClosed: true,
      detailsNotification: null
    });
  }

  setExcerptErrorNotification = () => {
    this.setState({
      hasExcerptNotification: true,
      excerptNotificationClosed: false,
      excerptNotification: "An excerpt is required before saving this feature."
    });
  }

  closeExcerptNotification = () => {
    this.setState({
      hasExcerptNotification: true,
      excerptNotificationClosed: false,
      excerptNotification: null
    });
  }
}

const mapStateToProps = state => {
  return {
    feature: state.feature,
    post: state.post,
    postCategories: state.postCategories
  };
};

const mapDispatchToProps = dispatch => {
  return {
    featureActions: bindActionCreators(featureActions, dispatch),
    postActions: bindActionCreators(postActions, dispatch),
    postCategoryActions: bindActionCreators(postCategoryActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeatureStudent);

