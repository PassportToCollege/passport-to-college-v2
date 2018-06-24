import "./DashComments.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";

class DashComments extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  static propTypes = {}

  render() {
    return (
      <div className="dashboard__container dash_comments__container"></div>
    )
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashComments);