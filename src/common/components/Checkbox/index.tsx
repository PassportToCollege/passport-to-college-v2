import './Checkbox.css';

import React, { Component } from 'react';

interface CheckboxProps {
  boxName: string;
  boxValue: string;
  boxChecked?: string;
  boxLabel: string;
  doClick: (boxName: string, boxChecked: boolean) => void;
}

class Checkbox extends Component<CheckboxProps> {
  private static defaultProps = {
    boxChecked: false
  };

  public render() {
    return (
      <div 
        className="checkbox__container" 
        role="tablist"
      >
        <span 
          className="checkbox" 
          role="tab"
          data-checked={this.props.boxChecked ? 'checked' : 'unchecked'}
          onClick={this.handleCheckboxClick}
        >
          <span className="checkbox__inner"/>
        </span>
        <span 
          className="checkbox__label"
          onClick={this.handleCheckboxClick}
        >
          {this.props.boxLabel}
        </span>
      </div>
    );
  }

  public handleCheckboxClick = () => {
    if ('function' === typeof this.props.doClick) {
      this.props.doClick(this.props.boxName, !this.props.boxChecked);
    }
  }
}

export default Checkbox;