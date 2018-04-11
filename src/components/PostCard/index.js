import "./PostCard.css";

import React from "react";
import propTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";

const PostCard = ({ post, cardStyles, isDashboard, full }) => {
  const hero = post.hero || "//via.placeholder.com/800x450";

  if (!isDashboard) {
    return (
      <div className={`post_card__main ${full ? "full" : ""}`}
        style={{
          backgroundImage: `${post.hero ? "url(" + post.hero + ")" : null}`
        }}>
        <div className="post_card__overlay"></div>
        <Link to="/" className="post_card__content">
          <section className="post_card__categories">
            {
              Object.keys(post.categories).map(category => {
                if (post.categories[category] === true)
                  return ( 
                    <span key={category} className="post_card__category">{category}</span> 
                  )
                
                return null
              })
            }
          </section>
          <h3>{post.title}</h3>
        </Link>
      </div>
    )
  }

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

PostCard.defaultProps = {
  isDashboard: true,
  full: false
}

PostCard.propTypes = {
  post: propTypes.object,
  cardStyles: propTypes.object,
  isDashboard: propTypes.bool,
  full: propTypes.bool
};

export default PostCard;