import "./PastScholars.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";

import PageMeta from "../../../components/PageMeta";

class PastScholars extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  static propTypes = {}

  render() {
    return (
      <React.Fragment>
        <PageMeta route="SCHOLARS_PAST" />
      </React.Fragment>
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
)(PastScholars);