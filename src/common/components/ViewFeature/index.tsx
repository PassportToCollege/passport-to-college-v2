import "./ViewFeature.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import { getPostHero } from "../../utils/firebase/functions";

import Modal from "../Modal";
import WYSIWYGEditor from "../Editor";

class ViewFeature extends Component {
  constructor(props) {
    super(props);

    this.state = {
      feature: props.feature
    }
  }

  static propTypes = {
    feature: propTypes.object,
    hero: propTypes.string,
    onFeatureClose: propTypes.func
  }
  
  componentDidMount() {
    if (this.state.feature.hasHero) {
      getPostHero(this.state.feature.id)
        .then(url => {
          this.setState({ hero: url });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  render() {
    return (
      <Modal classes={["modal__feature"]} 
        doClose={this.handleFeatureClose}>
        <h2 className="type__boldest">{this.state.feature.title}</h2>
        {
          this.state.hero ?
            <img src={this.state.hero} alt="story hero" /> : null
        }
        <WYSIWYGEditor readonly
          content={this.state.feature.full}
          editorStyles={{
            border: "none",
            margin: "0 auto",
            maxWidth: "100%",
            padding: "2em 3em"
          }} />
      </Modal>
    )
  }

  handleFeatureClose = () => {
    if ("function" === typeof this.props.onFeatureClose)
      this.props.onFeatureClose();
  }
}

export default ViewFeature;