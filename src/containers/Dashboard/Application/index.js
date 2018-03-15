import "./Application.css";

import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as applicationActions from "../../../actions/applicationActions";

import Button from "../../../components/Button";
import LoadingText from "../../../components/LoadingText";

class Application extends Component {
  constructor(props) {
    super(props);

    this.state = {
      application: this.props.application.application
    };
  }

  componentWillMount() {
    const { application_id } = this.props.match.params;
    this.props.applicationActions.doApplicationGet(application_id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.application.hasGotten)
      this.setState({ application: nextProps.application.application });
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
          </header>
          <div className="application__main">

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