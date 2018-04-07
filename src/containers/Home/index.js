import "./Home.css";

import React, { Component } from "react";
import propTypes from "prop-types";

import ParallaxHeader from "../../components/ParallaxHeader";
import TopicSection from "../../components/TopicSection";

const headerBg = require("../../assets/images/home__header__bg.jpg");

class Home extends Component {
  render() {
    return (
      <div className="home__container reset__body_top_padding">
        <ParallaxHeader showScrollStrip height="100vh"
          bgImage={headerBg}
          overlayColor="#53D1D7"
          bigText="Matching Aptitude With Opportunity"
          showLinkButton={true}
          linkButton={{
            target: "/about-us",
            text: "Learn More"
          }} />
        <TopicSection heading="who are we"
          content={
            <p>
              We are a 501c <b>non-profit</b> organization that is on a mission to identify students from developing countries that are strong in <b>Science</b>, <b>Technology</b>, <b>Engineering</b> and <b>Mathematics</b>, <b>STEM,</b> who <b>lack</b> the resources to attend <b>college/university</b> and to provide opportunities to gain a tertiary education.
            </p>
          } 
          sectionStyles={{
            width: "1140px",
            maxWidth: "100%",
            margin: "0 auto"
          }}/>
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