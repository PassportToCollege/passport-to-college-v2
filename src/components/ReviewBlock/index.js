import "./ReviewBlock.css";

import React from "react";
import { Link } from "react-router-dom";
import propTypes from "prop-types";

const ReviewBlock = props => {
  return (
    <div className="review_block">
      <div className="review_block__header">
        <h2>{props.heading}</h2>
        <Link to={props.editLink}>edit</Link>
      </div>
      <div className="review_block__main">
        {
          props.items && props.items.length > 0 ?
            props.items.map(item => {
              return (
                <div key={item.name} className="review_block__item">
                  <span className="review_block__name type__bold">{item.name}</span>
                  <span className="review_block__value">{item.value}</span>
                </div>
              )
            })
          :
            null
        }
        {
          props.renderFromFunc && "function" === typeof props.renderFunc ?
            props.renderFunc()
          :
            null
        }
      </div>
    </div>
  )
}

ReviewBlock.propTypes = {
  heading: propTypes.string,
  editLink: propTypes.string,
  items: propTypes.array,
  renderFromFunc: propTypes.bool,
  renderFunc: propTypes.func
};

export default ReviewBlock;