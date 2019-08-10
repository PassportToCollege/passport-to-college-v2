import './Select.css';

import React, { Component } from 'react';

interface SelectProps {
  selectName: string;
  selectDisabled: boolean;
  selectDefault: string;
  whenChange: (e: HTMLSelectElement | null) => void;
  children: React.ReactNode;
}

export default class Select extends Component<SelectProps> {
  private select: HTMLSelectElement | null = null;

  public render() {
    return (
      <select 
        className="select"
        ref={(select) => this.select = select}
        defaultValue={this.props.selectDefault}
        disabled={this.props.selectDisabled}
        name={this.props.selectName}
        onChange={this.onSelectChange}
      >
        {this.props.children}
      </select>
    );
  }

  private onSelectChange = () => {
    if ('function' === typeof this.props.whenChange) {
      this.props.whenChange(this.select);
    }
  }
}