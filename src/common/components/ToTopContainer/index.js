import React, { Component } from "react";
import propTypes from "prop-types";

class ToTopContainer extends Component {
  static propTypes = {
    children: propTypes.node,
    classes: propTypes.string
  }

  static defaultProps = {
    classes: ""
  }

  componentDidMount() {
    if ("function" === typeof document.scrollingElement.scrollTo) {
      document.scrollingElement.scrollTo(0, 0);
    } else {
      document.scrollingElement.scrollTop = 0;
    }
  }

  render() {
    return (
      <div className={`to_top_container ${this.props.classes}`}>
        {this.props.children}
      </div>
    )
  }
}
export default ToTopContainer;