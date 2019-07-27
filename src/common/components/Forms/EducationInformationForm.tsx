import './Forms.css';

import React, { Component } from 'react';
import Application from '../../models/Application';

interface EducationInformationFormProps {
  application: Application;
  disabled: boolean;
  updateApplicationField: (e: React.FocusEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
}

export default class EducationInformationForm extends Component<EducationInformationFormProps> {
  public render() {
    const { application, updateApplicationField, disabled } = this.props;

    return (
      <form className="form application_task__form application__education_information">
        <fieldset disabled={disabled}>
          <div className="form__input_container">
            <select 
              name="educationLevel" 
              required={true} 
              defaultValue={application.educationLevel || ''}
              onChange={updateApplicationField}
            >
              <option value="" disabled={true}>Select One</option>
              <option value="no high school">Less than high school</option>
              <option value="high school">High school graduate</option>
              <option value="college no degree">Some college, no degree</option>
              <option value="associate">Associate&apos;s degree</option>
              <option value="bachelor">Bachelor&apos;s degree</option>
              <option value="graduate">Graduate or professional degree</option>
            </select>
            <label>What is the highest level of education you have completed?</label>
          </div>
          <div className="form__input_container">
            <input 
              type="text" 
              name="lastSchool" 
              required={true}
              placeholder="Boat School of Hogwarts"
              defaultValue={application.lastSchool}
              onBlur={updateApplicationField} 
            />
            <label>What is the last school you attended?</label>
          </div>
          <div className="form__input_container">
            <input 
              type="number" 
              name="gpa" 
              required={true} 
              min="0" 
              max="4.00"
              step="0.01" 
              placeholder="3.88"
              defaultValue={application.gpa!.toString()}
              onBlur={updateApplicationField} 
            />
            <label>What is grade point average (GPA) out of 4.00?</label>
          </div>
        </fieldset>
      </form>
    );
  }
}
