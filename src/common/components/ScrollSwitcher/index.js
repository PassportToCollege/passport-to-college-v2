import "./ScrollSwitcher.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown, faPauseCircle, faPlayCircle } from "@fortawesome/fontawesome-free-solid";

import { Interval } from "../../utils";

class ScrollSwitcher extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: 0,
      next: props.options.length > 1 ? 1 : 0,
      previous: props.options.length - 1,
      isPlaying: props.autoplay
    }

    this.SwitcherInterval = new Interval(this.switchNext, 5000);
  }

  static propTypes = {
    options: propTypes.arrayOf(propTypes.object),
    onActiveChange: propTypes.func,
    autoplay: propTypes.bool
  }

  static defaultProps = {
    autoplay: true
  }

  componentDidMount() {
    if (this.props.autoplay)
      this.SwitcherInterval.start();
  }

  componentWillUnmount() {
    if (this.state.isPlaying)
      this.SwitcherInterval.stop();
  }

  render() {
    return (
      <div className="scroll_switcher">
        <span className="scroll_switcher__pause_play"
          title={this.state.isPlaying ? "Pause Switcher" : "Play Switcher"} 
          onClick={this.handlePlayPause}>
          <FontAwesomeIcon icon={this.state.isPlaying ? faPauseCircle : faPlayCircle} />
        </span>
        <span className="scroll_switcher__previous"
          onClick={this.switchPrevious}>
          <FontAwesomeIcon icon={faAngleUp} />
        </span>
        <ul className="scroll_switcher__list">
          <li className="scroll_switcher__previous_item"
            onClick={this.switchPrevious}>
            {this.props.options[this.state.previous].label}
          </li>
          <li className="scroll_switcher__active_item">
            <h3>{this.props.options[this.state.active].label}</h3>
          </li>
          <li className="scroll_switcher__next_item"
            onClick={this.switchNext}>
            {this.props.options[this.state.next].label}
          </li>
        </ul>
        <span className="scroll_switcher__next"
          onClick={this.switchNext}>
          <FontAwesomeIcon icon={faAngleDown} />
        </span>
      </div>
    )
  }

  switchNext = () => {
    const { options } = this.props;
    const { active, next, isPlaying } = this.state;

    this.setState({
      active: next,
      previous: active,
      next: (next + 1 <= options.length - 1) ? next + 1 : 0
    }, () => {
      if ("function" === typeof this.props.onActiveChange)
        this.props.onActiveChange(options[this.state.active]);
    });

    if (isPlaying)
      this.SwitcherInterval.restart();
  }

  switchPrevious = () => {
    const { options } = this.props;
    const { active, previous, isPlaying } = this.state;

    this.setState({
      active: previous,
      previous: (previous - 1 >= 0) ? previous - 1 : options.length - 1,
      next: active
    }, () => {
      if ("function" === typeof this.props.onActiveChange)
        this.props.onActiveChange(options[this.state.active]);
    });

    if (isPlaying)
      this.SwitcherInterval.restart();
  }

  handlePlayPause = () => {
    const { isPlaying } = this.state;

    if (isPlaying) {
      this.SwitcherInterval.stop();
      this.setState({ isPlaying: false });
    } else {
      this.SwitcherInterval.start();
      this.setState({ isPlaying: true });
    }
  }
}

export default ScrollSwitcher;