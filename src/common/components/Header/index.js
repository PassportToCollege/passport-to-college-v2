import "./Header.css";

import React, { Component } from "react";
import propTypes from "prop-types";

import downArrow from "../../assets/images/downArrow.png";

class Header extends Component {
  static propTypes = {
    background: propTypes.string,
    scrollEl: propTypes.string
  }

  render() {
    return (
      <header className="header header__default" style={{
        backgroundImage: `url(${this.props.background})`
      }}>
        <i className="header__scroll_icon" data-scroll-to={this.props.scrollEl}>
          <img src={downArrow} alt=""/>
        </i>
      </header>
    )
  }
}

export default Header;