import React, { Component } from "react";
import propTypes from "prop-types";

import { makeClassString } from "../../utils";

class Form extends Component {
  static propTypes = {
    children: propTypes.any,
    doSubmit: propTypes.func,
    classes: propTypes.arrayOf(propTypes.string),
    reset: propTypes.bool
  }

  getSnapshotBeforeUpdate(props) {
    if (!props.reset && this.props.reset) {
      return { resetForm: true };
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot && snapshot.resetForm) {
      this.formRef.reset();
    }
  }

  render() {
    return (
      <form className={makeClassString(this.props.classes)}
        onSubmit={this.handleSubmit}
        ref={form => this.formRef = form}>
        {this.props.children}
      </form>
    );
  }

  handleSubmit = e => {
    if ("function" === typeof this.props.doSubmit)
      this.props.doSubmit(e);
  }
}

export default Form;