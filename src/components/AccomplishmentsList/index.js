import "./AccomplishmentsList.css";

import React from "react";
import propTypes from "prop-types";

import Accomplishment from "../Accomplishment"

const AccomplishmentsList = ({ accomplishments, actions, listStyles }) => {
  return (
    <div className="accomplishments_list" style={listStyles}>
      {
        Object.keys(accomplishments).map(key => {
          return <Accomplishment key={key} actions accomplishment={accomplishments[key]} />
        })
      }
    </div>
  )
}

AccomplishmentsList.propTypes = {
  accomplishments: propTypes.object,
  listStyles: propTypes.object,
  actions: propTypes.bool
};

export default AccomplishmentsList;