import './Forms.css';

import React, { Component } from 'react';
import Button from '../Button';

interface NationalTestFormProps {
  handleTestAdded: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLSelectElement> | React.FocusEvent<HTMLInputElement>) => void;
}

export default class NationalTestForm extends Component<NationalTestFormProps> {
  private inputChanged = (e: React.ChangeEvent<HTMLSelectElement> | React.FocusEvent<HTMLInputElement>) => {
    if ('function' === typeof this.props.handleInputChange) {
      this.props.handleInputChange(e);
    }
  }

  private formSubmitted = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if ('function' === typeof this.props.handleTestAdded) {
      this.props.handleTestAdded();
    }
  }

  public render() {
    return (
      <form 
        className="form application_task__form application__national_test"
        onSubmit={this.formSubmitted}
      >
        <h2>Add a new national test</h2>
        <div className="form__input_container">
          <select 
            name="hasTaken" 
            required={true} 
            defaultValue="" 
            onChange={this.inputChanged}
          >
            <option value="" disabled={true}>Select One</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <label>Have you already taken this test?</label>
        </div>
        <div className="form__input_container">
          <input 
            type="text" 
            name="country" 
            required={true} 
            placeholder="Jamaica"
            onBlur={this.inputChanged} 
          />
          <label>Country</label>
        </div>
        <div className="form__input_container">
          <input 
            type="text" 
            name="board" 
            required={true} 
            placeholder="CXC"
            onBlur={this.inputChanged} 
          />
          <label>Examination Board</label>
        </div>
        <div className="form__input_container">
          <input 
            type="text" 
            name="examination" 
            required={true} 
            placeholder="CAPE"
            onBlur={this.inputChanged} 
          />
          <label>Examination</label>
        </div>
        <div className="form__input_container">
          <input 
            type="text" 
            name="subject" 
            required={true} 
            placeholder="Mathematics"
            onBlur={this.inputChanged} 
          />
          <label>Subject</label>
        </div>
        <div className="form__input_container">
          <input 
            type="number" 
            name="year" 
            required={true}
            placeholder={`${new Date().getFullYear() - 5}`}
            min="2000"
            max={new Date().getFullYear()}
            onBlur={this.inputChanged} 
          />
          <label>Year</label>
        </div>
        <div className="form__input_container">
          <input 
            type="number" 
            name="grade" 
            required={true} 
            placeholder="1"
            onBlur={this.inputChanged} 
          />
          <label>Grade (Number)</label>
        </div>
        <Button type="submit" text="add" solid={true} disabled={false}/>
      </form>
    );
  }
}