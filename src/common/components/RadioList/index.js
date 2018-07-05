import "./RadioList.css";

import React, { Component } from "react";
import propTypes from "prop-types";

import Radio from "../Radio";

export default class RadioList extends Component {
  state = {
    active: "none"
  }

  static propTypes = {
    radios: propTypes.arrayOf(propTypes.object),
    onRadioChange: propTypes.func
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (prevState.active !== this.state.active)
      return { changed: true };

    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot && "function" === typeof this.props.onRadioChange)
      this.props.onRadioChange(this.state.active);
  }

  render() {
    return (
      <ul className="radio_list" role="tablist">
        {
          this.props.radios.map(radio => {
            return (
              <li key={radio.value} role="tab"
                onClick={() => this.setState({ active: radio.value })}>
                <Radio active={this.state.active === radio.value} />
                <span>{radio.label}</span>
              </li>
            )
          })
        }
      </ul>
    )
  }
}