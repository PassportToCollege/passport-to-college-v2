import './ApplicationPortal.css';

import React, { PureComponent } from 'react';
import { NavLink, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as routes from '../../../constants/routes';
import {
  ApplyPortalProps as Props,
  ApplyPortalState as State,
  mapDispatchToProps,
  mapStateToProps,
  ApplicationTasks,
  ApplicationTaskTracker
} from './props';
import NotificationsManager from '../../../models/NotificationsManager';
import Button from '../../../components/Button';
import LinkButton from '../../../components/LinkButton';
import ApplicationTask from './ApplicationTask';
import Notification from '../../../components/Notification';
import PageMeta from '../../../components/PageMeta';
import iNotification, { NotificationType } from '../../../imodels/iNotification';
import { getWordCount } from '../../../utils';
import Strings from '../../../constants/strings';

class ApplicationPortal extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      applicationId: this.props.match.params.applicationId,
      activeTask: ApplicationTasks.Welcome,
      tasksTracker: new ApplicationTaskTracker(),
      notificationsManager: new NotificationsManager()
    };
  }

  private readonly tasks: ApplicationTasks[] = Object.keys(ApplicationTasks) as ApplicationTasks[];

  private updateTasksCompletion() {
    const application = this.props.applicationState.Application;
    const user = this.props.userState.user;

    if (user) {
      // Personal
      const name = user.name.first && user.name.last;
      const email = !!user.email;
      const address = user.address && user.address.country;
      const dob = !!user.dob;
      const gender = !!user.gender;
      
      if (name && email && address && dob && gender) {
        this.state.tasksTracker.addTask(ApplicationTasks.Personal);
      } else {
        this.state.tasksTracker.removeTask(ApplicationTasks.Personal);
      }
    }

    if (application) {
      // Education
      const { educationLevel, gpa, lastSchool } = application;
      
      if (!!educationLevel && !!gpa && !!lastSchool) {
        this.state.tasksTracker.addTask(ApplicationTasks.Education);
      } else {
        this.state.tasksTracker.removeTask(ApplicationTasks.Education);
      }

      // US Standardized Tests
      const { usTest, score } = application;

      if (!!usTest && !!score) {
        this.state.tasksTracker.addTask(ApplicationTasks.USStandardizedTests);
      } else {
        this.state.tasksTracker.removeTask(ApplicationTasks.USStandardizedTests);
      }

      // National Tests
      const { tests } = application;

      if (!!tests && Object.keys(tests).length > 0) {
        this.state.tasksTracker.addTask(ApplicationTasks.NationalTests);
      } else {
        this.state.tasksTracker.removeTask(ApplicationTasks.NationalTests);
      }

      // Miscellaneaous
      const { income, interest, workEthic } = application;

      if (!!income && !!interest && !!workEthic) {
        this.state.tasksTracker.addTask(ApplicationTasks.Miscellaneous);
      } else {
        this.state.tasksTracker.removeTask(ApplicationTasks.Miscellaneous);
      }

      // Essay
      const { essay } = application;

      if (!!essay && essay.text.length && getWordCount(essay.editable.blocks) >= 300) {
        this.state.tasksTracker.addTask(ApplicationTasks.Essay);
      } else {
        this.state.tasksTracker.removeTask(ApplicationTasks.Essay);
      }
    }
  }

  private handleNextButtonClick = () => {
    const nextIndex = this.tasks.indexOf(this.state.activeTask) + 1;
    const next = this.tasks[nextIndex];

    if (next) {
      this.props.history.push(`${this.props.match.url}/${next}`);
    }

    if (nextIndex >= this.tasks.length) {
      this.setState({ activeTask: ApplicationTasks.Welcome });
      this.props.history.push(this.props.match.url);
    }
  }

  private handlePreviousButtonClick = () => {
    const previousIndex = this.tasks.indexOf(this.state.activeTask) - 1;

    if (previousIndex >= 0) {
      const previous = this.tasks[previousIndex];

      if (previous) {
        this.props.history.push(`${this.props.match.url}/${previous}`);
      }
    } else {
      this.setState({ activeTask: ApplicationTasks.Welcome });
      this.props.history.push(this.props.match.url);
    }

    if (this.state.activeTask === ApplicationTasks.Welcome) {
      this.props.history.push(`${this.props.match.url}/submit`);
    }
  }

  private setTask = (task: ApplicationTasks) => {
    this.setState({ activeTask: task });
  }

  private createTaskList = () => {
    return this.tasks.map((task: ApplicationTasks) => {
      return (
        <li key={task}>
          <NavLink
            exact={true}
            to={`${this.props.match.url}/${task}`}
            activeClassName="active"
            className={this.state.tasksTracker.isTaskComplete(task) === true ? 'complete' : ''}
          >
            {task}
          </NavLink>
        </li>
      );
    });
  }

  private renderWelcome = () => {
    return (
      <div className="application_task__container application__welcome">
        <h1>{Strings.Welcome}</h1>
        <p>{Strings.ApplyPortal_Welcome1}</p>
        <p>{Strings.ApplyPortal_Welcome2}</p>
        <h2>{Strings.Instructions}</h2>
        <p>{Strings.ApplyPortal_Instructions1}</p>
        <p>{Strings.ApplyPortal_Instructions2}</p>
      </div>
    );
  }

  private resendEmailConfirmation = () => {
    this.props.sendConfirmationEmail(this.state.applicationId);
  }

  private handleNotificationClose = () => {
    this.state.notificationsManager.close();
  }

  private handleSignOutClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    this.props.signOut();
    this.props.history.push('/');
  }

  public componentDidMount() {
    this.props.updateLocation('application portal');
    this.props.getCurrentUser();
    this.props.getCurrentApplication(this.state.applicationId);
  }

  public componentDidUpdate(prevProps: Props) {
    if ((prevProps.applicationState.isGetting && this.props.applicationState.hasGotten) ||
      (prevProps.userState.isGetting && this.props.userState.hasGotten)
    ) {
      this.updateTasksCompletion();
    }

    if (prevProps.auth.isSending) {
      if (this.props.auth.failedToSendEmail) {
        const notification: iNotification = {
          isClosed: false,
          isError: true,
          message: this.props.auth.error!.message,
          type: NotificationType.AuthConfirmationEmailError
        };
  
        this.state.notificationsManager.add(notification);
      }

      if (this.props.auth.hasSent) {
        const notification: iNotification = {
          isClosed: false,
          isError: false,
          message: Strings.AuthSuccess_ConfirmationEmail,
          type: NotificationType.AuthConfirmationEmailError
        };

        this.state.notificationsManager.add(notification);
      }
    }
  }

  public render() {
    const notification: iNotification | null = this.state.notificationsManager.hasOpenNotifications();

    return (
      <div className="application_portal">
        <PageMeta route="APPLY_PORTAL" />
        <header className="application__portal_header">
          <h1>{Strings.ApplyPortal_MainHeading}</h1>
          <div className="application_portal__action_buttons">
            <Button 
              key="application-portal-previous" 
              type="button" 
              text="Previous" 
              doClick={this.handlePreviousButtonClick} 
            />
            <Button 
              key="application-portal-next" 
              type="button" 
              text="Next" 
              doClick={this.handleNextButtonClick} 
              solid={true}
            />
          </div>
        </header>
        <main className="application__portal_body">
          <div className="application__portal_sidebar">
            <ul className="application__sidebar">
              <li>
                <NavLink exact={true} to={this.props.match.url}>{Strings.Welcome}</NavLink>
              </li>
              { 
                this.props.applicationState.hasGotten && this.props.userState.hasGotten ?
                  this.createTaskList() :
                  null
              }
              <li className="application__portal_sign_out">
                <NavLink to={routes.SIGN_OUT.route} onClick={this.handleSignOutClick}>
                  <span>{Strings.signOut}</span>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="application__portal_main">
            {
              this.props.userState.hasGotten && 
              this.props.userState.user &&
              this.props.userState.user.emailConfirmed !== true ?
                <div className="notification__email_confirmation">
                  <span>{Strings.AuthError_EmailNotConfirmed}</span>
                  <span 
                    className="email_confirmation__link" 
                    onClick={this.resendEmailConfirmation}
                  >
                    {Strings.Auth_ResendConfirmationEmail}
                  </span>
                </div>
              : null
            }
            {
              notification ?
                <Notification doClose={this.handleNotificationClose} text={notification.message} /> :
                null
            }
            <Route 
              exact={true} 
              path={`${this.props.match.url}/:task`}
              render={(props) => {
                return (
                  <ApplicationTask 
                    {...props} 
                    setTask={this.setTask}
                    user={this.props.userState.user}
                    application={this.props.applicationState.Application} 
                    complete={this.state.tasksTracker.areAllTasksComplete} 
                  />
                );
              }}
            />
            <Route 
              exact={true} 
              path={this.props.match.url}
              render={this.renderWelcome}
            />
          </div>
          <LinkButton target="/" classes="fixed fixed__bottom fixed__right round solid icon" icon="faHome"/>
        </main>
      </div>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ApplicationPortal)
);