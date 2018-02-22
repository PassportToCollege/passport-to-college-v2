import "./ApplicationPortal.css";

import React, { Component } from "react";
import { NavLink, Route } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as applicationActions from "../../../actions/applicationActions";
import * as userActions from "../../../actions/userActions";

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
      task: "welcome"
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
                <NavLink to={this.props.match.url} activeClassName="active">Welcome</NavLink>
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
                  application={this.state.application} />
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
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.application.hasGotten)
      this.setState({ application: nextProps.application.application });
    
    if (nextProps.user.hasGotten)
      this.setState({ user: nextProps.user.user });
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
      return (
        <li key={task}>
          <NavLink exact to={`${this.props.match.url}/${task.toLowerCase().split(" ").join("-")}`} activeClassName="active">
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
  user: propTypes.object
};

const mapStateToProps = state => {
  return {
    application: state.application,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    applicationActions: bindActionCreators(applicationActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationPortal);