import "./ApplicationPortal.css";

import React, { Component } from "react";
import { NavLink, Route } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as applicationActions from "../../../actions/applicationActions";
import * as userActions from "../../../actions/userActions";
import * as avatarActions from "../../../actions/avatarActions";

import Button from "../../../components/Button";
import LinkButton from "../../../components/LinkButton";
import ApplicationTask from './ApplicationTask';

import history from "../../../constants/history";

const tasks = [
  "Personal",
  "Profile Picture",
  "Education",
  "US Standardized Tests",
  "National Tests",
  "Miscellaneous",
  "Essay",
  "Review",
  "Submit"
];

const formattedTasks = tasks.map(task => {
  return task.toLowerCase().split(" ").join("-");
});

class ApplicationPortal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      applicationId: this.props.match.params.application_id,
      task: "welcome",
      isComplete: {
        personal: false,
        education: false,
        "profile-picture": false,
        "us-standardized-tests": false,
        "national-tests": false,
        miscellaneous: false
      }
    };
  }

  render() {
    return (
      <div className="application_portal">
        <header className="application__portal_header">
          <h1>Student Application</h1>
          <div className="application_portal__action_buttons">
            <Button key="application-portal-previous" type="button" text="Previous" doClick={this.handlePreviousButtonClick} />
            <Button key="application-portal-next" type="button" text="Next" doClick={this.handleNextButtonClick} solid={true}/>
          </div>
        </header>
        <main className="application__portal_body">
          <div className="application__portal_sidebar">
            <ul className="application__sidebar">
              <li>
                <NavLink exact to={this.props.match.url}>Welcome</NavLink>
              </li>
              { this.createTaskList() }
            </ul>
          </div>
          <div className="application__portal_main">
            <Route exact path={`${this.props.match.url}/:task`}
              render={props => {
                return <ApplicationTask {...props} 
                  setTask={this.setTask}
                  user={this.state.user}
                  application={this.state.application} 
                  avatar={this.props.avatar} />
              }}/>
            <Route exact path={this.props.match.url}
              render={this.renderWelcome}/>
          </div>
          {/* <LinkButton target="/#/" text="Home"/> */}
        </main>
      </div>
    )
  }

  componentWillMount() {
    this.props.updateLocation("application portal");
    
    // get user
    this.props.userActions.doUserGet();

    // get application
    this.props.applicationActions.doApplicationGet(this.state.applicationId);

    // get profile picture
    this.props.avatarActions.doAvatarGet(this.state.applicationId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.application.hasGotten) {
      const { application } = nextProps.application;
      let { isComplete } = this.state;

      this.setState({ application });

      if ((application.educationLevel && application.educationLevel.length) &&
        (application.gpa && application.gpa.length) &&
        (application.lastSchool && application.lastSchool.length)) {
        isComplete = Object.assign({}, isComplete, {
          education: true
        });
      }

      if ((application.usTest && application.usTest.length) &&
        (application.score && application.score.length)) {
        isComplete = Object.assign({}, isComplete, {
          "us-standardized-tests": true
        });
      }

      if (application.tests && Object.keys(application.tests).length) {
        isComplete = Object.assign({}, isComplete, {
          "national-tests": true
        });
      }

      if ((application.income && application.income.length) &&
        (application.interest && application.interest.length) &&
        (application.workEthic && application.workEthic.length)) {
        isComplete = Object.assign({}, isComplete, {
          "miscellaneous": true
        });
      }

      this.setState({ isComplete });
    }
    
    if (nextProps.user.hasGotten) {
      const { user } = nextProps.user;
      this.setState({ user });

      if ((user.name && user.name.first && user.name.last) &&
        (user.email && user.email.length) &&
        (user.address && user.address.country.length) &&
        (user.dob && user.dob.length) &&
        (user.gender && user.gender.length) &&
        (user.phone && user.phone.length)) {
        let { isComplete } = this.state;
        isComplete = Object.assign({}, isComplete, {
          personal: true
        });

        this.setState({ isComplete });
        }
    }

    if (nextProps.avatar.hasGotten) {
      const { url } = nextProps.avatar;

      if (url.length) {
        let { isComplete } = this.state;
        isComplete = Object.assign({}, isComplete, {
          "profile-picture": true
        });

        this.setState({ isComplete });
      }
    }
  }

  handleNextButtonClick = () => {
    let nextIndex = formattedTasks.indexOf(this.state.task) + 1;
    let next = formattedTasks[nextIndex];

    if (next)
      history.push(`${this.props.match.url}/${next}`)
  }

  handlePreviousButtonClick = () => {
    let previousIndex = formattedTasks.indexOf(this.state.task) - 1;

    if (previousIndex >= 0) {
      let previous = formattedTasks[previousIndex];
  
      if (previous) 
        history.push(`${this.props.match.url}/${previous}`);
    } else {
      this.setState({ task: "welcome" });
      history.push(this.props.match.url);
    }
  }

  setTask = task => {
    this.setState({ task });
  }

  createTaskList = () => {
    return tasks.map(task => {
      let formattedTask = task.toLowerCase().split(" ").join("-");
      return (
        <li key={task}>
          <NavLink exact to={`${this.props.match.url}/${formattedTask}`} activeClassName="active"
            className={this.state.isComplete[formattedTask] === true ? "complete" : null}>
            {task}
          </NavLink>
        </li>
      )
    });
  }

  renderWelcome = () => {
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
          We promise to keep all information and photos private. 
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
    )
  }
}

ApplicationPortal.propTypes = {
  updateLocation: propTypes.func,
  match: propTypes.object,
  applicationActions: propTypes.object,
  application: propTypes.object,
  userActions: propTypes.object,
  user: propTypes.object,
  avatarActions: propTypes.object,
  avatar: propTypes.object
};

const mapStateToProps = state => {
  return {
    application: state.application,
    user: state.user,
    avatar: state.avatar
  };
};

const mapDispatchToProps = dispatch => {
  return {
    applicationActions: bindActionCreators(applicationActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
    avatarActions: bindActionCreators(avatarActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationPortal);