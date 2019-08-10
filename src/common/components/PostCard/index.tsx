import './PostCard.css';

import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Post from '../../models/Post';

interface PostCardProps {
  post: Post;
  cardStyles?: React.CSSProperties;
  isDashboard?: boolean;
  full?: boolean;
}

export default class PostCard extends PureComponent<PostCardProps> {
  private hero = this.props.post.hero || '//via.placeholder.com/800x450';

  private renderWhenNotDashboard() {
    return (
      <div
        className={`post_card__main ${this.props.full ? 'full' : ''}`}
        style={{
          backgroundImage: `${this.props.post.hero ? 'url(' + this.props.post.hero + ')' : null}`
        }}
      >
        <div className="post_card__overlay" />
        <Link to={`/stories/read/${this.props.post.id}`} className="post_card__content">
          <section className="post_card__categories">
            {
              this.props.post.category !== undefined
                ? Object.keys(this.props.post.category).map((category) => {
                  if (this.props.post.category![category] === true) {
                    return (
                      <span key={category} className="post_card__category">
                        {category.split('_').join(' ').trim()}
                      </span>
                    );
                  }

                  return null;
                })
                : null
            }
          </section>
          <h5>{this.props.post.title}</h5>
        </Link>
      </div>
    );
  }

  private renderDefault() {
    return (
      <li className="post_card" style={this.props.cardStyles}>
        <Link to={`/admin/dashboard/posts/e/${this.props.post.id}`}>
          <img src={this.props.post.hero} alt="post hero" />
        </Link>
        <div className="post_card__content">
          <h2>{this.props.post.title}</h2>
          <p>{this.props.post.excerpt}</p>
          <span
            className="post_card__state"
            data-state={
              this.props.post.state.draft 
                ? 'draft' 
                : this.props. post.state.archived 
                  ? 'archived' 
                  : 'published'
            }
            title={
              this.props.post.state.draft 
                ? 'draft' 
                : this.props.post.state.archived 
                  ? 'archived' 
                  : 'published'
            }
          />
          <span className="post_card__date">
            <span>Created: {moment(this.props.post.createdAt).format('DD-MM-Y')}</span>
            {
              this.props.post.state.published ?
                <span> - Published: {moment(this.props.post.publishedOn).format('DD-MM-Y')}</span> :
                null
            }
            {
              this.props.post.state.archived ?
                <span> - Archived: {moment(this.props.post.archivedOn).format('DD-MM-Y')}</span> :
                null
            }
          </span>
        </div>
      </li>
    );
  }

  public render() {
    const isDashboard = this.props.isDashboard === undefined 
      ? true 
      : this.props.isDashboard;

    if (!isDashboard) {
      return this.renderWhenNotDashboard();
    }

    return this.renderDefault();
  }
}
