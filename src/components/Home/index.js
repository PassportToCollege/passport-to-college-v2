import "./Home.css";

import React, { Component } from "react";

class Home extends Component {
  render() {
    return (
      <div className="home__container">
        Home
      </div>
    )
  }

  componentWillMount() {
    this.props.updateLocation("landing");
  }
}

export default Home;