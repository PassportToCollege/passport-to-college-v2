import "./FeatureList.css";

import React from "react";
import propTypes from "prop-types";

import Feature from "../Feature";

const FeatureList = ({ features, actions }) => {
  return (
    <div className="feature_list">
      {
        features.map((feature, i) => {
          return <Feature key={i} actions={actions} feature={feature} />
        })
      }
    </div>
  )
}

FeatureList.defaultProps = {
  actions: false
}

FeatureList.propTypes = {
  features: propTypes.array,
  actions: propTypes.bool
};

export default FeatureList;