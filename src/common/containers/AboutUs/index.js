import "./AboutUs.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";
import _ from "lodash";

import * as usersActions from "../../actions/usersActions";
import { about } from "../../constants/pages";
import { STORIES as storiesRoute } from "../../constants/routes";

import Header from "../../components/Header";
import TopicSection from "../../components/TopicSection";
import ToTopContainer from "../../components/ToTopContainer";
import IconBullet from "../../components/IconBullet";
import PageMeta from "../../components/PageMeta";
import FlexContainer from "../../components/FlexContainer";
import RoleCard from "../../components/RoleCard";
import LinkButton from "../../components/LinkButton";

import headerImage from "../../assets/images/about_us__header.jpg";

class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      founder: props.users.founder,
      staff: props.users.staff
    }
  }

  static propTypes = {
    users: propTypes.object,
    usersActions: propTypes.object,
    updateLocation: propTypes.func
  }

  componentDidMount() {
    this.props.updateLocation("about");

    if (!this.state.founder)
      this.props.usersActions.doGetFounder();

    if (!this.state.staff)
      this.props.usersActions.doGetStaff();
  }

  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.users.gotFounder && !_.isEqual(state.founder, nextProps.users.founder)) {
      return { founder: nextProps.users.founder };
    }

    if (nextProps.users.gotStaff && !_.isEqual(state.staff, nextProps.users.staff)) {
      return { staff: nextProps.users.staff };
    }

    return null;
  }

  render() {
    return (
      <React.Fragment>
        <PageMeta route="ABOUT_US" />
        <ToTopContainer>
          <Header 
            scrollEl="about_main"
            background={headerImage} />
          {this.renderMain()}
        </ToTopContainer>
      </React.Fragment>
    )
  }

  renderMain = () => {
    return (
      <main id="about_main">
        <TopicSection heading="about us"
        content={
          <p>{about.intro}</p>
        } 
        sectionStyles={{
          width: "1140px",
          maxWidth: "100%",
          margin: "0 auto"
        }} />
        <section className="about__wwd">
          <FlexContainer>
            {
              about.wwd.map((item, i) => {
                return (
                  <IconBullet key={`${item.icon}_${i}`}
                    heading={item.heading}
                    icon={item.icon}>
                    <p>{item.info}</p>  
                  </IconBullet>
                )
              })
            }
          </FlexContainer>
        </section>
        <section className="about__staff">
          <FlexContainer classes={["about__staff_header"]}>
            <h4>
              The people behind <br/>
              Passport to College
            </h4>
            <p>{about.staffIntro}</p>
          </FlexContainer>
          <FlexContainer classes={["about__staff_staff"]}>
            {
              this.state.founder ?
                <RoleCard founder staff={this.state.founder} /> :
                null
            }
            {
              this.state.staff ?
                this.state.staff.map(member => {
                  if (member.user) {
                    return <RoleCard key={member.user.uid} staff={member} />
                  }

                  return <RoleCard key={member.uid} staff={member} />
                }) : null
            }
          </FlexContainer>
        </section>
        {this.renderStoriesCTA()}
      </main>
    )
  }

  renderStoriesCTA = () => {
    if (about.showStoriesCTA) {
      return (
        <section className="about__staff_stories_cta">
          <div className="stories_cta__bg"
            style={{
              backgroundImage: `url(${about.storiesCTABg})`
            }}></div>
          <div className="stories_cta__content">
            <div>
              <span>
                <h2>more<br></br> about us</h2>
                <LinkButton default text="stories" 
                  target={storiesRoute.route}/>
              </span>
            </div>
          </div>
        </section>
      )
    }

    return null;
  }
}

const mapStateToProps = state => {
  return {
    users: state.users
  };
};

const mapDispatchToProps = dispatch => {
  return {
    usersActions: bindActionCreators(usersActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AboutUs);