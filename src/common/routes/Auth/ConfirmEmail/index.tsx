import './ConfirmEmail.css';

import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import {
  ConfirmEmailProps as Props,
  ConfirmEmailState as State,
  mapStateToProps,
  mapDispatchToProps
} from './props';
import NotificationsManager from '../../../models/NotificationsManager';
import PageMeta from '../../../components/PageMeta';
import Notification from '../../../components/Notification';
import LinkButton from '../../../components/LinkButton';
import iNotification, { NotificationType } from '../../../imodels/iNotification';
import Strings from '../../../constants/strings';

class ConfirmEmail extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      notificationsManager: new NotificationsManager(),
      emailConfirmed: false
    };
  }

  private handleNotificationClose = () => this.state.notificationsManager.cleanUp();

  public componentDidMount() {
    this.props.updateLocation('confirm-email');

    // confirm user's email address
    const { uid } = this.props.match.params;
    this.props.updateUser({ uid, emailConfirmed: true });
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.user.isUpdating && this.props.user.failedToUpdate) {
      const notification: iNotification = {
        type: NotificationType.UserErrorFailedToUpdate,
        isClosed: false,
        isError: true,
        message: this.props.user.error ? 
          this.props.user.error.message : ''
      };

      this.state.notificationsManager.add(notification);
    }

    if (prevProps.user.isGetting && this.props.user.hasGotten && this.props.user.hasUpdated) {
      const emailConfirmed = this.props.user.User ?
        !!this.props.user.User.emailConfirmed : false;

      this.setState({ emailConfirmed });
    }
  }

  public render() {
    return (
      <div className="confirm_email__container">
        <PageMeta route="CONFIRM_EMAIL_ADDRESS" />
        {
          this.props.user.isUpdating && !this.state.emailConfirmed ?
            <h1>{Strings.ConfirmEmail_ConfirmingEmail}</h1>
              :
            null
        }
        {
          this.state.emailConfirmed ?
            <div>
              <h1>{Strings.ConfirmEmail_ConfirmationSuccess}</h1>
              <LinkButton 
                target={`/apply/p/${this.props.match.params.uid}`}
                text={Strings.ConfirmEmail_Continue} 
              />
            </div>
            :
            null
        }
        {
          this.state.notificationsManager.hasOpenNotifications() ?
            <Notification 
              doClose={this.handleNotificationClose}
              text={
                this.state.notificationsManager
                  .getMessageOfNotificationOfType(NotificationType.UserErrorFailedToUpdate)
              } 
            /> : null
        }
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps)(ConfirmEmail);