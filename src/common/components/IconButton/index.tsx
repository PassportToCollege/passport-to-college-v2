import './IconButton.css';

import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrashAlt, 
  faEdit, 
  faInfo, 
  faExternalLinkAlt, 
  faThumbsUp, 
  faReply, 
  faEnvelope, 
  faCog } from '@fortawesome/fontawesome-free-solid';
import { faFacebookF, faTwitter, faLinkedinIn } from '@fortawesome/fontawesome-free-brands';

interface IconButtonProps {
  doClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  styles: React.CSSProperties;
  solid: boolean;
  disabled: boolean;
  type?: 'button' | 'reset' | 'submit' | undefined;
  buttonTitle?: string;
  icon: string;
}

class IconButton extends Component<IconButtonProps, any> {
  private handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if ('function' === typeof this.props.doClick) {
      this.props.doClick(e);
    }
  }

  public render() {
    const icons = {
      default: faInfo,
      delete: faTrashAlt,
      edit: faEdit,
      open: faExternalLinkAlt,
      like: faThumbsUp,
      facebook: faFacebookF,
      twitter: faTwitter,
      linkedin: faLinkedinIn,
      email: faEnvelope,
      reply: faReply,
      cog: faCog
    };
    let buttonStyles = { ...this.props.styles };

    if (this.props.solid) {
      buttonStyles = { ...buttonStyles, ...{
          backgroundColor: this.props.styles.backgroundColor || '#FF6561',
          borderColor: this.props.styles.backgroundColor || '#FF6561',
          color: '#fff'
        }
      };
    }

    if (this.props.disabled) {
      buttonStyles = { ...buttonStyles, ...{
          backgroundColor: '#999',
          borderColor: '#999',
          cursor: 'auto'
        }
      };
    }

    return (
      <button 
        className="icon_button" 
        type={this.props.type} 
        onClick={this.handleClick}
        style={buttonStyles}
        disabled={this.props.disabled}
        title={this.props.buttonTitle}
      >
        <FontAwesomeIcon icon={icons[this.props.icon]} />
      </button>
    );
  }
}

export default IconButton;