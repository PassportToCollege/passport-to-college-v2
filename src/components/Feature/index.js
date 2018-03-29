import React from "react";
import propTypes from "prop-types";
import moment from "moment";

import AnnotatedList from "../AnnotatedList";

const Feature = ({ feature }) => {
  const featureStyles = {
    backgroundColor: "#FFF",
    padding: "1em"
  }

  return (
    <div className="feature__item" style={featureStyles}>
      <AnnotatedList data={[
        { label: "fid", text: feature.fid },
        { label: "created on", text: moment(feature.createdAt).format("MM-DD-Y") },
        { label: "expires on", text: moment(feature.expDate).format("MM-DD-Y") }
      ]} />
    </div>
  )
}

Feature.propTypes = {
  feature: propTypes.object
};

export default Feature;