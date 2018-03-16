import "./ApplicationSection.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";
import moment from "moment";

// import * as avatarActions from "../../../../actions/avatarActions";

import AnnotatedList from "../../../../components/AnnotatedList";
import LoadingText from "../../../../components/LoadingText";
import Loader from "../../../../components/Loader";

class ApplicationSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      applicationId: props.applicationId,
      section: props.section,
      application: props.application.application,
      // profilePicture: props.avatar.url
    };
  }

  render() {
    return this._render(this.props.section);
  }

  _render = section => {
    switch (section) {

      case "information":
      default:
        return (
          <div className="application__section information__section">
            <div className="application__section_left">
              <div className="application__personal">
                <h2>Personal information</h2>
                {
                  this.props.application.hasGotten && this.state.application ?
                    <AnnotatedList data={[
                      { label: "full name", text: this.state.application.user.name.full },
                      { label: "dob", text: moment(this.state.application.user.dob).format("MM-DD-Y") },
                      { label: "email", text: this.state.application.user.email },
                      { label: "phone", text: this.state.application.user.phone },
                      { label: "gender", text: this.state.application.user.gender },
                      { label: "country", text: this.state.application.user.address.country }
                    ]} />
                  :
                    <LoadingText options={{
                      class: "block__lines",
                      bg: "transparent",
                      height: "10px",
                      lines: [
                        { color: "rgba(255,101,97,0.2)", width: "80%" },
                        { color: "rgba(255,101,97,0.4)", width: "70%" },
                        { color: "rgba(255,101,97,0.2)", width: "80%" },
                        { color: "rgba(255,101,97,0.4)", width: "90%" },
                        { color: "rgba(255,101,97,0.4)", width: "70%" },
                        { color: "rgba(255,101,97,0.2)", width: "80%" }
                      ]
                    }} />
                }
              </div>
              <div className="application__personal">
                <h2>Education information</h2>
                {
                  this.props.application.hasGotten && this.state.application ?
                    <AnnotatedList data={[
                      { label: "highest education level", text: this.state.application.educationLevel },
                      { label: "last school", text: this.state.application.lastSchool },
                      { label: "gpa", text: this.state.application.gpa }
                    ]} />
                    :
                    <LoadingText options={{
                      class: "block__lines",
                      bg: "transparent",
                      height: "10px",
                      lines: [
                        { color: "rgba(255,101,97,0.2)", width: "80%" },
                        { color: "rgba(255,101,97,0.4)", width: "70%" },
                        { color: "rgba(255,101,97,0.2)", width: "80%" },
                        { color: "rgba(255,101,97,0.4)", width: "90%" },
                        { color: "rgba(255,101,97,0.4)", width: "70%" }
                      ]
                    }} />
                }
              </div>
            </div>
            <div className="application__section_right">
              {/* <div className="application__profile_picture">
                {
                  this.props.avatar.hasGotten && this.state.profilePicture ?
                    <img src={this.state.profilePicture} alt="profile" />
                  :
                    <Loader />
                }
              </div> */}
              <div className="application__misc">
                <h2>Miscellaneous</h2>
                {
                  this.props.application.hasGotten && this.state.application ?
                    <AnnotatedList data={[
                      { label: "family income", text: this.state.application.income },
                      { label: "work ethic", text: this.state.application.workEthic },
                      { label: "interest", text: this.state.application.interest },
                    ]} />
                    :
                    <LoadingText options={{
                      class: "block__lines",
                      bg: "transparent",
                      height: "10px",
                      lines: [
                        { color: "rgba(255,101,97,0.2)", width: "80%" },
                        { color: "rgba(255,101,97,0.4)", width: "70%" },
                        { color: "rgba(255,101,97,0.2)", width: "80%" }
                      ]
                    }} />
                }
              </div>
              <div className="application__misc">
                <h2>Meta</h2>
                {
                  this.props.application.hasGotten && this.state.application ?
                    <AnnotatedList data={[
                      { label: "started", text: moment(this.state.application.startedOn).format("MM-DD-Y") },
                      { label: "submitted", text: moment(this.state.application.submittedOn).format("MM-DD-Y") },
                      { label: "state", text: this.state.application.state }
                    ]} />
                    :
                    <LoadingText options={{
                      class: "block__lines",
                      bg: "transparent",
                      height: "10px",
                      lines: [
                        { color: "rgba(255,101,97,0.2)", width: "80%" },
                        { color: "rgba(255,101,97,0.4)", width: "70%" },
                        { color: "rgba(255,101,97,0.4)", width: "50%" }
                      ]
                    }} />
                }
              </div>
            </div>
          </div>
        )
    }
  }

  componentWillMount() {
    // if (this.state.section === "information")
    //   this.props.avatarActions.doAvatarGet(this.state.applicationId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.section)
      this.setState({ section: nextProps.section });

    if (nextProps.application.hasGotten)
      this.setState({ application: nextProps.application.application });
    
    // if (nextProps.avatar.hasGotten)
    //   this.setState({ profilePicture: nextProps.avatar.url });
  }
}

ApplicationSection.propTypes = {
  applicationId: propTypes.string,
  section: propTypes.string,
  application: propTypes.object,
  // avatarActions: propTypes.object,
  // avatar: propTypes.object
};

const mapStateToProps = state => {
  return {
    // avatar: state.avatar
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // avatarActions: bindActionCreators(avatarActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationSection);