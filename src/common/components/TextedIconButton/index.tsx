import './TextedIconButton.css';

import React, { PureComponent } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook } from '@fortawesome/fontawesome-free-brands';

interface TextedIconButtonProps {
  doClick: () => void;
  type?: 'button' | 'submit' | 'reset';
  icon: string;
  text: string;
  buttonStyles: React.CSSProperties;
}

export default class TextedIconButton extends PureComponent<TextedIconButtonProps> {
  private icons = {
    google: faGoogle,
    facebook: faFacebook
  };

  public render() {
    const { doClick, type, icon, text, buttonStyles } = this.props;

    return (
      <button 
        className="texted_icon_button" 
        type={type}
        onClick={doClick}
        style={buttonStyles}
      >
        <span className={`texted_icon_button__icon ${icon}`}>
          <FontAwesomeIcon icon={this.icons[icon]} />
        </span>
        <span className="texted_icon_button__text">{text}</span>
      </button>
    );
  }
}