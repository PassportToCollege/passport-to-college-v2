import "./Home.css";

import React, { Component } from "react";
import propTypes from "prop-types";

import ParallaxHeader from "../../components/ParallaxHeader";

const headerBg = require("../../assets/images/home__header__bg.jpg");

class Home extends Component {
  render() {
    return (
      <div className="home__container reset__body_top_padding">
        <ParallaxHeader height="100vh"
          bgImage={headerBg}
          overlayColor="#53D1D7"
          bigText="Matching Aptitude With Opportunity"
          showLinkButton={true}
          linkButton={{
            target: "/about-us",
            text: "Learn More"
          }} />
      </div>
    )
  }

  componentWillMount() {
    this.props.updateLocation("landing");
  }
}

Home.propTypes = {
  updateLocation: propTypes.func
};

export default Home;