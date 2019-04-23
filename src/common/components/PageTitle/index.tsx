import "./PageTitle.css";

import React from "react";
import propTypes from "prop-types";

const PageTitle = ({ titleStyles, children }) => {
  return (
    <h1 className="page_title" style={titleStyles}>
      {children}
    </h1>
  )
}

PageTitle.propTypes = {
  titleStyles: propTypes.object,
  children: propTypes.node
}

export default PageTitle;