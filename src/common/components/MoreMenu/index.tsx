import './MoreMenu.css';

import React, { Component } from 'react';
import propTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/fontawesome-free-solid';

export interface MoreMenuItem {
  label: string;
  doClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
}

interface MoreMenuProps {
  menuItems: MoreMenuItem[];
}

interface MoreMenuState {
  open: boolean;
}

export default class MoreMenu extends Component<MoreMenuProps, MoreMenuState> {
  constructor(props: MoreMenuProps) {
    super(props);

    this.state = {
      open: false
    };
  }

  private handleMenuToggle = () => {
    this.setState({ open: !this.state.open });
  }

  public render() {
    return (
      <div className="more_menu">
        <span 
          className="more_menu__toggle"
          onClick={this.handleMenuToggle}
        >
          <FontAwesomeIcon icon={faEllipsisV} />
        </span>
        <ul className="more_menu__items" data-open={this.state.open}>
          {
            this.props.menuItems.length ?
              this.props.menuItems.map((item) => {
                return (
                  <li 
                    key={item.label} 
                    className="more_menu__item"
                    onClick={item.doClick}
                  >
                    {item.label}
                  </li>
                );
              }) : null
          }
        </ul>
      </div>
    );
  }
}
