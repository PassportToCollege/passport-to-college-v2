import React, { PureComponent } from 'react';

interface ToTopContainerProps {
  children: React.ReactNode;
  classes?: string;
}

export default class ToTopContainer extends PureComponent<ToTopContainerProps> {
  private isIE() {
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf('MSIE ');

    return msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./);
  }

  public componentDidMount() {
    if (!this.isIE()) {
      if ('function' === typeof document.scrollingElement!.scrollTo) {
        document.scrollingElement!.scrollTo(0, 0);
      } else {
        document.scrollingElement!.scrollTop = 0;
      }
    }
  }

  public render() {
    return (
      <div className={`to_top_container ${this.props.classes}`}>
        {this.props.children}
      </div>
    );
  }
}