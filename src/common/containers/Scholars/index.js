import "./Scholars.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { NavLink, Route } from "react-router-dom";
import propTypes from "prop-types";

import { SCHOLARS_PAST, SCHOLAR } from "../../constants/routes";
import * as studentsActions from "../../actions/studentsActions";

import CurrentScholars from "./CurrentScholars";
import PastScholars from "./PastScholars";
import ViewScholar from "./ViewScholar";

import ToTopContainer from "../../components/ToTopContainer";
import PageMeta from "../../components/PageMeta";

class Scholars extends Component {
  state = {
    past: false
  }

  static propTypes = {
    updateLocation: propTypes.func,
    match: propTypes.object,
    location: propTypes.object,
    students: propTypes.object,
    studentsActions: propTypes.object
  }

  componentDidMount() {
    this.props.updateLocation("scholars");
    this.setPath();

    this.props.studentsActions.doGetCurrentStudents();
  }

  getSnapshotBeforeUpdate(props) {
    if (props.location.pathname !== this.props.location.pathname) {
      return {
        pathChanged: true
      };
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot && snapshot.pathChanged) {
      this.setPath();
    }
  }

  render() {
    return (
      <ToTopContainer classes="scholars__container reset__body_top_padding">
        <PageMeta route="SCHOLARS" />
        <header 
          className={this.state.past ? "scholars__header_past" : this.state.viewing ? "scholars__header_viewing" : null}>
          {
            !this.state.viewing ?
              <div className="scholars__header_content">
                <h1>our scholars</h1>
                <ul className="scholars__nav">
                  <li>
                    <NavLink exact to="/scholars"
                      activeClassName="active">
                      Current
                    </NavLink>
                    <NavLink exact to="/scholars/past"
                      activeClassName="active">
                      Past
                    </NavLink>
                  </li>
                </ul>
              </div> : null
          }
        </header>
        <Route exact path={this.props.match.url}
          render={props => {
            return <CurrentScholars {...props} students={this.props.students} />
          }} />
        <Route path={SCHOLARS_PAST.route}
          component={PastScholars} />
        <Route path={SCHOLAR.route}
          render={props => {
            return <ViewScholar {...props} students={this.props.students} />
          }} />
      </ToTopContainer>
    )
  }



  setPath = () => {
    const { pathname } = this.props.location;
    this.setState({ 
      past: pathname.indexOf("past") > -1,
      viewing: pathname.indexOf("view") > -1 
    });

    return {
      past: pathname.indexOf("past") > -1,
      viewing: pathname.indexOf("view") > -1
    };
  }
}

const mapStateToProps = state => {
  return {
    students: state.students
  };
};

const mapDispatchToProps = dispatch => {
  return {
    studentsActions: bindActionCreators(studentsActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Scholars);