import './CardNavigation.css';

import React, { Component } from 'react';
import { NavLink, withRouter, RouteComponentProps } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faUserGraduate,
  faBriefcase,
  faUserTie,
  faLock
} from '@fortawesome/fontawesome-free-solid';

export interface CardNavigationLocation {
  icon: string;
  label: string; 
  pathname: string;
}

interface CardNavigationProps extends RouteComponentProps {
  locations?: CardNavigationLocation[];
  styles?: React.CSSProperties;
}

class CardNavigation extends Component<CardNavigationProps, any> {
  private icons = {
    users: faUsers,
    students: faUserGraduate,
    staff: faBriefcase,
    applicants: faUserTie,
    admins: faLock
  };

  private getIcon = (icon: any) => {
    return this.icons[icon];
  }

  public render() {
    return (
      <nav 
        className="card_navigation" 
        style={this.props.styles}
      >
        { 
          this.props.locations && this.props.locations.length ?
            this.props.locations.map((location: CardNavigationLocation) => {
              return (
                <NavLink 
                  exact={true} 
                  key={location.pathname} 
                  to={location.pathname}
                  activeClassName="active" 
                  className="card_navigation__item"
                >
                  <span className="card_navigation__icon">
                    <FontAwesomeIcon icon={this.getIcon(location.icon)} />
                  </span>
                  <span className="card_navigation__label">{location.label}</span>
                </NavLink>
              );
            }) : null
          }
      </nav>
    );
  }
}

export default withRouter(CardNavigation);