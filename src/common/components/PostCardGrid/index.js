import "./PostCardGrid.css";

import React from "react";
import propTypes from "prop-types";

import PostCard from "../PostCard";

const PostCardGrid = ({ posts, gridStyles }) => {
  return (
    <section className="post_card_grid" style={gridStyles}>
      <div className="post_card_grid__most_recent">
        <PostCard full={true} isDashboard={false}
          post={posts[0]} />
      </div>
      {
        posts.length > 1 ?
          <div className="post_card_grid__other_recents">
            <PostCard isDashboard={false}
              post={posts[1]} />
            {
              posts[2] ?
                <PostCard isDashboard={false}
                  post={posts[2]} /> : null
            }
          </div> : null

      }
      {
        posts.length > 3 ?
          posts.map((post, i) => {
            if (i < 3)
              return null

            return (
              <PostCard key={i} isDashboard={false}
                post={post} />
            )
          }) : null
      }
    </section>
  )
}

PostCardGrid.propTypes = {
  posts: propTypes.array,
  gridStyles: propTypes.object
};

export default PostCardGrid;