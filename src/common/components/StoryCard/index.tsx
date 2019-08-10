import './StoryCard.css';

import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Post from '../../models/Post';
import User from '../../models/User';

interface StoryCardProps {
  post: Post;
}

export default class StoryCard extends PureComponent<StoryCardProps> {
  public render() {
    const { post } = this.props;

    return (
      <div className="story_card">
        <section className="story_card__content">
          <p className="story_card__author">{(post.author as User).name.full()}</p>
          <h1 className="story_card__title">{post.title}</h1>
          <div className="story_card__categories_date">
            <span className="story_card__categories">
              {
                post.category 
                  ? Object.keys(post.category).map((category) => {
                    return (
                        <Link 
                          key={category}
                          to={`/stories/cat/${category}`}
                        >
                          {category.split('-').join(' ')}
                        </Link>
                      );
                    })
                  : null
              }
            </span>
            <span>{moment(post.publishedOn).format('MMMM DD, Y')}</span>
          </div>
          <p className="story_card__excerpt">{post.excerpt}</p>
          <Link to={`/stories/read/${post.id}`}>Read More</Link>
        </section>
        <section className="story_card__hero">
          {
            post.hero ?
              <img src={post.hero} alt={`${post.title} hero`} /> :
              
              <div className="story_card__hero_placeholder"/>
          }
        </section>
      </div>
    );
  }
}