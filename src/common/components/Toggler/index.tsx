import './Toggler.css';

import React, { PureComponent } from 'react';

interface TogglerProps {
  state: 'yes' | 'no';
  disabled: boolean;
  doClick: (state: 'yes' | 'no', clickArgument: string) => void;
  clickArgument: string;
  title?: string;
}

export default class Toggler extends PureComponent<TogglerProps> {
  private handleClick = () => {
    if (this.props.disabled) {
      return;
    }

    this.props.doClick(this.props.state, this.props.clickArgument);
  }

  public render() {
    const { state = 'no', disabled, title = '' } = this.props;
    return (
      <span 
        className={`toggler toggler__${state}`}
        onClick={this.handleClick}
        data-disabled={disabled ? 'disabled' : 'enabled'}
        title={title}
      >
        <span className="toggler__ball"/>
      </span>
    );
  }
}