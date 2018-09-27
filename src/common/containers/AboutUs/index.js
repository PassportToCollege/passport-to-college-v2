import "./AboutUs.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";

import * as usersActions from "../../actions/usersActions";
import { about } from "../../constants/pages";

import Header from "../../components/Header";
import TopicSection from "../../components/TopicSection";
import ToTopContainer from "../../components/ToTopContainer";
import IconBullet from "../../components/IconBullet";
import PageMeta from "../../components/PageMeta";
import FlexContainer from "../../components/FlexContainer";

import headerImage from "../../assets/images/about_us__header.jpg";

class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  static propTypes = {
    users: propTypes.object,
    usersActions: propTypes.object,
    updateLocation: propTypes.func
  }

  componentDidMount() {
    this.props.updateLocation("about");
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
          
        </section>
      </main>
    )
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