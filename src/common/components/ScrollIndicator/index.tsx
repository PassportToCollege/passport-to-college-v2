import './ScrollIndicator.css';

import React, { PureComponent } from 'react';

export default class ScrollIndicator extends PureComponent {
  public render() {
    return (
      <span className="scroll_indicator">
        <span className="scroll_indicator__vert_line"/>
        <span className="scroll_indicator__arrow_down"/>
        <span className="scroll_indicator__mouse_body"/>
      </span>
    );
  }
}