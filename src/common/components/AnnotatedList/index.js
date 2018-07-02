import "./AnnotatedList.css";

import React from "react";
import propTypes from "prop-types";

const AnnotatedList = ({ data }) => {
  return (
    <ul className="annotated_list">
      {
        data.map((item, index) => {
          return (
            <li key={index}>
              <span className="annotated_list__label">{item.label}</span>
              <span className="annotated_list__text">{item.text}</span>
            </li>
          )
        })
      }
    </ul>
  );
}

AnnotatedList.propTypes = {
  data: propTypes.arrayOf(propTypes.object)
};

export default AnnotatedList