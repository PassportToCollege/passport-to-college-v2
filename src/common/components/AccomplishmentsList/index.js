import "./AccomplishmentsList.css";

import React from "react";
import propTypes from "prop-types";

import Accomplishment from "../Accomplishment"

const AccomplishmentsList = ({ accomplishments, actions, listStyles, doDelete, doEdit }) => {
   return (
    <div className="accomplishments_list" style={listStyles}>
      {
        Object.keys(accomplishments).map(key => {
          return <Accomplishment key={key} actions={actions} 
            accomplishment={accomplishments[key]} 
            doDelete={doDelete}
            doEdit={doEdit} />
        })
      }
    </div>
  )
}

AccomplishmentsList.propTypes = {
  accomplishments: propTypes.arrayOf(propTypes.object),
  listStyles: propTypes.object,
  actions: propTypes.bool,
  doDelete: propTypes.func,
  doEdit: propTypes.func
};

export default AccomplishmentsList;