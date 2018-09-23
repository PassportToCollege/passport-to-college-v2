import "./AboutUs.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";

import * as usersActions from "../../actions/usersActions";

import Header from "../../components/Header";

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
      <React.Fragment>
        <Header 
          scrollEl="about_main"
          background={headerImage} />
        <main id="about_main">

        </main>
      </React.Fragment>
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