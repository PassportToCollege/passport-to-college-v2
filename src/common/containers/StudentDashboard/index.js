import "./StudentDashboard.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";
import _ from "lodash";

import * as studentActions from "../../actions/studentActions";
import * as userProfilePictureActions from "../../actions/userProfilePictureActions";
import { activeUser } from "../../utils";

import NavigationDashboard from "../NavigationDashboard";
import PageMeta from "../../components/PageMeta";
import FlexContainer from "../../components/FlexContainer";
import ImageUploader from "../../components/ImageUploader";

import defAvatar from "../../assets/images/default-gravatar.png";

class StudentDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      student: props.student.student,
      picture: defAvatar
    };
  }

  static propTypes = {
    student: propTypes.object,
    studentActions: propTypes.object,
    updateLocation: propTypes.func,
    menu: propTypes.object,
    menuActions: propTypes.object
  }

  componentDidMount() {
    this.props.updateLocation("dashboard student");
    this.props.studentActions.doStudentGet(activeUser());
  }

  static getDerivedStateFromProps(props, state) {
    if (props.student.hasGotten &&
    !_.isEqual(state.student, props.student.student)) {
      return {
        student: props.student.student
      };
    }

    if (props.profilePicture.hasGotten) {
      return {
        picture: props.profilePicture.url
      }
    }

    return null;
  }

  render() {
    return (
      <div className="student_dashboard" data-menu-state={this.props.menu.dash}>
        {
          this.state.student ?
            <PageMeta>
              <title>{this.state.student.user.name.full} | Student Dashboard | Passport to College</title>
            </PageMeta> :
            <PageMeta route="STUDENT_DASHBOARD" />
        }
        <NavigationDashboard student />
        <main>
          <header></header>
          {this.renderProfile()}
        </main>
      </div>
    )
  }

  renderProfile() {
    return (
      <FlexContainer classes={["student_dashboard__container", "student_dashboard__profile"]}>
        <section>
          <ImageUploader default={this.state.picture}
            onUpload={this.handleProfilePictureChange} />
        </section>
        <section></section>
      </FlexContainer>
    )
  }
}

const mapStateToProps = state => {
  return {
    student: state.student,
    menu: state.menu,
    profilePicture: state.userProfilePicture
  };
};

const mapDispatchToProps = dispatch => {
  return {
    studentActions: bindActionCreators(studentActions, dispatch),
    userPPActions: bindActionCreators(userProfilePictureActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentDashboard);