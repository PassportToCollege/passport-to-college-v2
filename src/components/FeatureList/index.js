import "./FeatureList.css";

import React from "react";
import propTypes from "prop-types";

import Feature from "../Feature";

const FeatureList = ({ features }) => {
  return (
    <div className="feature_list">
      {
        features.map((feature, i) => {
          return <Feature key={i} feature={feature} />
        })
      }
    </div>
  )
}

FeatureList.propTypes = {
  features: propTypes.array
};

export default FeatureList;