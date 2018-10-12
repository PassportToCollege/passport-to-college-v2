import "./Event.css";

import React, { Component } from "react";
import propTypes from "prop-types";

import { makeRGB } from "../../utils";

import Button from "../Button";

class Event extends Component {
  constructor(props) {
    super(props);

    this.state = {
      layout: "card"
    };
  }

  static propTypes = {
    event: propTypes.object,
    layout: propTypes.string
  }

  render() {
    return (
      <div className="event" data-layout={this.state.layout}>
        <header style={{
          backgroundColor: "#333",
          backgroundImage: `url(${this.props.event.hero})`
        }}>
          <div style={{
            backgroundColor: makeRGB(this.props.event.accent, 0.85)
          }}>
            <h4>{this.props.event.title}</h4>
            <h5>@ {this.props.event.where}</h5>
            <p>{this.props.event.when}</p>
          </div>
        </header>
        <main>
          <p>{this.props.event.excerpt}</p>
          <Button solid text="more"
            doClick={this.handleMoreClick}
            styles={{
              backgroundColor: makeRGB(this.props.event.accent),
              borderColor: makeRGB(this.props.event.accent)
            }} />
          <span className="event__accent"
            style={{
              backgroundColor: makeRGB(this.props.event.accent, 0.75)
            }}></span>
        </main>
      </div>
    )
  }
}

export default Event;