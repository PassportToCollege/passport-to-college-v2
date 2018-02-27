import "./Notification.css";

import React from "react";
import propTypes from "prop-types";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/fontawesome-free-solid";

const Notification = props => {
  const closeNotification = () => {
    this.notification.classList.add("close");

    if (props.doClose && "function" === typeof props.doClose)
      props.doClose();
  }

  return (
    <div className="notification" ref={div => this.notification = div}>
      <p>{props.text}</p>
      <span onClick={closeNotification}><FontAwesomeIcon icon={faTimes} /></span>
    </div>
  )
}

Notification.propTypes = {
  text: propTypes.string,
  doClose: propTypes.func
};

export default Notification;

