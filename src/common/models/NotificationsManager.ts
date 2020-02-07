import iNotification, { NotificationType } from '../imodels/iNotification';
import { iStringNotificationPair } from '../imodels/iObjectTypes';

export default class NotificationsManager {
  private activeNotifications: iStringNotificationPair = {};

  constructor(notification?: iNotification) {
    if (notification) {
      this.activeNotifications[notification.type] = notification;
    }
  }

  public add(notification: iNotification) {
    this.activeNotifications[notification.type] = notification;
  }

  public close() {
    for (const notification of Object.keys(this.activeNotifications)) {
      if (!this.activeNotifications[notification].isClosed) {
        this.activeNotifications[notification].isClosed = true;
      }
    }
  }

  public cleanUp() {
    this.activeNotifications = {};
  }

  public hasNotificationOfType(type: NotificationType) {
    return !!this.activeNotifications[type];
  }

  public hasOpenNotifications(): iNotification | null {
    const keys = Object.keys(this.activeNotifications);

    if (keys.length) {
      for (const key of keys) {
        const notification = this.activeNotifications[key];
        if (!notification.isClosed) {
          return notification;
        }
      }
    }

    return null;
  }

  public hasOpenErrorNotifications(): iNotification | null {
    const keys = Object.keys(this.activeNotifications);

    if (keys.length) {
      for (const key of keys) {
        const notification = this.activeNotifications[key];

        if (notification.isError && !notification.isClosed) {
          return notification;
        }
      }
    }

    return null;
  }

  public hasOpenNotificationOfType(type: NotificationType) {
    return this.hasNotificationOfType(type) && !this.activeNotifications[type].isClosed;
  }

  public getNotificationOfType(type: NotificationType) {
    if (this.hasOpenNotificationOfType(type)) {
      return this.activeNotifications[type];
    }

    return null;
  }

  public getMessageOfNotificationOfType(type: NotificationType) {
    if (this.hasOpenNotificationOfType(type)) {
      return this.activeNotifications[type].message;
    }

    return '';
  }
}