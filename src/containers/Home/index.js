import "./Home.css";

import React, { Component } from "react";
import propTypes from "prop-types";

import ParallaxHeader from "../../components/ParallaxHeader";
import TopicSection from "../../components/TopicSection";

const headerBgs = [ 
  { 
    "img": require("../../assets/images/home__header_bg_0.jpg"),
    "color": "#53D1D7" 
  },
  { 
    "img": require("../../assets/images/home__header_bg_1.jpg"),
    "color": "#FF6561" 
  },
  { 
    "img": require("../../assets/images/home__header_bg_2.jpg"),
    "color": "#FFCB61" 
  }
];

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      flipStrip: false
    }
  }

  componentWillMount() {
    this.props.updateLocation("landing");
  }
  
  componentDidMount() {
    window.addEventListener("scroll", this.watchScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.watchScroll);
  }

  render() {
    return (
      <div className="home__container reset__body_top_padding">
        <ParallaxHeader showScrollStrip height="100vh"
          bgImages={headerBgs}
          overlayColor="#53D1D7"
          bigText="Matching Aptitude With Opportunity"
          showLinkButton={true}
          flipStrip={this.state.flipStrip}
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
          }} />
      </div>
    )
  }

  watchScroll = () => {
    const scrollTop = document.scrollingElement.scrollTop;

    if (scrollTop > 400) {
      this.setState({ flipStrip: true });
    } else {
      this.setState({ flipStrip: false });
    }
  }
}

Home.propTypes = {
  updateLocation: propTypes.func
};

export default Home;