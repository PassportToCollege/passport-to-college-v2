import './LoadingPosts.css';

import React from 'react';

import LoadingText from '../LoadingText';

export const LoadingPostItem = () => {
  return (
    <div className="loading_posts__item">
      <div className="loading_posts__item_content">
        <LoadingText
          backgroundColor="transparent"
          classes="block__lines"
          height="10px"
          lines={[
            { color: 'rgba(51,51,51,0.2', width: '60px' },
            { color: 'rgba(51,51,51,0.2', width: '250px' },
            { color: 'rgba(51,51,51,0.2', width: '120px' }
          ]}
        />
        <LoadingText 
          backgroundColor="transparent"
          classes="block__lines"
          height="5px"
          lines={[
            { color: 'rgba(51,51,51,0.2', width: '300px' },
            { color: 'rgba(51,51,51,0.2', width: '300px' },
            { color: 'rgba(51,51,51,0.2', width: '300px' },
            { color: 'rgba(51,51,51,0.2', width: '300px' },
            { color: 'rgba(51,51,51,0.2', width: '300px' }
          ]}
        />
        <LoadingText
          backgroundColor="transparent"
          classes="block__lines"
          height="10px"
          lines={[
            { color: 'rgba(51,51,51,0.2', width: '60px' }
          ]}
        />
      </div>
      <div className="loading_posts__item_hero">
        <span className="loading_posts__hero_padding"/>
      </div>
    </div>
  );
};

interface LoadingPostProps {
  posts: number;
  styles: React.CSSProperties;
}

export const LoadingPosts = (props: LoadingPostProps): React.ReactNode => {
  const { posts = 3, styles } = props;

  return (
    <div 
      className="loading_posts" 
      style={styles}
    >
      {
        [...Array(posts)].map((e, i) => {
          return <LoadingPostItem key={i} />;
        })
      }
    </div>
  );
};
