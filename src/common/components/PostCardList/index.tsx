import React, { PureComponent } from 'react';

import PostCard from '../PostCard';
import Post from '../../models/Post';

interface PostCardListProps {
  posts: Post[];
  listStyles: React.CSSProperties;
  cardStyles: React.CSSProperties;
}

export default class PostCardList extends PureComponent<PostCardListProps> {
  public render() {
    const { posts, cardStyles, listStyles } = this.props;
    
    return (
      <ul className="post_card__list" style={listStyles}>
        {
          posts.map((post) => {
            return <PostCard key={post.createdAt as number} post={post} cardStyles={cardStyles} />;
          })
        }
      </ul>
    );
  }
}