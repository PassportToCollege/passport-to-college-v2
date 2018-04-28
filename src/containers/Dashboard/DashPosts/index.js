import "./DashPosts.css";

import React, { Component } from "react";
import { Route } from "react-router-dom";
import propTypes from "prop-types";

import * as routes from "../../../constants/routes";

import NavigationPosts from "../../NavigationPosts";
import EditPost from "./EditPost";
import DisplayPosts from "./DisplayPosts";

class DashPosts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPostNav: true
    };
  }

  render() {
    return (
      <div className="dashboard__container dashboard__container_full dash_posts__container">
        <NavigationPosts show={this.state.showPostNav} />
        <Route exact path={routes.DASH_POSTS_EDIT.route} 
          render={(props) => {
            return (
              <EditPost {...props} 
                togglePostNav={val => this.setState({ showPostNav: val })} />
            )
        }}></Route>
        {
          routes.DASH_POSTS_SECTIONS.map(section => {
            if (section.name === "Settings")
              return null;

            return (
              <Route key={section.route} exact 
                path={section.route}
                render={props => {
                  return (
                    <DisplayPosts {...props}
                      togglePostNav={val => this.setState({ showPostNav: val })} 
                      section={section.name.toLowerCase()} />
                  )
                }}></Route>
            )
          })
        }
      </div>
    )
  }
}

DashPosts.propTypes = {
  match: propTypes.object
};

export default DashPosts;