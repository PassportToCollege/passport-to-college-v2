import "./Home.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as statsActions from "../../actions/statsActions";
import * as featuresActions from "../../actions/featuresActions";

import ParallaxHeader from "../../components/ParallaxHeader";
import TopicSection from "../../components/TopicSection";
import StatItem from "../../components/StatItem";
import InfoCard from "../../components/InfoCard";

const infoCardBg = require("../../assets/images/info_card__bg.JPG");

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
      flipStrip: false,
      stats: props.stats.stats,
      features: props.features.features
    }
  }

  componentWillMount() {
    this.props.updateLocation("landing");
    this.props.statsActions.doStatsGet();
    this.props.featuresActions.doGetActiveFeatures();
  }
  
  componentDidMount() {
    window.addEventListener("scroll", this.watchScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.watchScroll);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stats.hasGotten)
      this.setState({ stats: nextProps.stats.stats });
    
    if (nextProps.features.hasGotten)
      this.setState({ features: nextProps.features.features });
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
        <section className="home__section home__stats">
          <div className="home__section_inner">
            <StatItem label="years" stat={new Date().getFullYear() - 2012} />
            <StatItem label="students" stat={
              this.props.stats.hasGotten && this.state.stats ? this.state.stats.users.students : 0
            } />
            {/* TODO: track university count from dashboard */}
            <StatItem label="universities" stat="5" />
          </div>
        </section>
        <section className="home__section home__about">
          <div className="home__section_inner">
            <InfoCard blank={true} bgColor="transparent" />
            <InfoCard bgColor="#FFCB61"
              content="Our villagers are from all over the world, they support the mission by providing funds, services, and goods. They connect with each student. They are apprised of each student’s achievements, challenges, and success."
              title="villagers" />
            <InfoCard bgImage={infoCardBg}
              content={`In our ${new Date().getFullYear() - 2012} years, we have helped ${this.props.stats.hasGotten && this.state.stats ? this.state.stats.users.students : 0} students to enroll in universities accross the United States. This number is set to increase yearly as we stay true and dedicated to our mission.`}
              title="our scholars"
              bgOverlay="rgba(51,51,51,0.9)" 
              linkButton={{
                to: "scholars",
                text: "See Scholars",
                classes: "home__about_scholars_button"
              }}/>
            <InfoCard blank={true} bgColor="#53D1D7" />
          </div>
        </section>
        <section className="home__section home__featured_students">
          <div className="home__section_inner">
            <h1>featured students</h1>
          </div>
        </section>
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
  updateLocation: propTypes.func,
  statsActions: propTypes.object,
  stats: propTypes.object,
  features: propTypes.object,
  featuresActions: propTypes.object
};

const mapStateToProps = state => {
  return {
    stats: state.stats,
    features: state.features
  };
};

const mapDispatchToProps = dispatch => {
  return {
    statsActions: bindActionCreators(statsActions, dispatch),
    featuresActions: bindActionCreators(featuresActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);