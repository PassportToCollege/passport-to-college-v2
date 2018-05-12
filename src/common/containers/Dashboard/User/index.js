import "./User.css";

import React, { Component } from "react";
import { withRouter, NavLink, Route } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import { VIEW_USER_SECTIONS } from "../../../constants/routes";
import * as usersActions from "../../../actions/usersActions";

import PageMeta from "../../../components/PageMeta";
import UserSection from "./UserSection";
import Button from "../../../components/Button";
import LoadingText from "../../../components/LoadingText";

class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: props.users.user
    };
  }

  componentDidMount() {
    const { user_id } = this.props.match.params;
    this.props.usersActions.doGetUserByUid(user_id);
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.users.hasGottenUser)
      return { user: nextProps.users.user };
    
    return null;
  }

  render() {
    return (
      <div className="dashboard__container">
        {
          this.props.users.hasGottenUser && this.state.user ?
            <PageMeta more={
              <title>{this.state.user.name.full} | User | Dashboard | Passport to College</title>
            } /> : null
        }
        <Button text="back to all users" solid
          doClick={() => this.props.history.push("/admin/dashboard/users")} />
        <div className="user__container">
          <header>
            {
              this.props.users.hasGottenUser && this.state.user ?
                <span>
                  <h1>{this.state.user.name.full}</h1>
                  {
                    this.state.user.address ?
                      <p>{this.state.user.address.country}</p> :
                      <p style={{ fontStyle: "italic", fontWeight: "lighter" }}>
                        no country
                      </p>
                  }
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
            <ul className="user__sections">
              <li>
                <NavLink exact
                  to={this.props.match.url}
                  activeClassName="active">
                  Personal
                </NavLink>
              </li>
              {
                VIEW_USER_SECTIONS.map(section => {
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
          <main>
            <Route exact path={this.props.match.url}
              render={props => {
                return (
                  <UserSection {...props}
                    userId={this.props.match.params.user_id}
                    section="personal"
                    user={this.props.users} />
                  )
              }}>
            </Route>
            {
              VIEW_USER_SECTIONS.map(section => {
                return (
                  <Route key={section.slug} exact
                    path={`${this.props.match.url}${section.route}`}
                    render={props => {
                      return (
                        <UserSection {...props}
                          userId={this.props.match.params.user_id}
                          section={section.slug}
                          user={this.props.users} />
                      )
                    }}>
                  </Route>
                )
              })
            }
          </main>
        </div>
      </div>
    )
  }
}

User.propTypes = {
  users: propTypes.object,
  usersActions: propTypes.object,
  match: propTypes.object,
  history: propTypes.object
};

const mapStateToProps = state => {
  return {
    users: state.users
  };
};

const mapDispatchToProps = dispatch => {
  return {
    usersActions: bindActionCreators(usersActions, dispatch)
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(User)
);