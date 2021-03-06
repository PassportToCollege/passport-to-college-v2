import "./Test.css";

import React from "react";
import propTypes from "prop-types";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/fontawesome-free-solid";

import { getTestKey } from "../../utils";

const Test = ({ test, handleDelete, disabled }) => {
  const deleteTest = () => {
    if ("function" === typeof handleDelete)
      handleDelete(getTestKey(test));
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
      {
        !disabled ?
          <div className="test__delete" onClick={deleteTest}>
            <FontAwesomeIcon icon={faTrash} />
          </div>
        :
          null
      }
    </div>
  )
}

Test.propTypes = {
  test: propTypes.object,
  handleDelete: propTypes.func,
  disabled: propTypes.bool
};

export default Test;