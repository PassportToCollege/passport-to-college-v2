import "./ClassificationBlock.css";

import React, { Component } from "react";
import propTypes from "prop-types";

import { getClassificationYear, makeClassString } from "../../utils";

import FlexContainer from "../FlexContainer";
import InfoCard from "../InfoCard";
import TwoToneInfoCard from "../TwoToneInfoCard";
import ScrollSwitcher from "../ScrollSwitcher";

class ClassificationBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStudent: props.students.length ? props.students[0] : null
    };
  }

  static propTypes = {
    students: propTypes.arrayOf(propTypes.object),
    classification: propTypes.string,
    classes: propTypes.arrayOf(propTypes.string),
    emptyPicture: propTypes.string,
    header: propTypes.object
  }

  static defaultProps = {
    classes: []
  }

  render() {
    return (
      <section className={makeClassString(["classification_block", ...this.props.classes])}
        id={this.props.classification}>
        <FlexContainer>
          <section>
            {
              this.props.students && this.props.students.length ?
                <InfoCard feature
                  bgOverlay="rgba(51,51,51,0.9)"
                  bgColor="rgba(51,51,51,0.9)"
                  bgImage={this.state.activeStudent.user.profilePicture}
                  title={this.state.activeStudent.user.name.full}
                  university={this.state.activeStudent.university} /> :
                <span className="classification_block__empty_picture"></span>
            }
          </section>
          <section>
            <TwoToneInfoCard heading={this.props.classification}
              subheading={`class of ${getClassificationYear(this.props.classification)}`}
              topBg={this.props.header.topBg}
              bottomBg={this.props.header.bottomBg}>
              {this.props.header.info}
            </TwoToneInfoCard>
            {
              this.props.students && this.props.students.length ?
                <ScrollSwitcher options={
                    this.props.students.map(student => {
                      return { label: student.user.name.full, value: student.uid }
                    })
                  }
                  onActiveChange={this.handleStudentChange} /> :
                  <span className="classification_block__empty"
                    style={{
                      backgroundImage: `url(${this.props.emptyPicture})`
                    }}>
                  </span>
            }
          </section>
        </FlexContainer>
      </section>
    )
  }

  handleStudentChange = ({ value }) => {
    this.setState({
      activeStudent: this.props.students.find(student => {
        return student.uid === value;
      })
    });
  }
}

export default ClassificationBlock;