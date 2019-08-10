import './Input.css';

import React, { Component } from 'react';

interface InputProps {
  inputType: string;
  inputName: string;
  inputDisabled: boolean;
  inputDefault: string;
  inputPlaceholder: string;
  whenChange?: (input: React.ChangeEvent<HTMLInputElement>) => void;
  whenBlur?: (input: React.FocusEvent<HTMLInputElement>) => void;
}

class Input extends Component<InputProps> {
  private input: HTMLInputElement | null = null;

  public render() {
    return (
      <input 
        className="input"
        ref={(input) => this.input = input}
        type={this.props.inputType}
        defaultValue={this.props.inputDefault}
        placeholder={this.props.inputPlaceholder}
        disabled={this.props.inputDisabled}
        name={this.props.inputName}
        onChange={this.onInputChange}
        onBlur={this.onInputBlur} 
      />
    );
  }

  public onInputChange = () => {
    if ('function' === typeof this.props.whenChange && this.input) {
      this.props.whenChange(this.input);
    }
  }

  public onInputBlur = () => {
    if ('function' === typeof this.props.whenBlur && this.input) {
      this.props.whenBlur(this.input);
    }
  }
}

export default Input;