import "./DashPosts.css";

import React, { Component } from "react";
import { Route } from "react-router-dom";

import * as routes from "../../../constants/routes";

import NavigationPosts from "../../../components/NavigationPosts";
import EditPost from "./EditPost";

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
            return <EditPost {...props} togglePostNav={val => this.setState({ showPostNav: val })} /> }
        }></Route>
      </div>
    )
  }
}

export default DashPosts;