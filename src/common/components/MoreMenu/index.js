import "./MoreMenu.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/fontawesome-free-solid";

export default class MoreMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  static propTypes = {
    menuItems: propTypes.arrayOf(propTypes.object)
  }

  render() {
    return (
      <div className="more_menu">
        <span className="more_menu__toggle"
          onClick={this.handleMenuToggle}>
          <FontAwesomeIcon icon={faEllipsisV} />
        </span>
        <ul className="more_menu__items" data-open={this.state.open}>
          {
            this.props.menuItems.length ?
              this.props.menuItems.map(item => {
                return (
                  <li key={item.label} className="more_menu__item"
                    onClick={item.doClick}>
                    {item.label}
                  </li>
                )
              }) : null
          }
        </ul>
      </div>
    );
  }

  handleMenuToggle = () => {
    this.setState({ open: !this.state.open });
  }
}
