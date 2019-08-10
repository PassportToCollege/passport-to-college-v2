import './StudentInfoCard.css';

import React, { Component } from 'react';

import { isBrowser } from '../../utils';

import ImageWithColoredShadow from '../ImageWithColoredShadow';
import WYSIWYGEditor from '../Editor';
import IconButton from '../IconButton';
import Student from '../../models/Student';

interface StudentInfoCardProps {
  student: Student;
  accent: string;
  backgroundColor: string;
}

interface StudentInfoCardState {
  active: 'bio' | 'education' | 'social';
  singleColumn: boolean;
}

export default class StudentInfoCard extends Component<StudentInfoCardProps, StudentInfoCardState> {
  constructor(props: StudentInfoCardProps) {
    super(props);

    this.state = {
      active: 'bio',
      singleColumn: isBrowser && window.innerWidth <= 998
    };
  }

  private renderSingleColumn = () => {
    return (
      <div 
        className="student_info_card__container student_info_card__single_column"
        style={{ backgroundColor: this.props.backgroundColor }}
      >
        <ImageWithColoredShadow 
          width="300px" 
          shadowColor={this.props.accent}
          image={this.props.student.User.photo} 
        />
        <h5 className="type__uppercase type__boldest">{this.props.student.User.name.full()}</h5>
        <p>{this.props.student.university}</p>
        {this.getBio()}
        <h4 className="type__boldest type__uppercase">education</h4>
        {this.getEducation()}
        <h4 className="type__boldest type__uppercase">social</h4>
        <IconButton 
          solid={true}
          disabled={false} 
          icon="linkedin"
          doClick={this.handleLinkClick}
          styles={{
            backgroundColor: '#0077B5',
            marginTop: '2em'
          }} 
        />
      </div>
    );
  }

  private watchWindowWidth = () => {
    const { innerWidth } = window;
    const { singleColumn } = this.state;

    if (innerWidth <= 998 && !singleColumn) {
      this.setState({ singleColumn: true });
    } else if (innerWidth > 998 && singleColumn) {
      this.setState({ singleColumn: false });
    }
  }

  private getBio = () => {
    return (
      <WYSIWYGEditor 
        readonly={true}
        content={this.props.student.bio}
        editorStyles={{
          border: 'none',
          margin: '0 auto',
          maxWidth: '100%',
          padding: '3em 0',
          minHeight: 'auto'
        }} 
      />
    );
  }

  private getEducation = () => {
    return (
      <span>
        <p className="type__smaller type__uppercase">university</p>
        <p>{this.props.student.university}</p>
        <p className="type__smaller type__uppercase type__margin_top">major</p>
        <p>{this.props.student.major}</p>
        {
          this.props.student.minor ?
            <React.Fragment>
              <p className="type__smaller type__uppercase type__margin_top">minor</p>
              <p>{this.props.student.minor}</p>
            </React.Fragment> : null
        }
        <p className="type__smaller type__uppercase type__margin_top">graduation year</p>
        <p>{this.props.student.graduationYear}</p>
      </span>
    );
  }

  private handleLinkClick = () => {
    const { socials } = this.props.student.User;

    if (socials) {
      window.open(socials.linkedin);
    }
  }

  public componentDidMount() {
    if (isBrowser) {
      window.addEventListener('resize', this.watchWindowWidth);
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.watchWindowWidth);
  }

  public render() {
    if (this.state.singleColumn) {
      return this.renderSingleColumn();
    }

    return (
      <div 
        className="student_info_card__container student_info_card__two_columns"
        style={{ backgroundColor: this.props.backgroundColor }}
      >
        <section className="student_info_card__left">
          <ImageWithColoredShadow 
            width="300px" 
            shadowColor={this.props.accent} 
            image={this.props.student.User.photo} 
          />
          <h5 className="type__uppercase type__boldest">{this.props.student.User.name.full()}</h5>
          <p>{this.props.student.university}</p>
          <nav>
            <h4 
              className="type__boldest type__uppercase"
              onClick={() => this.setState({ active: 'bio' })}
              data-active={this.state.active === 'bio' 
                ? 'active' 
                : 'inactive'
              }
            >
                  bio
            </h4>
            <h4 
              className="type__boldest type__uppercase"
              onClick={() => this.setState({ active: 'education' })}
              data-active={this.state.active === 'education' 
                ? 'active' 
                : 'inactive'
              }
            >
              education
            </h4>
            <h4 
              className="type__boldest type__uppercase"
              onClick={() => this.setState({ active: 'social' })}
              data-active={this.state.active === 'social' 
                ? 'active' 
                : 'inactive'
              }
            >
              social
            </h4>
          </nav>
        </section>
        <section className="student_info_card__right">
          {
            this.state.active === 'bio' ?
              this.getBio() : null
          }
          {
            this.state.active === 'education' ?
              this.getEducation() : null
          }
          {
            this.state.active === 'social'
              ? <IconButton 
                disabled={false}
                solid={true} 
                icon="linkedin"
                doClick={this.handleLinkClick} 
                styles={{
                  backgroundColor: '#0077B5',
                  marginTop: '2em'
                }} 
              /> 
              : null
          }
        </section>
      </div>
    );
  }
}