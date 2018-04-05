import "./PostCard.css";

import React from "react";
import propTypes from "prop-types";
import { Link } from "react-router-dom";

const PostCard = ({ post, cardStyles }) => {
  const hero = post.hero || "//via.placeholder.com/800x450";

  return (
    <li className="post_card" style={cardStyles}>
      <Link to={`/admin/dashboard/posts/e/${post.id}`}>
        <img src={hero} alt="post hero" />
      </Link>
      <div className="post_card__excerpt">
        <h2>{post.title}</h2>
        <p>{post.excerpt}</p>
      </div>
    </li>
  )
}

PostCard.propTypes = {
  post: propTypes.object,
  cardStyles: propTypes.object
};

export default PostCard;