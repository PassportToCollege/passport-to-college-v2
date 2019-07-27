import './Forms.css';

import React, { Component } from 'react';
import Application from '../../models/Application';

interface MiscellaneousFormProps {
  application: Application;
  disabled: boolean;
  updateApplicationField: (e: React.FocusEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
}

export default class MiscellaneousForm extends Component<MiscellaneousFormProps> {
  public render() {
    const { application, updateApplicationField, disabled } = this.props;

    return (
      <form className="form application_task__form application__misc">
        <fieldset disabled={disabled}>
          <div className="form__input_container">
            <select 
              id="income" 
              name="income" 
              required={true} 
              defaultValue={`${application.income}`}
              onChange={updateApplicationField}
            >
              <option value="" disabled={true}>Select One</option>
              <option value="10000">Less than $10,000</option>
              <option value="34999">Less than $35,000 but more tha $10,000</option>
              <option value="49999">Less than $50,000 but more than $35,000</option>
              <option value="74999">Less than $75,000 but more than $50,000</option>
              <option value="99999">Less than $100,000 but more than $75,000</option>
              <option value="149999">Less than $150,000 but more than $100,000</option>
              <option value="150000">More than $150,000</option>
            </select>
            <label htmlFor="income">
              Which of these categories best describe your family&apos;s combined annual income (USD)?
          </label>
          </div>
          <div className="form__input_container">
            <select 
              id="interest" 
              name="interest" 
              required={true} 
              defaultValue={`${application.interest}`}
              onChange={updateApplicationField}
            >
              <option value="" disabled={true}>Select One</option>
              <option value="business">Business</option>
              <option value="education">Education</option>
              <option value="humanities">Humanities</option>
              <option value="stem">STEM</option>
              <option value="undecided">Undecided</option>
            </select>
            <label htmlFor="interest">
              Which of these categories best describe the area of study you would like to pursue?
          </label>
          </div>
          <div className="form__input_container">
            <select 
              id="workEthic" 
              name="workEthic" 
              required={true} 
              defaultValue={`${application.workEthic}`}
              onChange={updateApplicationField}
            >
              <option value="" disabled={true}>Select One</option>
              <option value="below average">I love sleep</option>
              <option value="average">Average</option>
              <option value="excellent">Grind all night</option>
            </select>
            <label htmlFor="workEthic">
              Which of these categories best describe your work ethic?
          </label>
          </div>
        </fieldset>
      </form>
    );
  }
}