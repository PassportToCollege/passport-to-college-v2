import "./Scholars.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";

import * as usersActions from "../../actions/userActions";

import ToTopContainer from "../../components/ToTopContainer";
import PageMeta from "../../components/PageMeta";

class Scholars extends Component {
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
    this.props.updateLocation("scholars");
  }

  render() {
    return (
      <ToTopContainer classes="scholars__container reset__body_top_padding">
        <PageMeta route="SCHOLARS" />
        <header>
          header
        </header>
      </ToTopContainer>
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
)(Scholars);