import "./AboutUs.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";

import * as usersActions from "../../actions/usersActions";

import Header from "../../components/Header";
import TopicSection from "../../components/TopicSection";
import ToTopContainer from "../../components/ToTopContainer";

import headerImage from "../../assets/images/about_us__header.jpg";

class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  static propTypes = {
    users: propTypes.object,
    usersActions: propTypes.object,
    updateLocation: propTypes.func
  }

  componentDidMount() {
    this.props.updateLocation("about");
  }

  render() {
    return (
      <ToTopContainer>
        <Header 
          scrollEl="about_main"
          background={headerImage} />
        {this.renderMain()}
      </ToTopContainer>
    )
  }

  renderMain = () => {
    return (
      <main id="about_main">
        <TopicSection heading="about us"
        content={
          <p>
            We connect with students from all over the world who are beating the odds. Students who, against all types of challenges, have demonstrated tenacity, strong work ethics, will power, integrity and a burning desire to succeed.
          </p>
        } 
        sectionStyles={{
          width: "1140px",
          maxWidth: "100%",
          margin: "0 auto"
        }} />
      </main>
    )
  }
}

const mapStateToProps = state => {
  return {
    users: state.users
  };
};

const mapDispatchToProps = dispatch => {
  return {
    usersActions: bindActionCreators(usersActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AboutUs);