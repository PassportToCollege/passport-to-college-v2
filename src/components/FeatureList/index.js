import "./FeatureList.css";

import React from "react";
import propTypes from "prop-types";

import Feature from "../Feature";

const FeatureList = ({ features, actions, doDelete }) => {
  return (
    <div className="feature_list">
      {
        features.map((feature, i) => {
          return <Feature key={i} actions={actions} feature={feature} 
            doDelete={doDelete} />
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
  actions: propTypes.bool,
  doDelete: propTypes.func
};

export default FeatureList;