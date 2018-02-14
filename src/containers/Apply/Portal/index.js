import "./ApplicationPortal.css";

import React, { Component } from "react";
import { NavLink, Route } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as applicationActions from "../../../actions/applicationActions";
import * as userActions from "../../../actions/userActions";

import Button from "../../../components/Button";
import ApplicationTask from './ApplicationTask';

class ApplicationPortal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      applicationId: this.props.match.params.application_id
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
          <section className="application__portal_sidebar">
            <ul className="application__sidebar">
              { this.createTaskList() }
            </ul>
          </section>
          <section className="application__portal_main">
            <Route exact path={`${this.props.match.url}/:task`} component={ApplicationTask} />
            <Route exact path={this.props.match.url}
              render={() => {
                return <p>Welcome</p>
              }}/>
          </section>
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
    console.log("clicked")
  }

  handlePreviousButtonClick = () => {
    debugger;
    console.log("clicked")
  }

  createTaskList = () => {
    const tasks = [
      "Personal",
      "Profile Picture",
      "Education",
      "US Standardized Tests",
      "National Tests",
      "Miscellaneous",
      "Essay",
      "Review and Sign",
      "Submit"
    ];

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