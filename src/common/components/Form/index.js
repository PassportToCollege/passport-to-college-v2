import React from "react";
import propTypes from "prop-types";

import { makeClassString } from "../../utils";

const Form = ({ children, doSubmit, classes }) => {
  const handleSubmit = e => {
    if ("function" === typeof doSubmit)
      doSubmit(e);
  }


  return (
    <form className={makeClassString(classes)}
      onSubmit={handleSubmit}>
      {children}
    </form>
  )
}

Form.propTypes = {
  children: propTypes.any,
  doSubmit: propTypes.func,
  classes: propTypes.arrayOf(propTypes.string)
};

export default Form;