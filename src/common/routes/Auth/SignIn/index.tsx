import './SignIn.css';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import {
  SignInProps as Props,
  SignInState as State,
  mapStateToProps,
  mapDispatchToProps
} from './props';
import PageMeta from '../../../components/PageMeta';
import { SignInForm } from '../../../components/Forms';
import Notification from '../../../components/Notification';
import iNotification, { NotificationType } from '../../../imodels/iNotification';
import Strings from '../../../constants/strings';
import NotificationsManager from '../../../models/NotificationsManager';
import { ValidProvider } from '../../../actions/auth/dispatchers';

class SignIn extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      notificationsManager: new NotificationsManager()
    };
  }

  private updateEmail = (e: React.ChangeEvent<HTMLInputElement>) => 
    this.setState({ email: e.target.value })

  public updatePassword = (e: React.ChangeEvent<HTMLInputElement>) => 
    this.setState({ password: e.target.value })

  public handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password } = this.state;

    this.props.signIn(email, password);
    this.setState({ email: '', password: ''});
  }

  public handleSocialSignIn = (provider: ValidProvider) =>
    this.props.signInWithSocial(provider)

  public handleNotificationClose = () =>
    this.state.notificationsManager.cleanUp()

  public componentDidMount() {
    this.props.updateLocation('sign-in');
  }

  public componentDidUpdate(prevProps: Props) {
    if ((prevProps.auth.isAuthorizing || prevProps.auth.signingInWithSocial) &&
    (this.props.auth.failedToAuthorize || this.props.auth.failedToSignInWithSocial)) {
      const notification: iNotification = {
        isClosed: false,
        isError: true,
        type: NotificationType.AuthError,
        message: this.props.auth.error ? 
          this.props.auth.error.message : Strings.AuthError_Generic
      };

      this.state.notificationsManager.add(notification);
    }

    if ((prevProps.auth.isAuthorizing || prevProps.auth.signingInWithSocial) &&
      (this.props.auth.hasAuthorized || this.props.auth.hasSignedInWithSocial)) {
        const { activeUser } = this.props.auth;

        if (activeUser && 'boolean' !== typeof activeUser) {
          if (activeUser.isAdmin) {
            this.props.history.push('/admin/dashboard');
          } else if (activeUser.isApplicant) {
            this.props.history.push('/admin/dashboard');
          } else {
            this.props.history.push('/');
          }
        }
    }
  }

  public render() {
    return (
      <div className="signin__container">
        <PageMeta route="SIGN_IN" />
        <SignInForm 
          title={Strings.SignIn} 
          subtitle={Strings.SignInWithEmail}
          handleSubmit={this.handleSignIn}
          handleSocialSignIn={this.handleSocialSignIn}
          updateEmail={this.updateEmail}
          updatePassword={this.updatePassword} 
          authError={!!this.state.notificationsManager.hasOpenNotifications()} 
          isWorking={!!this.props.auth.isAuthorizing || !!this.props.auth.signingInWithSocial}
        />
        {
          this.state.notificationsManager.hasOpenNotificationOfType(NotificationType.AuthError) ?
            <Notification 
              doClose={this.handleNotificationClose} 
              text={this.state.notificationsManager.getMessageOfNotificationOfType(NotificationType.AuthError)} 
            /> : null
        }
      </div>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps)(SignIn)
);