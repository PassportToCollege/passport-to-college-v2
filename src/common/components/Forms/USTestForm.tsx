import './Forms.css';

import React, { Component } from 'react';
import Application from '../../models/Application';

interface USTestFormProps {
  application: Application;
  disabled: boolean;
  updateApplicationField: (e: React.FocusEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
}

export default class USTestForm extends Component<USTestFormProps> {
  public render() {
    const { application, updateApplicationField, disabled } = this.props;

    return (
      <form className="form application_task__form application__us_test">
        <fieldset disabled={disabled}>
          <div className="form__input_container">
            <select 
              name="usTest" 
              required={true} 
              defaultValue={`${application.usTest}`}
              onChange={updateApplicationField}
            >
              <option value="" disabled={true}>Select One</option>
              <option value="none">None</option>
              <option value="ACT">ACT</option>
              <option value="SAT">SAT</option>
            </select>
            <label>Which U.S. standardized test have you taken?</label>
            <span className="type__small type__block">Selecting none will not affect your application.</span>
            <span className="type__small type__block">
              If you have sat multiple tests, select the test with your highest score.
            </span>
          </div>
          <div className="form__input_container">
            <input 
              type="number" 
              required={true} 
              min="0" 
              max="2400"
              placeholder="0" 
              name="score"
              defaultValue={application.score!.toString()}
              onBlur={updateApplicationField} 
            />
            <label>Score</label>
            <span className="type__small">Enter 0 if you selected &apos;None.&apos;</span>
          </div>
        </fieldset>
      </form>
    );
  }
} 