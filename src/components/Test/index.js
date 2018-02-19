import "./Test.css";

import React from "react";
import propTypes from "prop-types";

const Test = ({ test }) => {
  return (
    <div className="test">
      <div className="test__board_exam">
        <span className="test__board">{test.board}</span>
        <span className="test__exam">{test.examination}</span>
      </div>
      <h3 className="test__subject">{test.subject} ({test.grade})</h3>
      <div className="test__country_year">
        <span className="test__country">{test.country}</span>
        <span className="test__year">{test.year}</span>
      </div>
    </div>
  )
}

Test.propTypes = {
  test: propTypes.object,
}

export default Test;