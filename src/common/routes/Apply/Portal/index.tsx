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

import { getWordCount } from '../../../utils';

const tasks = [
  'Personal',
  'Education',
  'US Standardized Tests',
  'National Tests',
  'Miscellaneous',
  'Essay',
  'Review',
  'Submit'
];

const formattedTasks = tasks.map((task) => {
  return task.toLowerCase().split(' ').join('-');
});

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

  public componentDidMount() {
    this.props.updateLocation('application portal');

    this.props.userActions.doUserGet();
    this.props.applicationActions.doApplicationGet(this.state.applicationId);
  }

  public static getDerivedStateFromProps(nextProps, prevState) {
    let { isComplete } = prevState;
    let newState = null;

    if (nextProps.application.hasGotten) {
      newState = newState || {};
      const { application } = nextProps.application;

      newState.application = application;

      if ((application.educationLevel && application.educationLevel.length) &&
        (application.gpa && application.gpa.length) &&
        (application.lastSchool && application.lastSchool.length)) {
        isComplete = {...isComplete, 
          education: true};
      } else {
        isComplete = {...isComplete, 
          education: false};
      }

      if ((application.usTest && application.usTest.length) &&
        (application.score && application.score.length)) {
        isComplete = {...isComplete, 
          'us-standardized-tests': true};
      } else {
        isComplete = {...isComplete, 
          'us-standardized-tests': false};
      }

      if (application.tests && Object.keys(application.tests).length) {
        isComplete = {...isComplete, 
          'national-tests': true};
      } else {
        isComplete = {...isComplete, 
          'national-tests': false};
      }

      if ((application.income && application.income.length) &&
        (application.interest && application.interest.length) &&
        (application.workEthic && application.workEthic.length)) {
        isComplete = {...isComplete, 
          miscellaneous: true};
      } else {
        isComplete = {...isComplete, 
          miscellaneous: false};
      }

      if (application.essay && application.essay.blocks &&
        application.essay.blocks.length && getWordCount(application.essay.blocks) >= 300) {
        isComplete = {...isComplete, 
          essay: true};
      } else {
        isComplete = {...isComplete, 
          essay: false};
      }
    }

    if (nextProps.user.hasGotten) {
      newState = newState || {};
      const { user } = nextProps.user;

      newState.user = user;

      if ((user.name && user.name.first && user.name.last) &&
        (user.email && user.email.length) &&
        (user.address && user.address.country.length) &&
        (user.dob && 'number' === typeof user.dob) &&
        (user.gender && user.gender.length) &&
        (user.phone && user.phone.length)) {
        isComplete = {...isComplete, 
          personal: true};
      } else {
        isComplete = {...isComplete, 
          personal: false};
      }
    }

    if (nextProps.application.hasGotten && nextProps.user.hasGotten) {
      newState = newState || {};

      if (nextProps.auth.hasFailed) {
        newState.hasError = true; 
        newState.error = nextProps.auth.error.message;
      }

      if (nextProps.auth.hasSent) {
        newState.hasSent = true;
      }
    }

    if (newState) {
      return {...newState,  isComplete};
    }
    
    return null;
  }

  public render() {
    return (
      <div className="application_portal">
        <PageMeta route="APPLY_PORTAL" />
        <header className="application__portal_header">
          <h1>Student Application Portal</h1>
          <div className="application_portal__action_buttons">
            <Button key="application-portal-previous" type="button" text="Previous" doClick={this.handlePreviousButtonClick} />
            <Button key="application-portal-next" type="button" text="Next" doClick={this.handleNextButtonClick} solid={true}/>
          </div>
        </header>
        <main className="application__portal_body">
          <div className="application__portal_sidebar">
            <ul className="application__sidebar">
              <li>
                <NavLink exact={true} to={this.props.match.url}>Welcome</NavLink>
              </li>
              { 
                this.props.application.hasGotten && this.props.user.hasGotten ?
                  this.createTaskList() :
                  null
              }
              <li className="application__portal_sign_out">
                <NavLink to={routes.SIGN_OUT.route} onClick={this.handleSignOutClick}>
                  <span>sign out</span>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="application__portal_main">
            {
              this.props.user.hasGotten && this.props.user.user.emailConfirmed !== true ?
                <div className="notification__email_confirmation">
                  <span>You have not confirmed your email address.</span>
                  <span className="email_confirmation__link" onClick={this.resendEmailConfirmation}> Resend confirmation email.</span>
                </div>
              :
                null
            }
            {
              this.state.hasError && !this.state.notificationClosed ?
                <Notification doClose={this.handleNotificationClose} text={this.state.error} /> :
                null
            }
            {
              this.state.hasSent && !this.state.notificationClosed ?
                <Notification doClose={this.handleNotificationClose}
                  text="Check your email address, we sent you a message." />
                :
                null
            }
            <Route exact={true} path={`${this.props.match.url}/:task`}
              render={(props) => {
                return <ApplicationTask {...props} 
                  setTask={this.setTask}
                  user={this.state.user}
                  application={this.state.application} 
                  complete={this.state.isComplete} />;
              }}/>
            <Route exact={true} path={this.props.match.url}
              render={this.renderWelcome}/>
          </div>
          <LinkButton target="/" classes="fixed fixed__bottom fixed__right round solid icon" icon="faHome"/>
        </main>
      </div>
    );
  }

  public handleNextButtonClick = () => {
    const nextIndex = formattedTasks.indexOf(this.state.task) + 1;
    const next = formattedTasks[nextIndex];
    
    if (next) {
      this.props.history.push(`${this.props.match.url}/${next}`);
    }
    
    if (nextIndex >= formattedTasks.length) {
      this.setState({ task: 'welcome' });
      this.props.history.push(this.props.match.url);
    }
  }

  public handlePreviousButtonClick = () => {
    const previousIndex = formattedTasks.indexOf(this.state.task) - 1;

    if (previousIndex >= 0) {
      const previous = formattedTasks[previousIndex];
  
      if (previous) { 
        this.props.history.push(`${this.props.match.url}/${previous}`);
      }
    } else {
      this.setState({ task: 'welcome' });
      this.props.history.push(this.props.match.url);
    }

    if (this.state.task === 'welcome') {
      this.props.history.push(`${this.props.match.url}/submit`);
    }
  }

  public setTask = (task) => {
    this.setState({ task });
  }

  public createTaskList = () => {
    return tasks.map((task) => {
      const formattedTask = task.toLowerCase().split(' ').join('-');
      return (
        <li key={task}>
          <NavLink exact={true} to={`${this.props.match.url}/${formattedTask}`} activeClassName="active"
            className={this.state.isComplete[formattedTask] === true ? 'complete' : null}>
            {task}
          </NavLink>
        </li>
      );
    });
  }

  public renderWelcome = () => {
    return (
      <div className="application_task__container application__welcome">
        <h1>Welcome</h1>
        <p>
          Our mission is to identify students from developing countries 
          that are strong in Science, Technology, Engineering and Mathematics, <b>STEM</b>, 
          who lack the resources to attend college/university. We therefore require that all applicants 
          fill out an application to evaluate their eligibility. <b>Be honest in your answers as further 
          eligibility data will be collected during the review process.</b>
        </p>
        <p>
          We promise to keep all information. 
          We will not repost them or use them outside the reviewing of your application.
        </p>

        <h2>Instructions</h2>
        <p>Your information is saved automatically. So don&apos;t worry about losing your information.</p>
        <p>
          Some sections contain <b>required fields</b>, 
          these fields must be completed.Required fields are marked with an asterisk (<span className="type--required-symbol">*</span>).
          You will not be able to submit your application until you complete the required fields.
        </p>
      </div>
    );
  }

  public resendEmailConfirmation = () => {
    this.setState({ hasSent: false });
    const { email } = this.state.user;
    const { applicationId } = this.state;

    this.props.authActions.doSendEmailConfirmation(applicationId, email);
  }

  public handleNotificationClose = () => {
    this.setState({ notificationClosed: true, hasError: false, hasSent: false });
  }

  public handleSignOutClick = (e) => {
    e.preventDefault();

    this.props.authActions.doSignOut(this.state.user);
    this.props.history.push('/');
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ApplicationPortal)
);