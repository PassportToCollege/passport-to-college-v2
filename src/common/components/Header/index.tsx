import './Header.css';

import React, { Component } from 'react';

const downArrow = require('../../assets/images/downArrow.png');

interface HeaderProps {
  background: string;
  scrollElement: string;
}

class Header extends Component<HeaderProps> {
  public render() {
    return (
      <header 
        className="header header__default" 
        style={{
          backgroundImage: `url(${this.props.background})`
        }}
      >
        <i 
          className="header__scroll_icon" 
          data-scroll-to={this.props.scrollElement}
        >
          <img src={downArrow} alt=""/>
        </i>
      </header>
    );
  }
}

export default Header;