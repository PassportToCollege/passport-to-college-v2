import "./ListItem.css";

import React from "react";
import propTypes from "prop-types";

const ListItem = ({ text, bullet, children }) => {
  return (
    <li className="list_item" data-bullet={bullet}>
      {children || text}
    </li>
  )
}

ListItem.defaultProps = {
  bullet: true
}

ListItem.propTypes = {
  children: propTypes.any,
  text: propTypes.string,
  bullet: propTypes.bool
}

export default ListItem;