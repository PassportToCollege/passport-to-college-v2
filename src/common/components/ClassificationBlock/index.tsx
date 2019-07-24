import './ClassificationBlock.css';

import React, { Component } from 'react';

import { getClassificationYear, makeClassString } from '../../utils';

import FlexContainer from '../FlexContainer';
import InfoCard from '../InfoCard';
import TwoToneInfoCard from '../TwoToneInfoCard';
import ScrollSwitcher, { ScrollSwitcherOption } from '../ScrollSwitcher';
import Student from '../../models/Student';

export interface ClassificationBlockHeader {
  topBg: string;
  bottomBg: string;
  info: React.ReactNode;
}

interface ClassificationBlockProps {
  students: Student[];
  classification: string;
  classes?: string[];
  emptyPicture: string;
  header: ClassificationBlockHeader;
}

interface ClassificationBlockState {
  activeStudent?: Student;
}

class ClassificationBlock extends Component<ClassificationBlockProps, ClassificationBlockState> {
  constructor(props: ClassificationBlockProps) {
    super(props);

    this.state = {
      activeStudent: props.students.length 
        ? props.students[0] 
        : undefined
    };
  }

  private handleStudentChange = (active: ScrollSwitcherOption) => {
    this.setState({
      activeStudent: this.props.students.find((student) => {
        return student.uid === active.value;
      })
    });
  }

  public render() {
    const classes = this.props.classes || [];
    const { activeStudent } = this.state;

    return (
      <section 
        className={makeClassString(['classification_block', ...classes])}
        id={this.props.classification}
      >
        <FlexContainer>
          <section>
            {
              activeStudent ?
                <InfoCard 
                  feature={true}
                  bgOverlay="rgba(51,51,51,0.9)"
                  bgColor="rgba(51,51,51,0.9)"
                  bgImage={activeStudent.User.photo}
                  title={activeStudent.User.name.full()}
                  university={activeStudent.university}
                  target={`/scholars/view/scholar/${activeStudent.uid}`}
                /> :
                
                <span className="classification_block__empty_picture"/>
            }
          </section>
          <section>
            <TwoToneInfoCard 
              heading={this.props.classification}
              subheading={`class of ${getClassificationYear(this.props.classification)}`}
              topBg={this.props.header.topBg}
              bottomBg={this.props.header.bottomBg}
            >
              {this.props.header.info}
            </TwoToneInfoCard>
            {
              this.props.students && this.props.students.length
                ? <ScrollSwitcher
                  autoplay={true} 
                  options={
                    this.props.students.map((student) => {
                      return { label: student.User.name.full(), value: student.uid };
                    })
                  }
                  onActiveChange={this.handleStudentChange} 
                /> 
                : <span 
                  className="classification_block__empty"
                  style={{
                    backgroundImage: `url(${this.props.emptyPicture})`
                  }}
                />
            }
          </section>
        </FlexContainer>
      </section>
    );
  }
}

export default ClassificationBlock;