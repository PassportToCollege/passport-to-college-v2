import './Apply.css';

import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  ApplyProps as Props,
  ApplyState as State,
  mapStateToProps,
  mapDispatchToProps
} from './props';
import NotificationsManager from '../../models/NotificationsManager';
import iNotification, { NotificationType } from '../../imodels/iNotification';
import Strings from '../../constants/strings';
import iUser from '../../imodels/iUser';
import SignInForm from '../../components/Forms/SignInForm';
import StartApplication from '../../components/Forms/StartApplicationForm';
import Notification from '../../components/Notification';
import PageMeta from '../../components/PageMeta';
import { ValidProvider } from '../../actions/auth/dispatchers';
import User from '../../models/User';
import { uid } from 'rand-token';

class Apply extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      name: '',
      notificationsManager: new NotificationsManager()
    };
  }

  private updateEmail = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ email: e.target.value });
  private updatePassword = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ password: e.target.value });
  private updateName = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ name: e.target.value });

  private handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password } = this.state;
    this.props.signIn(email, password);
  }

  private handleSocialSignIn = (provider: ValidProvider) => this.props.signInWithSocial(provider);
  private handleSocialSignUp = (provider: ValidProvider) => this.props.signUpWithSocial(provider);

  private handleAccountCreation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password } = this.state;
    const newUser = new User({
      uid: uid(20),
      isApplicant: true,
      email,
      name,
    });

    this.props.createAccount(email, password, newUser);

    // reset form
    e.currentTarget.reset();
  }

  private handleNotificationClose = () => this.state.notificationsManager.close();

  public componentDidMount() {
    this.props.updateLocation('apply');
  }

  public componentWillUnmount() {
    this.state.notificationsManager.cleanUp();
  }

  public componentDidUpdate(prevProps: Props) {
    const { auth } = this.props;

    if (auth.failedToCreateAccount && prevProps.auth.isCreatingAccount) {
      const notification: iNotification = {
        type: NotificationType.AuthAccountCreationError,
        message: auth.error!.message,
        isClosed: false,
        isError: true
      };

      this.state.notificationsManager.add(notification);
    }

    if (
      (auth.failedToSignInWithSocial && prevProps.auth.signingInWithSocial) ||
      (auth.failedToSignUpWithSocial && prevProps.auth.signingUpWithSocial)
    ) {
      const notification: iNotification = {
        type: NotificationType.AuthAccountCreationError,
        message: Strings.AuthError_Generic,
        isClosed: false,
        isError: true
      };

      // tslint:disable-next-line:switch-default
      switch (auth.error!.message) {
        case 'user type mismatch':
          notification.message = Strings.AuthError_UserTypeMismatch;
          break;
        case 'user already exists':
          notification.message = Strings.AuthError_UserAlreadyExists;
          break;
      }

      this.state.notificationsManager.add(notification);
    }

    if (auth.hasSent && prevProps.auth.isSending) {
      const notification: iNotification = {
        type: NotificationType.AuthAccountCreated,
        message: Strings.AuthSuccess_AccountCreated,
        isClosed: false,
        isError: false
      };

      this.state.notificationsManager.add(notification);
    }

    if ((auth.hasAuthorized || auth.hasSignedInWithSocial) && prevProps.auth.isAuthorizing) {
      let { activeUser } = auth;
      
      if (typeof activeUser !== 'boolean' && activeUser) {
        activeUser = activeUser as iUser;
        this.props.history.push(`/apply/p/${activeUser.uid}`);
      }
    }
  }

  public render() {
    const notification = this.state.notificationsManager.hasOpenNotifications();

    return (
      <div className="apply__container">
        <PageMeta route="APPLY" />
        <SignInForm 
          title="Continue Application"
          subtitle="Or with your email"
          submitText="Continue"
          handleSubmit={this.handleSignIn}
          handleSocialSignIn={this.handleSocialSignIn}
          updateEmail={this.updateEmail}
          updatePassword={this.updatePassword} 
          authError={!!this.state.notificationsManager.hasOpenErrorNotifications()}
          isWorking={!!this.props.auth.isAuthorizing} 
        />

        <StartApplication
          title="Start New Application"
          subtitle="Or with your email:"
          handleAccountCreation={this.handleAccountCreation}
          handleSocialSignUp={this.handleSocialSignUp}
          updateName={this.updateName}
          updateEmail={this.updateEmail}
          updatePassword={this.updatePassword}
          isWorking={!!this.props.auth.isCreatingAccount} 
        />

        {
          notification !== null ?
          <Notification doClose={this.handleNotificationClose} text={notification.message} /> :
          null
        }
      </div>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Apply)
);
