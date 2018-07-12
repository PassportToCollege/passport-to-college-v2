import "./CurrentScholars.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";
import _ from "lodash";

import * as studentsActions from "../../../actions/studentsActions";

import TopicSection from "../../../components/TopicSection";
import FlexContainer from "../../../components/FlexContainer";
import TwoToneInfoCard from "../../../components/TwoToneInfoCard";

import Hero from "../../../assets/images/scholars__current_hero.JPG";

class CurrentScholars extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      students: props.students.gotCurrentStudents ? props.students.students : null
    };
  }

  static propTypes = {
    students: propTypes.object,
    studentsActions: propTypes.object
  }

  componentDidMount() {
    if (!this.props.students.gotCurrentStudents)
      this.props.studentsActions.doGetCurrentStudents();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.students.gotCurrentStudents && 
    !_.isEqual(state.students, props.students.students)) {
      return {
        students: props.students.students
      };
    }

    return null;
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
          <section className="scholars__current_freshmen">
            <FlexContainer>
              <section></section>
              <section>
                <TwoToneInfoCard heading="Freshmen"
                  subheading="class of 2021"
                  topBg="#FFCB61"
                  bottomBg="#FFB318">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam venenatis rhoncus congue. Praesent eget facilisis tellus. Etiam quis est eu sem tristique consectetur a vel lacus. Praesent eu justo eleifend, blandit sem ut, laoreet sem.</p>
                </TwoToneInfoCard>
              </section>
            </FlexContainer>
          </section>
        </section>
      </main>
    )
  }
}

const mapStateToProps = state => {
  return {
    students: state.students
  };
};

const mapDispatchToProps = dispatch => {
  return {
    studentsActions: bindActionCreators(studentsActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentScholars);