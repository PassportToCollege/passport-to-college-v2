import "./StoryCard.css";

import React from "react";
import { Link } from "react-router-dom";
import propTypes from "prop-types";
import moment from "moment";

const StoryCard = ({ post }) => {
  return (
    <div className="story_card">
      <section className="story_card__content">
        <p className="story_card__author">{post.author.name.full}</p>
        <h1 className="story_card__title">{post.title}</h1>
        <div className="story_card__categories_date">
          <span className="story_card__categories">
            {
              Object.keys(post.category).map(category => {
                return (
                  <Link key={category}
                    to={`/stories/cat/${category}`}>
                    {category.split("-").join(" ")}
                  </Link>
                )
              })
            }
          </span>
          <span>{moment(post.publishedOn).format("MMMM DD, Y")}</span>
        </div>
        <p className="story_card__excerpt">{post.excerpt}</p>
        <Link to={`/stories/read/${post.id}`}>Read More</Link>
      </section>
      <section className="story_card__hero">
        {
          post.hero ?
            <img src={post.hero} alt={`${post.title} hero`} /> :
            <div className="story_card__hero_placeholder"></div>
        }
      </section>
    </div>
  )
}

StoryCard.propTypes = {
  post: propTypes.object
};

export default StoryCard;