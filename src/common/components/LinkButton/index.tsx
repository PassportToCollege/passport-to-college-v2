import './LinkButton.css';

import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/fontawesome-free-solid';

export interface LinkButtonProps {
  target: string;
  default?: boolean;
  text?: string;
  icon?: string;
  classes?: string;
}

const LinkButton = (props: LinkButtonProps) => {
  props = props || {};
  let icon;
  let classes = `link__button ${props.classes || ''}`;

  if (props.default) {
    classes += ' link__button_default';
  }

  if (props.icon === 'faHome') {
    icon = faHome;
  }

  return (
    <Link to={props.target} className={classes}>
      {
        props.text ? props.text : null
      }
      {
        props.icon ? 
          <FontAwesomeIcon icon={icon} />
        :
          null
      }
    </Link>
  );
};

export default LinkButton;