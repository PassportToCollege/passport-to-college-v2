import "./DashPosts.css";

import React, { Component } from "react";

import NavigationPosts from "../../../components/NavigationPosts";

class DashPosts extends Component {
  render() {
    return (
      <div className="dashboard__container dashboard__container_full dash_posts__container">
        <NavigationPosts />
      </div>
    )
  }
}

export default DashPosts;