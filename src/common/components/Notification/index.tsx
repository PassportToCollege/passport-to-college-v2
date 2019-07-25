import './Notification.css';

import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/fontawesome-free-solid';

interface NotificationProps {
  text: string;
  doClose: () => void;
};

export default class Notification extends Component<NotificationProps, any> {
  public notification: any;

  public componentDidMount() {
    setTimeout(() => {
      if (this.notification) {
        this.closeNotification();
      }
    }, 10000);
  }

  public render() {
    return (
      <div 
        className="notification" 
        ref={div => this.notification = div}
      >
        <p>{this.props.text}</p>
        <span onClick={this.closeNotification}><FontAwesomeIcon icon={faTimes} /></span>
      </div>
    )
  }

  public closeNotification = () => {
    this.notification.classList.add('close');

    if (this.props.doClose && 'function' === typeof this.props.doClose) {
      this.props.doClose();
    }
  }
}
