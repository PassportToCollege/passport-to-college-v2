import "./TestList.css";

import React from "react";
import propTypes from "prop-types";

import Test from "../Test";

const TestList = ({ tests }) => {

  const renderTests = () => {
    return Object.keys(tests).map(test => {
      return (
        <Test 
          key={tests[test].subject.toLowerCase().split(" ").join("-")} 
          test={tests[test]} />
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
  tests: propTypes.object
};

export default TestList;