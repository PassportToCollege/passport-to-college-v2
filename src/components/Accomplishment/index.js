import "./Accomplishment.css";

import React from "react";
import propTypes from "prop-types";

import IconButton from "../IconButton";

const Accomplishment = ({ accomplishment, actions }) => {
  return (
    <div className="accomplishment">
      <section className="accomplishment__meta">
        <span>{accomplishment.slug}</span>
        <h2>{accomplishment.title}</h2>
      </section>
      <section className="accomplishment__excerpt">
        <p>{accomplishment.details.excerpt}</p>
      </section>
      {
        actions ?
          <section className="accomplishment__actions">
            <IconButton solid icon="delete" 
              styles={{
                backgroundColor: "tomato"
              }}/>
            <IconButton icon="edit"
              styles={{
                borderColor: "#FFCB61",
                color: "#FFCB61"
              }} />
          </section> :
          null
      }
    </div>
  )
}

Accomplishment.propTypes = {
  accomplishment: propTypes.object,
  actions: propTypes.bool
};

export default Accomplishment;