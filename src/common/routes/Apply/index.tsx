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
import { SignInForm, StartApplication } from '../../../components/Forms';
import Notification from '../../../components/Notification';
import PageMeta from '../../../components/PageMeta';

class Apply extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      notificationsManager: new NotificationsManager()
    };
  }

  public componentDidMount() {
    this.props.updateLocation('apply');
  }

  public componentWillUnmount() {
    this.state.notificationsManager.cleanUp();
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    const { auth } = this.props;

    if (auth.failedToCreateAccount && prevProps.auth.isCreatingAccount) {
      const notification: iNotification = {
        type: NotificationType.AuthAccountCreationError,
        message: auth.error!.message,
        isClosed: false
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
        isClosed: false
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
        isClosed: false
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
          authError={this.state.hasError}
          isWorking={this.state.loggingIn} />

        <StartApplication
          title="Start New Application"
          subtitle="Or with your email:"
          handleAccountCreation={this.handleAccountCreation}
          handleSocialSignUp={this.handleSocialSignUp}
          updateName={this.updateName}
          updateEmail={this.updateEmail}
          updatePassword={this.updatePassword}
          isWorking={this.state.creatingAccount} />

        {
          this.state.hasError && !this.state.notificationClosed ?
          <Notification doClose={this.handleNotificationClose} text={this.state.error} /> :
          null
        }
        {
          this.state.hasSent && !this.state.notificationClosed ?
            <Notification doClose={this.handleNotificationClose}
              text="Account created! You may now sign in using the continue application form." />
            :
            null
        }
      </div>
    );
  }

  public updateEmail = (e) => this.setState({ email: e.target.value });
  public updatePassword = (e) => this.setState({ password: e.target.value });
  public updateName = (e) => this.setState({ name: e.target.value });

  public handleSignIn = (e) => {
    e.preventDefault();

    const { email, password } = this.state;

    this.props.authActions.doSignIn(email, password, {
      strict: 'isApplicant'
    });
  }

  public handleSocialSignIn = (provider) => {
    this.props.authActions.doSignInWithSocial(provider, {
      strict: 'isApplicant'
    });
  }

  public handleSocialSignUp = (provider) => {
    this.props.authActions.doSignUpWithSocial(provider, {
      applicant: true,
      emailConfirmed: true
    });
  }

  public handleAccountCreation = (e) => {
    e.preventDefault();

    const data = {
      isApplicant: true,
      email: this.state.email,
      name: this.state.name,
      password: this.state.password
    };

    this.props.authActions.doAccountCreate(data);

    // reset form
    e.target.reset();
  }

  public handleNotificationClose = () => {
    this.setState({ notificationClosed: true, hasError: false, hasSent: false });
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Apply)
);
