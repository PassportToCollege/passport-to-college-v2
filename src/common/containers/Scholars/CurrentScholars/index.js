import "./CurrentScholars.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";
import _ from "lodash";

import * as studentsActions from "../../../actions/studentsActions";
import { Student, getClassificationYear } from "../../../utils";

import TopicSection from "../../../components/TopicSection";
import FlexContainer from "../../../components/FlexContainer";
import TwoToneInfoCard from "../../../components/TwoToneInfoCard";
import ScrollSwitcher from "../../../components/ScrollSwitcher";
import InfoCard from "../../../components/InfoCard";

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
    studentsActions: propTypes.object
  }

  componentDidMount() {
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
          <section className="scholars__current_freshmen" id="freshmen">
            <FlexContainer>
              <section>
                {
                  this.state.freshmen && this.state.freshmen.length ?
                    <InfoCard
                      bgOverlay="rgba(51,51,51,0.9)"
                      bgColor="rgba(51,51,51,0.9)"
                      bgImage={this.state.activeFreshman.user.profilePicture}
                      feature={true}
                      title={this.state.activeFreshman.user.name.full}
                      university={this.state.activeFreshman.university} /> :
                    <span className="scholars__current_freshmen_empty_picture"></span>
                }
              </section>
              <section>
                <TwoToneInfoCard heading="Freshmen"
                  subheading={`class of ${getClassificationYear("freshman")}`}
                  topBg="#FFCB61"
                  bottomBg="#FFB318">
                  {
                    this.state.freshmen && this.state.freshmen.length ?
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam venenatis rhoncus congue. Praesent eget facilisis tellus. Etiam quis est eu sem tristique consectetur a vel lacus. Praesent eu justo eleifend, blandit sem ut, laoreet sem.</p> :
                      <p>Looks like we are still matching our newest scholars with awesome universities. Please check back to see our newest additions and learn more about them.</p>
                  }
                </TwoToneInfoCard>
                {
                  this.state.freshmen && this.state.freshmen.length ?
                    <ScrollSwitcher options={
                        this.state.freshmen.map(student => {
                          return { label: student.user.name.full, value: student.uid }
                        })
                      }
                      onActiveChange={this.handleFreshmanChange} /> :
                    <span className="scholars__current_freshmen_empty"
                      style={{
                        backgroundImage: `url(${EmptyFreshmen})`
                      }}>
                    </span>
                }
              </section>
            </FlexContainer>
          </section>
        </section>
      </main>
    )
  }

  handleFreshmanChange = ({ value }) => {
    this.setState({
      activeFreshman: this.state.freshmen.find(freshman => {
        return freshman.uid === value;
      })
    });
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