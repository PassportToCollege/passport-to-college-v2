import "./Events.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";

import { events } from "../../constants/pages";

import Header from "../../components/Header";
import TopicSection from "../../components/TopicSection";
import ToTopContainer from "../../components/ToTopContainer";
import PageMeta from "../../components/PageMeta";

import headerImage from "../../assets/images/events__header.jpg";

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  static propTypes = {
    updateLocation: propTypes.func
  }

  componentDidMount() {
    this.props.updateLocation("events");
  }

  render() {
    return (
      <React.Fragment>
        <PageMeta route="EVENTS" />
        <ToTopContainer>
          <Header 
            scrollEl="events__main"
            background={headerImage} />
          {this.renderMain()}
        </ToTopContainer>
      </React.Fragment>
    )
  }

  renderMain = () => {
    return (
      <main id="events__main">
        <TopicSection heading="events"
        content={
          <h4>{events.intro}</h4>
        } 
        sectionStyles={{
          width: "1140px",
          maxWidth: "100%",
          margin: "0 auto"
        }} />
      </main>
    )
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Events);