import "./Scholars.css";

import React, { Component } from "react";
import { NavLink, Route } from "react-router-dom";
import propTypes from "prop-types";

import { SCHOLARS_PAST } from "../../constants/routes";

import CurrentScholars from "./CurrentScholars";
import PastScholars from "./PastScholars";

import ToTopContainer from "../../components/ToTopContainer";
import PageMeta from "../../components/PageMeta";

class Scholars extends Component {
  state = {
    past: false
  }

  static propTypes = {
    updateLocation: propTypes.func,
    match: propTypes.object,
    location: propTypes.object
  }

  componentDidMount() {
    this.props.updateLocation("scholars");
    this.setPath();
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
        <header className={this.state.past ? "scholars__header_past" : null}>
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
          </div>
        </header>
        <Route exact path={this.props.match.url}
          component={CurrentScholars} />
        <Route path={SCHOLARS_PAST.route}
          component={PastScholars} />
      </ToTopContainer>
    )
  }

  setPath = () => {
    const { pathname } = this.props.location;
      this.setState({ past: pathname.indexOf("past") > -1 });
  }
}

export default Scholars;