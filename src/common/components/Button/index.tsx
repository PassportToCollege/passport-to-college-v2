import './Button.css';

import React, { Component } from 'react';

interface ButtonProps {
  styles?: React.CSSProperties;
  type: 'button' | 'reset' | 'submit' | undefined;
  doClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  text: string;
  solid: boolean;
  disabled: boolean;
}

interface BackButtonProps {
  doClick: () => void;
  text: string;
}

class Button extends Component<ButtonProps> {
  private handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if ('function' === typeof this.props.doClick) {
      this.props.doClick(e);
    }
  }

  public render() {
    let buttonStyles = { ...this.props.styles };

    if (this.props.solid) {
      buttonStyles = { ...buttonStyles, ...{
          backgroundColor: (this.props.styles && this.props.styles.backgroundColor) 
            ? this.props.styles.backgroundColor 
            : '#FF6561',
          borderColor: (this.props.styles && this.props.styles.backgroundColor) 
            ? this.props.styles.backgroundColor 
            : '#FF6561',
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
        className="button" 
        type={this.props.type} 
        onClick={this.handleClick} 
        style={buttonStyles}
        disabled={this.props.disabled}
      >
        {this.props.text}
      </button>
    );
  }
}

export const BackButton = (props: BackButtonProps) => {
  const { doClick, text } = props;

  const handleClick = () => {
    if ('function' === typeof doClick) {
      return doClick();
    }
  };

  return (
    <button 
      type="button" 
      className="button__back"
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default Button;