import "./Application.css";

import React, { Component } from "react";
import { withRouter, NavLink, Route } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import { VIEW_APPLICATION_SECTIONS } from "../../../constants/routes";
import * as applicationActions from "../../../actions/applicationActions";

import ApplicationSection from "./ApplicationSection";
import Button from "../../../components/Button";
import LoadingText from "../../../components/LoadingText";

class Application extends Component {
  constructor(props) {
    super(props);

    this.state = {
      application: this.props.application.application
    };
  }

  componentDidMount() {
    const { application_id } = this.props.match.params;
    this.props.applicationActions.doApplicationGet(application_id);
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.application.hasGotten)
      return { application: nextProps.application.application };
    
    return null;
  }

  render() {
    return (
      <div className="dashboard__container">
        <Button text="back to all applications" solid 
          doClick={() => this.props.history.push("/admin/dashboard/applications")}/>
        <div className="application__container">
          <header>
            {
              this.props.application.hasGotten && this.state.application ?
                <span>
                  <h1>{this.state.application.user.name.full}</h1>
                  <p>{this.state.application.user.address.country}</p>
                </span> :
                <LoadingText options={{
                  class: "block__lines",
                  bg: "transparent",
                  height: "10px",
                  lines: [
                    { color: "rgba(255,101,97,0.2)", width: "200px" },
                    { color: "rgba(255,101,97,0.4)", width: "100px" }
                  ]
                }} />
            }
            <ul className="application__sections">
              <li>
                <NavLink exact
                  to={this.props.match.url}
                  activeClassName="active">
                  Information
                </NavLink>
              </li>
              {
                VIEW_APPLICATION_SECTIONS.map(section => {
                  return (
                    <li key={section.route}>
                      <NavLink exact 
                        to={`${this.props.match.url}${section.route}`} 
                        activeClassName="active">
                        {section.name}
                      </NavLink>
                    </li>
                  )
                })
              }
            </ul>
          </header>
          <div className="application__main">
              <Route exact path={this.props.match.url}
                render={props => {
                  return (
                    <ApplicationSection {...props}
                      applicationId={this.props.match.params.application_id}
                      section="information"
                      application={this.props.application}
                      applicationActions={this.props.applicationActions} />
                  )
                }}>
              </Route>
              {
                VIEW_APPLICATION_SECTIONS.map(section => {
                  return (
                    <Route key={section.route} exact 
                      path={`${this.props.match.url}${section.route}`}
                      render={props => {
                        return (
                          <ApplicationSection {...props}
                            section={section.name.toLowerCase()}
                            application={this.props.application} 
                            applicationActions={this.props.applicationActions}
                            applicationId={this.props.match.params.application_id} />
                        )
                      }}>
                    </Route>
                  )
                })
              }
          </div>
        </div> 
      </div>
    )
  }
}

Application.propTypes = {
  application: propTypes.object,
  applicationActions: propTypes.object,
  match: propTypes.object,
  history: propTypes.object
};

const mapStateToProps = state => {
  return {
    application: state.application
  };
};

const mapDispatchToProps = dispatch => {
  return {
    applicationActions: bindActionCreators(applicationActions, dispatch)
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Application)
);