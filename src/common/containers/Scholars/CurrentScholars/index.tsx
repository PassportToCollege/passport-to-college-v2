import "./CurrentScholars.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import _ from "lodash";

import { SCHOLARS_PAST } from "../../../constants/routes";
import { Student } from "../../../utils/utilityClasses";

import ToTopContainer from "../../../components/ToTopContainer";
import TopicSection from "../../../components/TopicSection";
import ClassificationBlock from "../../../components/ClassificationBlock";
import ColoredStrip from "../../../components/ColoredStrip";
import Button from "../../../components/Button";
import Loader from "../../../components/Loader";

import Hero from "../../../assets/images/scholars__current_hero.JPG";
import EmptyFreshmen from "../../../assets/images/empty_state__freshmen_yellow_570_370.svg";

class CurrentScholars extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      students: props.students.gotCurrentStudents ? props.students.students : null
    };
  }

  static propTypes = {
    students: propTypes.object,
    studentsActions: propTypes.object,
    history: propTypes.object
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

  componentDidMount() {
    if (this.state.students && this.props.students.gotCurrentStudents)
      this.createClassificationState();
  }

  getSnapshotBeforeUpdate(props) {
    if (props.students.gettingCurrentStudents && this.props.students.gotCurrentStudents) {
      return {
        gotStudents: true
      };
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot && snapshot.gotStudents && this.state.students) {
      this.createClassificationState();
    }
  }

  render() {
    return (
      <ToTopContainer classes="scholars__current">
        <section className="scholars__current_hero">
          <span></span>
          <img src={Hero} alt="current scholars hero" />
        </section>
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
          {this.renderFreshmen()}
          {this.renderSophomores()}
          {this.renderJuniors()}
          {this.renderSeniors()}
        </section>
        <ColoredStrip background="#53D1D7">
          <h3 className="type__bold">Want to see our past scholars?</h3>
          <Button solid 
            doClick={this.toPastScholars}
            text="past scholars" 
            styles={{
              backgroundColor: "#11A5AC"
            }} />
        </ColoredStrip>
      </ToTopContainer>
    )
  }

  renderFreshmen = () => {
    if (this.state.freshmen) {
      return (
        <ClassificationBlock classification="freshmen"
          classes={["scholars__current_freshmen"]} 
          students={this.state.freshmen}
          emptyPicture={EmptyFreshmen}
          header={{
            topBg: "#53D1D7",
            bottomBg: "#11A5AC",
            info: this.state.freshmen && this.state.freshmen.length ?
            <p></p> :
            <p>Looks like we are still matching our newest scholars with awesome universities. Please check back to see our newest additions and learn more about them.</p>
          }} />
      );
    }

    return <Loader />
  }

  renderSophomores = () => {
    if (this.state.sophomores) {
      return (
        <ClassificationBlock classification="sophomores"
        classes={["scholars__current_sophomores"]} 
          students={this.state.sophomores}
          emptyPicture={EmptyFreshmen}
          header={{
            topBg: "#FFCB61",
            bottomBg: "#FFB318",
            info: <p></p>
          }} />
      );
    }

    return null;
  }

  renderJuniors = () => {
    if (this.state.seniors) {
      return (
        <ClassificationBlock classification="juniors"
          classes={["scholars__current_juniors"]} 
          students={this.state.juniors}
          emptyPicture={EmptyFreshmen}
          header={{
            topBg: "#FF6561",
            bottomBg: "#FF443F",
            info: <p></p>
          }} />
      );
    }

    return null;
  }

  renderSeniors = () => {
    if (this.state.seniors) {
      return (
        <ClassificationBlock classification="seniors"
          classes={["scholars__current_seniors"]} 
          students={this.state.seniors}
          emptyPicture={EmptyFreshmen}
          header={{
            topBg: "#53D1D7",
            bottomBg: "#11A5AC",
            info: <p></p>
          }} />
      );
    }

    return null;
  }

  createClassificationState = () => {
    const freshmen = this.state.students.filter(student => {
      return new Student(student).isFreshman;
    });

    const sophomores = this.state.students.filter(student => {
      return new Student(student).isSophomore;
    });

    const juniors = this.state.students.filter(student => {
      return new Student(student).isJunior;
    });

    const seniors = this.state.students.filter(student => {
      return new Student(student).isSenior;
    });

    this.setState({
      freshmen,
      activeFreshman: freshmen.length ? freshmen[0] : null,
      sophomores,
      activeSophomore: sophomores.length ? sophomores[0] : null,
      juniors,
      activeJunior: juniors.length ? juniors[0] : null,
      seniors,
      activeSenior: seniors.length ? seniors[0] : null
    });
  }

  toPastScholars = () => {
    this.props.history.push(SCHOLARS_PAST.route);
  }
}

export default CurrentScholars;