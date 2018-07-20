import "./ViewScholar.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import _ from "lodash";

import { Student } from "../../../utils";

import ToTopContainer from "../../../components/ToTopContainer";
import PageMeta from "../../../components/PageMeta";
import ColoredStrip from "../../../components/ColoredStrip";

class ViewScholar extends Component {
  constructor(props) {
    super(props);

    let current;
    if (props.students.gotCurrentStudents) {
      current = props.students.students.find(student => {
        return student.uid === props.match.params.uid
      });
    }

    this.state = {
      current,
      students: props.students.gotCurrentStudents ? props.students.students : null
    }
  }

  static propTypes = {
    students: propTypes.object,
    match: propTypes.object
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.students.gotCurrentStudents &&
    !_.isEqual(nextProps.students.students, prevState.students)) {
      return {
        students: nextProps.students.students,
        current: nextProps.students.students.find(student => {
          return student.uid === nextProps.match.params.uid
        })
      }
    }

    return null;
  }

  render() {
    return (
      <React.Fragment>
        {
          this.props.students.gotCurrentStudents && this.state.current ?
            <PageMeta>
              <title>{this.state.current.user.name.full} | Scholars | Passport to College</title>
            </PageMeta> : null
        }
        <ToTopContainer classes="view_scholar">
          <section className="view_scholar__name">
            <span>
              {
                this.state.current ?
                  <h3 className="type__boldest">{this.state.current.user.name.full}</h3> : null
              }
            </span>
          </section>
            {this.getPictureBlock()}
        </ToTopContainer>
      </React.Fragment>
    )
  }

  getPictureBlock = () => {
    return (
      <section className="view_scholar__profile">
        {
          this.state.current && this.state.current.user.hasProfilePicture ?
            <span>
              <img src={this.state.current.user.profilePicture} alt="" /> 
            </span> :
            this.state.current && !this.state.current.user.hasProfilePicture ?
              <span className="view_scholar__empty_picture"></span> :
              <span></span>
        }
        {
          this.state.current ?
            <span>
              <ColoredStrip background="#11A5AC">
                <p className="type__uppercase type__light type__smaller">
                  {new Student(this.state.current, this.state.current.user).classification}
                </p>
                <h5>{this.state.current.university}</h5>
              </ColoredStrip>
            </span> : 
            <span className="view_scholar__loading"></span>
        }
      </section>
    );
  }
}

export default ViewScholar;

