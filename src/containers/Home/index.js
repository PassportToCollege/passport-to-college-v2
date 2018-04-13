import "./Home.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";

import * as statsActions from "../../actions/statsActions";
import * as featuresActions from "../../actions/featuresActions";
import * as postsActions from "../../actions/postsActions";

import ParallaxHeader from "../../components/ParallaxHeader";
import TopicSection from "../../components/TopicSection";
import StatItem from "../../components/StatItem";
import InfoCard from "../../components/InfoCard";
import InfoStrip from "../../components/InfoStrip";
import PostCard from "../../components/PostCard";
import Loader from "../../components/Loader";
import Footer from "../../components/Footer";

import infoCardBg from "../../assets/images/info_card__bg.JPG";
import headerBg0 from "../../assets/images/home__header_bg_0.jpg";
import headerBg1 from "../../assets/images/home__header_bg_1.jpg";
import headerBg2 from "../../assets/images/home__header_bg_2.jpg";

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
      posts: props.posts.posts
    }
  }

  componentWillMount() {
    this.props.updateLocation("landing");
    this.props.statsActions.doStatsGet();
    this.props.featuresActions.doGetActiveFeatures();
    this.props.postsActions.doPostsGetMostRecent();
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

    if (nextProps.posts.hasGotten)
      this.setState({ posts: nextProps.posts.posts });
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
            <div className="featured_students">
              
            </div>
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
              this.props.posts.isGetting ?
                <Loader color="#FFCB61" /> : null
            }
            <section className="home__most_recent_posts">
              {
                this.props.posts.postsGetFailed && 
                this.props.posts.error.message === "no posts found" ?
                  <span className="no__posts">No stories yet</span> : null
              }
              {
                this.props.posts.hasGotten && this.state.posts ?
                  <div className="home__most_recent_post">
                    <PostCard full={true} isDashboard={false} 
                      post={this.state.posts[0]} />
                  </div> : null
              }
              {
                this.props.posts.hasGotten && this.state.posts &&
                this.state.posts.length > 1 ?
                  <div className="home__other_recent_posts">
                    <PostCard isDashboard={false}
                      post={this.state.posts[1]} />
                      {
                        this.state.posts[2] ?
                        <PostCard isDashboard={false}
                          post={this.state.posts[2]} /> : null
                      }
                  </div> : null
              }
              {
                this.props.posts.hasGotten && this.state.posts &&
                this.state.posts.length > 3 ?
                  this.state.posts.map((post, i) => {
                    if (i < 3)
                      return null
                    
                    return (
                      <PostCard key={i} isDashboard={false}
                        post={post} />
                    )
                  }) : null 
              }
            </section>
            {
              this.props.posts.hasGotten && this.state.posts ?
                <Link to="/" className="all_posts__link">
                  view all posts
                </Link> : null
            }
          </div>
        </section>
        <Footer posts={this.props.posts} />
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