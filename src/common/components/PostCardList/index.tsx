import React from "react";
import propTypes from "prop-types";

import PostCard from "../PostCard";

const PostCardList = ({ posts, listStyles, cardStyles }) => {
  return (
    <ul className="post_card__list" style={listStyles}>
      {
        posts.map(post => {
          return <PostCard key={post.createdAt} post={post} cardStyles={cardStyles} />
        })
      }
    </ul>
  );
}

PostCardList.propTypes = {
  posts: propTypes.array,
  listStyles: propTypes.object,
  cardStyles: propTypes.object
}

export default PostCardList;