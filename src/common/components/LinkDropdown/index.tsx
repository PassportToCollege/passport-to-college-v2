import './LinkDropdown.css';

import React, { Component } from 'react';
import { withRouter, NavLink, RouteComponentProps } from 'react-router-dom';

export interface LinkDropdownData {
  to: string;
  label: string;
}

interface LinkDropdownProps extends RouteComponentProps {
  name: string;
  data: LinkDropdownData[];
  handleLinkClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

class LinkDropdown extends Component<LinkDropdownProps> {
  private dropdown: HTMLUListElement | null = null;

  private toggleState = () => {
    if (this.dropdown) {
      const curr = this.dropdown.getAttribute('data-state');
      this.dropdown.setAttribute('data-state', curr === 'closed' ? 'open' : 'closed');
    }
  }

  private handleBlur = (e: React.FocusEvent<HTMLUListElement>) => {
    if (this.dropdown) {
      e.preventDefault();
      this.dropdown.setAttribute('data-state', 'closed');
    }
  }

  public render() {
    return (
      <ul 
        className="link_dropdown" 
        data-state="closed"
        tabIndex={0}
        ref={(ul) => this.dropdown = ul}
        onBlur={this.handleBlur}
      >
        <li 
          className="link_dropdown__toggle"
          onClick={this.toggleState}
        >
          {this.props.name}
        </li>
        <li className="link_dropdown__items">
          <ul>
            {
              this.props.data.map((item, i) => {
                return (
                  <li key={i} className="link_dropdown__item">
                    <NavLink 
                      exact={true} 
                      to={item.to} 
                      className="link_dropdown__link"
                      activeClassName="active"
                      data-label={item.label}
                      onClick={this.props.handleLinkClick}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                );
              })
            }
          </ul>
        </li>
      </ul>
    );
  }
}

export default withRouter(LinkDropdown);