import "./ReviewBlock.css";

import React from "react";
import { Link } from "react-router-dom";
import propTypes from "prop-types";

const ReviewBlock = props => {
  return (
    <div className="review_block">
      {
        props.heading ?
          <div className="review_block__header">
            <h2>{props.heading}</h2>
            {
              props.canEdit ?
                <Link to={props.editLink}>edit</Link>
                :
                null
            }
          </div> :
          null
      }
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
        {
          props.renderImage ?
            <div className="avatar__container" style={{ backgroundImage: `url(${props.imageUrl})` }}>
            </div>
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
  renderFunc: propTypes.func,
  renderImage: propTypes.bool,
  imageUrl: propTypes.string,
  canEdit: propTypes.bool
};

export default ReviewBlock;