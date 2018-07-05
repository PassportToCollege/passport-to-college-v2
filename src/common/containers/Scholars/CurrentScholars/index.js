import "./CurrentScholars.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";

import * as usersActions from "../../../actions/usersActions";

import TopicSection from "../../../components/TopicSection";

import Hero from "../../../assets/images/scholars__current_hero.JPG";

class CurrentScholars extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  static propTypes = {
    users: propTypes.object,
    usersActions: propTypes.object
  }

  render() {
    return (
      <main className="scholars__current">
        <img src={Hero} alt="current scholars hero" />
        <section className="scholars__current_content">
          <TopicSection
          content={
            <p>
              The number of students we give an opportunity to have a tertiary education increases each year. These students
              continue to thrive socially and academically once they get into schools, and this motivates us to
              continue the life - changing work we are doing.
            </p>
          } 
          sectionStyles={{
            width: "1140px",
            maxWidth: "100%",
            margin: "0 auto"
          }} />
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
)(CurrentScholars);