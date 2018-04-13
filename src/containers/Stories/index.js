import "./Stories.css";

import React, { Component} from "react";
import { connect} from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";

class Stories extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentWillMount() {
    this.props.updateLocation("stories");
  }

  render() {
    return (
      <div className="stories">
        stories
      </div>
    );
  }
}

Stories.propTypes = {
  updateLocation: propTypes.func
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stories);