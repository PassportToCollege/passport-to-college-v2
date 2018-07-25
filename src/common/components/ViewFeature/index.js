import "./ViewFeature.css";

import React from "react";
import propTypes from "prop-types";

import Modal from "../Modal";
import WYSIWYGEditor from "../Editor";

const ViewFeature = ({ feature, hero, onFeatureClose }) => {
  const handleFeatureClose = () => {
    if ("function" === typeof onFeatureClose)
      onFeatureClose();
  }

  return (
    <Modal classes={["modal__feature story"]} 
      doClose={handleFeatureClose}>
      <h1 className="story__title">{feature.title}</h1>
      <span className="story__author">by {feature.author.name.full}</span>
      {
        hero ?
          <img className="story__hero"
            src={hero} alt="story hero" /> : null
      }
      <WYSIWYGEditor readonly
        content={feature.full}
        editorStyles={{
          border: "none",
          margin: "0 auto",
          maxWidth: "100%",
          padding: "2em 3em"
        }} />
    </Modal>
  )
}

ViewFeature.propTypes = {
  feature: propTypes.object,
  hero: propTypes.string,
  onFeatureClose: propTypes.func
};

export default ViewFeature;