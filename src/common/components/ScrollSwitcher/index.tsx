import './ScrollSwitcher.css';

import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown, faPauseCircle, faPlayCircle } from '@fortawesome/fontawesome-free-solid';

import Interval from '../../models/Interval';

export interface ScrollSwitcherOption {
  label: string;
  value: string;
}

interface ScrollSwitcherProps {
  options: ScrollSwitcherOption[];
  onActiveChange: (active: ScrollSwitcherOption) => void;
  autoplay: boolean;
}

interface ScrollSwitcherState {
  active: number;
  next: number;
  previous: number;
  isPlaying: boolean;
}

class ScrollSwitcher extends Component<ScrollSwitcherProps, ScrollSwitcherState> {
  constructor(props: ScrollSwitcherProps) {
    super(props);

    this.state = {
      active: 0,
      next: props.options.length > 1 ? 1 : 0,
      previous: props.options.length - 1,
      isPlaying: props.autoplay
    };
  }

  private switchNext = () => {
    const { options } = this.props;
    const { active, next, isPlaying } = this.state;

    this.setState({
      active: next,
      previous: active,
      next: (next + 1 <= options.length - 1) ? next + 1 : 0
    }, () => {
      if ('function' === typeof this.props.onActiveChange) {
        this.props.onActiveChange(options[this.state.active]);
      }
    });

    if (isPlaying) {
      this.SwitcherInterval.restart();
    }
  }

  private switchPrevious = () => {
    const { options } = this.props;
    const { active, previous, isPlaying } = this.state;

    this.setState({
      active: previous,
      previous: (previous - 1 >= 0) ? previous - 1 : options.length - 1,
      next: active
    }, () => {
      if ('function' === typeof this.props.onActiveChange) {
        this.props.onActiveChange(options[this.state.active]);
      }
    });

    if (isPlaying) {
      this.SwitcherInterval.restart();
    }
  }

  private SwitcherInterval = new Interval(this.switchNext, 5000);

  private handlePlayPause = () => {
    const { isPlaying } = this.state;

    if (isPlaying) {
      this.SwitcherInterval.stop();
      this.setState({ isPlaying: false });
    } else {
      this.SwitcherInterval.start();
      this.setState({ isPlaying: true });
    }
  }

  public componentDidMount() {
    if (this.props.autoplay) {
      this.SwitcherInterval.start();
    }
  }

  public componentWillUnmount() {
    if (this.state.isPlaying) {
      this.SwitcherInterval.stop();
    }
  }

  public render() {
    return (
      <div className="scroll_switcher">
        <span 
          className="scroll_switcher__pause_play"
          title={this.state.isPlaying ? 'Pause Switcher' : 'Play Switcher'} 
          onClick={this.handlePlayPause}
        >
          <FontAwesomeIcon icon={this.state.isPlaying ? faPauseCircle : faPlayCircle} />
        </span>
        <span 
          className="scroll_switcher__previous"
          onClick={this.switchPrevious}
        >
          <FontAwesomeIcon icon={faAngleUp} />
        </span>
        <ul className="scroll_switcher__list">
          <li 
            className="scroll_switcher__previous_item"
            onClick={this.switchPrevious}
          >
            {this.props.options[this.state.previous].label}
          </li>
          <li className="scroll_switcher__active_item">
            <h3>{this.props.options[this.state.active].label}</h3>
          </li>
          <li 
            className="scroll_switcher__next_item"
            onClick={this.switchNext}
          >
            {this.props.options[this.state.next].label}
          </li>
        </ul>
        <span 
          className="scroll_switcher__next"
          onClick={this.switchNext}
        >
          <FontAwesomeIcon icon={faAngleDown} />
        </span>
      </div>
    );
  }
}

export default ScrollSwitcher;