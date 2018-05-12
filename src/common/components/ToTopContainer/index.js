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
    document.scrollingElement.scrollTo(0, 0);
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