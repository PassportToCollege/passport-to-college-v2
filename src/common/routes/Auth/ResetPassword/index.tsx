import './ResetPassword.css';

import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import {
  ResetPasswordProps as Props,
  ResetPasswordState as State,
  mapDispatchToProps,
  mapStateToProps
} from './props';
import NotificationsManager from '../../../models/NotificationsManager';
import PageMeta from '../../../components/PageMeta';
import { ResetPasswordForm } from '../../../components/Forms';
import Notification from '../../../components/Notification';
import iNotification, { NotificationType } from '../../../imodels/iNotification';
import Strings, { Format, iStrings, getValidString } from '../../../constants/strings';

class ResetPassword extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      email: '',
      notificationsManager: new NotificationsManager()
    };
  }

  private updateEmail = (e: React.ChangeEvent<HTMLInputElement>) => 
    this.setState({ email: e.target.value })

  public handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email } = this.state;
    this.props.sendResetPasswordEmail(email);
  }

  public handleNotificationClose = () =>
    this.state.notificationsManager.close()

  public componentDidMount() {
    this.props.updateLocation('reset');
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.auth.isSending) {
      const notification: iNotification = {
        type: NotificationType.AuthError,
        isClosed: false,
        isError: true,
        message: ''
      };

      if (this.props.auth.hasSent) {
        notification.type = NotificationType.AuthSuccess;
        notification.isError = false;
        notification.message = Format(
          getValidString('ResetPassword_EmailSent'), 
          [this.state.email]
        );
        
        this.state.notificationsManager.add(notification);
      }

      if (this.props.auth.failedToSendEmail) {
        notification.message = this.props.auth.error ? 
          this.props.auth.error.message : Strings.AuthError_Generic;
      }
    }
  }

  public render() {
    return (
      <div className="reset__container">
        <PageMeta route="RESET_PASSWORD" />
        <ResetPasswordForm 
          handleSubmit={this.handleSubmit}
          updateEmail={this.updateEmail}
          authError={!!this.state.notificationsManager.hasOpenErrorNotifications()} 
          title={Strings.ResetPassword_ProvideEmail}
        />
        {
          this.state.notificationsManager.hasOpenErrorNotifications() ?
            <Notification 
              doClose={this.handleNotificationClose} 
              text={this.state.notificationsManager.getMessageOfNotificationOfType(NotificationType.AuthError)}
            /> : null
        }
        {
          this.state.notificationsManager.hasNotificationOfType(NotificationType.AuthSuccess) ?
            <Notification 
              doClose={this.handleNotificationClose} 
              text={this.state.notificationsManager.getMessageOfNotificationOfType(NotificationType.AuthSuccess)} 
            /> : null
        }
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPassword);