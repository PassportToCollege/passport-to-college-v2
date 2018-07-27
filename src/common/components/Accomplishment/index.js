import "./Accomplishment.css";

import React from "react";
import propTypes from "prop-types";
import moment from "moment";

import IconButton from "../IconButton";

const Accomplishment = ({ accomplishment, actions, doDelete, doEdit }) => {
  const handleDelete = () => {
    if ("function" === typeof doDelete)
      doDelete(accomplishment);
  }
  const handleEdit = () => {
    if ("function" === typeof doEdit)
      doEdit(accomplishment);
  }

  return (
    <div className="accomplishment">
      <section className="accomplishment__meta">
        <h5>{accomplishment.title}</h5>
        <p className="type__margin_top type__caption">
          {moment.utc(moment(accomplishment.createdAt)).format("MMM D, YYYY")}
        </p>
      </section>
      <section className="accomplishment__excerpt">
        <p>{accomplishment.excerpt}</p>
      </section>
      {
        actions ?
          <section className="accomplishment__actions">
            <IconButton solid icon="delete" 
              styles={{
                backgroundColor: "rgba(128, 150, 162, 0.85)"
              }} 
              doClick={handleDelete} />
            <IconButton icon="edit"
              styles={{
                borderColor: "rgba(128, 150, 162, 0.85)",
                color: "rgba(128, 150, 162, 0.85)"
              }} 
              doClick={handleEdit} />
          </section> :
          null
      }
    </div>
  )
}

Accomplishment.propTypes = {
  accomplishment: propTypes.object,
  actions: propTypes.bool,
  doDelete: propTypes.func,
  doEdit: propTypes.func
};

export default Accomplishment;