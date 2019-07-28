import './Modal.css';

import React, { Component } from 'react';
import Student, { StudentProps } from '../../models/Student';
import Button from '../Button';

interface EditStudentEducationProps {
  student: Student;
  doClose: () => void;
  doSubmit: (student: Student) => void;
}

interface EditStudentEducationState {
  student: Student;
}

export default class EditStudentEducation extends Component<EditStudentEducationProps, EditStudentEducationState> {
  constructor(props: EditStudentEducationProps) {
    super(props);

    this.state = {
      student: props.student
    };
  }

  private modalContainer: HTMLDivElement | null = null;

  private closeModal = () => {
    if (this.modalContainer) {
      this.modalContainer.classList.add('close');
    }

    if ('function' === typeof this.props.doClose) {
      this.props.doClose();
    }
  }

  public handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (this.modalContainer) {
      this.modalContainer.classList.add('close');
    }

    if ('function' === typeof this.props.doSubmit) {
      this.props.doSubmit(this.state.student);
    }
  }

  public handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      student: this.state.student.updatePropAndReturnUser(
          e.target.name as StudentProps, 
          e.target.value
        )
    });
  }

  public render() {
    const { student } = this.state;

    return (
      <div 
        className="modal__container modal__edit_user_personal"
        ref={(div) => this.modalContainer = div}
      >
        <div className="modal__bg" onClick={this.closeModal} />
        <div className="modal__content">
          <h3>{`Edit ${student.User.name.full()}`}</h3>
          <form className="form form__edit_user_personal">
            <div className="form__input_container">
              <label>High School</label>
              <input 
                type="text" 
                name="highSchool" 
                required={true}
                defaultValue={student.highSchool}
                onChange={this.handleFormChange} 
              />
            </div>
            <div className="form__input_container">
              <label>University</label>
              <input 
                type="text" 
                name="university" 
                required={true}
                defaultValue={student.university}
                onChange={this.handleFormChange} 
              />
            </div>
            <div className="form__input_container">
              <label>Major</label>
              <input 
                type="text" 
                name="major" 
                required={true}
                defaultValue={student.major}
                onChange={this.handleFormChange} 
              />
            </div>
            <div className="form__input_container">
              <label>Minor</label>
              <input 
                type="text" 
                name="minor"
                defaultValue={student.minor}
                onChange={this.handleFormChange} 
              />
            </div>
            <h4>Meta Information</h4>
            <div className="form__input_container">
              <label>Enrollment Year</label>
              <input 
                type="number" 
                name="enrollmentYear" 
                required={true}
                min="2013" 
                max={`${new Date().getFullYear()}`}
                defaultValue={`${student.enrollmentYear}`}
                onChange={this.handleFormChange} 
              />
            </div>
            <div className="form__input_container">
              <label>Graduation Year</label>
              <input 
                type="number" 
                name="graduationYear" 
                required={true}
                min="2017"
                defaultValue={`${student.graduationYear}`}
                onChange={this.handleFormChange} 
              />
            </div>
            <Button 
              solid={true}
              disabled={false} 
              type="submit" 
              doClick={this.handleSubmit}
              text="save" 
            />
          </form>
        </div>
      </div>
    );
  }
}
