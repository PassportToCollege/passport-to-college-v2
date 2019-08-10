import './ParallaxHeader.css';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/fontawesome-free-solid';

import LinkButton, { LinkButtonProps } from '../LinkButton';
import ScrollIndicator from '../ScrollIndicator';

export interface BackgroundImage {
  image: string;
  color: string;
}

interface ParallaxHeaderProps {
  height: string;
  overlayColor: string;
  bigText: string;
  linkButton: LinkButtonProps;
  showScrollStrip: boolean;
  flipStrip: boolean;
  backgroundImages: BackgroundImage[];
  setInterval: (interval: NodeJS.Timeout) => void;
}

interface ParallaxHeaderState {
  currentBackground: string;
  currentBackgroundColor: string;
  backgroundCount: number;
}

class ParallaxHeader extends Component<ParallaxHeaderProps, ParallaxHeaderState> {
  constructor(props: ParallaxHeaderProps) {
    super(props);

    this.state = {
      currentBackground: props.backgroundImages[0].image,
      currentBackgroundColor: props.backgroundImages[0].color,
      backgroundCount: 0
    };
  }

  private previousBg = () => {
    const { backgroundCount } = this.state;
    const { backgroundImages } = this.props;

    if (backgroundCount === 0) {
      this.setState({
        currentBackground: backgroundImages[backgroundImages.length - 1].image,
        currentBackgroundColor: backgroundImages[backgroundImages.length - 1].color,
        backgroundCount: backgroundImages.length - 1
      });
    } else {
      this.setState({
        currentBackground: backgroundImages[backgroundCount - 1].image,
        currentBackgroundColor: backgroundImages[backgroundCount - 1].color,
        backgroundCount: backgroundCount - 1
      });
    }
  }

  private nextBg = () => {
    const { backgroundCount } = this.state;
    const { backgroundImages } = this.props;

    if (backgroundCount === backgroundImages.length - 1) {
      this.setState({
        currentBackground: backgroundImages[0].image,
        currentBackgroundColor: backgroundImages[0].color,
        backgroundCount: 0
      });
    } else {
      this.setState({
        currentBackground: backgroundImages[backgroundCount + 1].image,
        currentBackgroundColor: backgroundImages[backgroundCount + 1].color,
        backgroundCount: backgroundCount + 1
      });
    }
  }

  public componentDidMount() {
    const interval = setInterval(() => { this.nextBg(); }, 7000);
    this.props.setInterval(interval);
  }

  public render() {
    return (
      <div 
        className="parallax_header" 
        style={{
          height: this.props.height || '100vh',
          backgroundImage: `url("${this.state.currentBackground}")`
        }}
      >
        <div 
          className="parallax_header__overlay" 
          style={{
            backgroundColor: this.state.currentBackgroundColor
          }}
        />
        <div className="parallax_header__content">
          <div className="parallax_header__big_text">
            <h1>{this.props.bigText}</h1>
          </div>
          {
            this.props.linkButton
            ? <LinkButton 
              target={this.props.linkButton.target} 
              text={this.props.linkButton.text} 
              classes="parallax_header__link_button" 
            /> 
            : ''
          }
        </div>
        {
          this.props.showScrollStrip
            ? <div 
              className="parallax_header__scroll_strip" 
              data-flip={this.props.flipStrip ? 'active' : 'inactive'}
            >
              <div className="scroll_strip__toggle_bg">
                <span 
                  className="toggle_bg__prev"
                  onClick={this.previousBg}
                >
                  <FontAwesomeIcon icon={faCaretLeft} />
                </span>
                <span className="toggle_bg__divider"/>
                <span 
                  className="toggle_bg__next"
                  onClick={this.nextBg}
                >
                  <FontAwesomeIcon icon={faCaretRight} />
                </span>
                <div className="toggle_bg__counts">
                  <span className="toggle_bg__curr_bg">{this.state.backgroundCount + 1}</span>
                  <span>-</span>
                  <span className="toggle_bg__count">{this.props.backgroundImages.length}</span>
                </div>
              </div>
              <ScrollIndicator />
              <span className="apply__button">
                  
                <Link to="/apply">apply</Link>
              </span>
            </div> 
            : null
        }
      </div>
    );
  }
}

export default ParallaxHeader;