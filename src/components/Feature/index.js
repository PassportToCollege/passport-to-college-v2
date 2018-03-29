import "./Feature.css";

import React from "react";
import propTypes from "prop-types";
import moment from "moment";

import AnnotatedList from "../AnnotatedList";
import IconButton from "../IconButton";

const Feature = ({ feature, actions }) => {
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
      {
        actions ?
          <div className="feature__actions">
            <IconButton solid />
            <IconButton solid icon="delete" />
            <IconButton icon="edit" />
          </div> :
          null
      }
    </div>
  )
}

Feature.defaultProps = {
  actions: false
}

Feature.propTypes = {
  feature: propTypes.object,
  actions: propTypes.bool
};

export default Feature;