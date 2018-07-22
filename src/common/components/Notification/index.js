import "./Notification.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/fontawesome-free-solid";

export default class Notification extends Component {
  static propTypes = {
    text: propTypes.string,
    doClose: propTypes.func
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.notification)
        this.closeNotification();
    }, 10000);
  }

  render() {
    return (
      <div className="notification" ref={div => this.notification = div}>
        <p>{this.props.text}</p>
        <span onClick={this.closeNotification}><FontAwesomeIcon icon={faTimes} /></span>
      </div>
    )
  }

  closeNotification = () => {
    this.notification.classList.add("close");

    if (this.props.doClose && "function" === typeof this.props.doClose)
      this.props.doClose();
  }
}

export class InlineNotification extends Notification {
  render() {
    return (
      <div className="notification__inline" ref={div => this.notification = div}>
        <p>{this.props.text}</p>
        <span onClick={this.closeNotification}><FontAwesomeIcon icon={faTimes} /></span>
      </div>
    )
  }
}

