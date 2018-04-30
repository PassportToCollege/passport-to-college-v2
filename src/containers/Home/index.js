import "./Home.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import _ from "lodash";

import * as statsActions from "../../actions/statsActions";
import * as featuresActions from "../../actions/featuresActions";
import * as postsActions from "../../actions/postsActions";

import ParallaxHeader from "../../components/ParallaxHeader";
import TopicSection from "../../components/TopicSection";
import StatItem from "../../components/StatItem";
import InfoCard from "../../components/InfoCard";
import InfoStrip from "../../components/InfoStrip";
import PostCardGrid from "../../components/PostCardGrid";
import Loader from "../../components/Loader";

import infoCardBg from "../../assets/images/info_card__bg.JPG";
import headerBg0 from "../../assets/images/home__header_bg_0.jpg";
import headerBg1 from "../../assets/images/home__header_bg_1.jpg";
import headerBg2 from "../../assets/images/home__header_bg_2.jpg";
import EmptyStateYellow from "../../assets/images/empty_state__yellow.png";

const headerBgs = [ 
  { "img": headerBg0, "color": "#53D1D7" },
  { "img": headerBg1, "color": "#FF6561" },
  { "img": headerBg2, "color": "#FFCB61" }
];

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      flipStrip: false,
      stats: props.stats.stats,
      features: props.features.features,
      posts: props.posts.mostRecent,
      showHeader: true
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { stats, features, posts } = prevState;
    return {
      stats: nextProps.stats.hasGotten && !_.isEqual(nextProps.stats.stats, stats) ? nextProps.stats.stats : stats,
      features: nextProps.features.hasGotten && !_.isEqual(nextProps.features.features, features) ? nextProps.features.features : features,
      posts: nextProps.posts.gotMostRecent && !_.isEqual(nextProps.posts.mostRecent, posts) ? nextProps.posts.mostRecent : posts
    };
  }
  
  componentDidMount() {
    window.addEventListener("scroll", this.watchScroll);

    this.props.updateLocation("landing");
    this.props.statsActions.doStatsGet();
    this.props.featuresActions.doGetActiveFeatures();
  }

  componentWillUnmount() {
    clearInterval(this.state.parallaxInterval);
    window.removeEventListener("scroll", this.watchScroll);
  }

  render() {
    return (
      <div className="home__container reset__body_top_padding">
        <ParallaxHeader showScrollStrip height="100vh"
          setInterval={interval => this.setState({ parallaxInterval: interval })}
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
            <InfoCard bgColor="#FFCB61"
              content="Our villagers are from all over the world, they support the mission by providing funds, services, and goods. They connect with each student. They are apprised of each student’s achievements, challenges, and success."
              title="villagers" />
            <InfoCard blank={true} bgColor="transparent" />
            <InfoCard blank={true} bgColor="#53D1D7" />
            <InfoCard bgImage={infoCardBg}
              content={`In our ${new Date().getFullYear() - 2012} years, we have helped ${this.props.stats.hasGotten && this.state.stats ? this.state.stats.users.students : 0} students to enroll in universities accross the United States. This number is set to increase yearly as we stay true and dedicated to our mission.`}
              title="our scholars"
              bgOverlay="rgba(51,51,51,0.9)" 
              linkButton={{
                to: "scholars",
                text: "See Scholars",
                classes: "home__about_scholars_button"
              }}/>
          </div>
        </section>
        <section className="home__section home__featured_students_title">
          <div className="home__section_inner">
            <h1>featured students</h1>
          </div>
        </section>
        <section className="home__section home__featured_students">
          <div className="home__section_inner">
            {
              this.props.features.hasGotten && this.state.features ?
                this.state.features.map(feature => {
                  return (
                    <InfoCard key={feature.id}
                      bgOverlay="rgba(51,51,51,0.9)"
                      bgColor="rgba(51,51,51,0.9)"
                      bgImage={feature.profilePic}
                      feature={true}
                      title={feature.name}
                      university={feature.student.university} />
                  )
                }) : null
            }
            {
              this.props.features.hasGotten && this.state.features
              && this.state.features.length%2 === 0 ?
                  <InfoCard blank={true} bgColor="transparent" /> : null
            }
            <InfoCard blank={true} bgColor="#FFCB61" />
          </div>
        </section>
        <section className="home__section" style={{ padding: "0" }}>
          <InfoStrip content="Passport to College connects with students from all over the world who are beating the odds." />
        </section>
        <section className="home__section home__posts">
          <div className="home__section_inner">
            <h1>most recent stories</h1>
            {
              this.props.posts.gettingMostRecent ?
                <Loader color="#FFCB61" /> : null
            }
            {
              this.props.posts.mostRecentGetFailed &&
                this.props.posts.error.message === "no posts found" ?
                <div className="no__posts">
                  <img src={EmptyStateYellow} alt="no posts" />
                  <h4>Oops! Looks like there are no stories yet.</h4>
                </div> : null
            }
            {
              this.props.posts.gotMostRecent && this.state.posts ?
                <PostCardGrid posts={this.state.posts} /> : null
            }
            {
              this.props.posts.gotMostRecent && this.state.posts ?
                <Link to="/stories" className="all_posts__link">
                  view all stories
                </Link> : null
            }
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
  featuresActions: propTypes.object,
  posts: propTypes.object,
  postsActions: propTypes.object
};

const mapStateToProps = state => {
  return {
    stats: state.stats,
    features: state.features,
    posts: state.posts
  };
};

const mapDispatchToProps = dispatch => {
  return {
    statsActions: bindActionCreators(statsActions, dispatch),
    featuresActions: bindActionCreators(featuresActions, dispatch),
    postsActions: bindActionCreators(postsActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);