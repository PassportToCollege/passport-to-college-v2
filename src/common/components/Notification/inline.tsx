import './Notification.css';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/fontawesome-free-solid';

import Notification from './index';

export class InlineNotification extends Notification {
  public render() {
    return (
      <div 
        className="notification__inline" 
        ref={div => this.notification = div}
      >
        <p>{this.props.text}</p>
        <span onClick={this.closeNotification}><FontAwesomeIcon icon={faTimes} /></span>
      </div>
    )
  }
}