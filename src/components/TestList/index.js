import "./TestList.css";

import React from "react";
import propTypes from "prop-types";

import { getTestKey } from "../../utils";

import Test from "../Test";

const TestList = ({ tests, handleDelete }) => {

  const deleteTest = test => {
    if ("function" === typeof handleDelete)
      handleDelete(test);
  }

  const renderTests = () => {
    return Object.keys(tests).map(test => {
      return (
        <Test 
          key={getTestKey(tests[test])} 
          test={tests[test]}
          handleDelete={deleteTest} />
      )
    });
  }

  return (
    <div className="test_list">
      { renderTests() }
    </div>
  )
}

TestList.propTypes = {
  tests: propTypes.object,
  handleDelete: propTypes.func
};

export default TestList;