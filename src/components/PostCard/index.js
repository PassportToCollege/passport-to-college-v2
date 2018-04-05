import "./PostCard.css";

import React from "react";
import propTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";

const PostCard = ({ post, cardStyles }) => {
  const hero = post.hero || "//via.placeholder.com/800x450";

  return (
    <li className="post_card" style={cardStyles}>
      <Link to={`/admin/dashboard/posts/e/${post.id}`}>
        <img src={hero} alt="post hero" />
      </Link>
      <div className="post_card__content">
        <h2>{post.title}</h2>
        <p>{post.excerpt}</p>
        <span className="post_card__state" 
          data-state={post.state.draft ? "draft" : post.state.archived ? "archived" : "published"}
          title={post.state.draft ? "draft" : post.state.archived ? "archived" : "published"}>
        </span>
        <span className="post_card__date">
          <span>Created: {moment(post.createdAt).format("DD-MM-Y")}</span>
          {
            post.state.published ?
              <span> - Published: {moment(post.publishedOn).format("DD-MM-Y")}</span> :
              null
          }
          {
            post.state.archived ?
              <span> - Archived: {moment(post.archivedOn).format("DD-MM-Y")}</span> :
              null
          }
        </span>
      </div>
    </li>
  )
}

PostCard.propTypes = {
  post: propTypes.object,
  cardStyles: propTypes.object
};

export default PostCard;