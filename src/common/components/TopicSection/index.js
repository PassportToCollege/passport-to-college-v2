import "./TopicSection.css";

import React from "react";
import propTypes from "prop-types";

const TopicSection = ({ heading, content, sectionStyles }) => {
  return (
    <section className="topic_section" style={sectionStyles}>
      {
        heading ?
          <h5>{heading}</h5> : null
      }
      {content}
    </section>
  )
}

TopicSection.propTypes = {
  heading: propTypes.string,
  content: propTypes.element,
  sectionStyles: propTypes.object
};

export default TopicSection;