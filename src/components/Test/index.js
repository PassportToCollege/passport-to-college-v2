import "./Test.css";

import React from "react";
import propTypes from "prop-types";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/fontawesome-free-solid";

const Test = ({ test, handleDelete }) => {
  const deleteTest = () => {
    if ("function" === typeof handleDelete) {
      let key = test.subject.toLowerCase().replace(/\s/g, "-");
      key += `-${test.board.toLowerCase().replace(/\s/g, "-")}`;
      key += `-${test.examination.toLowerCase().replace(/\s/g, "-")}`;
      
      handleDelete(key);
    }
  }

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
      <div className="test__delete" onClick={deleteTest}>
        <FontAwesomeIcon icon={faTrash} />
      </div>
    </div>
  )
}

Test.propTypes = {
  test: propTypes.object,
  handleDelete: propTypes.func
};

export default Test;