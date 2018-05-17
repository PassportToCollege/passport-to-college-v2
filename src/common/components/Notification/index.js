import "./Notification.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/fontawesome-free-solid";

class Notification extends Component {
  componentDidMount() {
    // close notification automatically after
    // 5 secs
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

Notification.propTypes = {
  text: propTypes.string,
  doClose: propTypes.func
};

export default Notification;

