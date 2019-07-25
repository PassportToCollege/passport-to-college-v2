import './LoadingPost.css';

import React from 'react';

import LoadingText from '../LoadingText';

interface LoadingPostProps {
  styles: React.CSSProperties;
}

const LoadingPost = (props: LoadingPostProps): React.ReactNode => {
  const { styles } = props;

  return (
    <div className="loading_post" style={styles}>
      <LoadingText 
        backgroundColor="transparent"
        classes="block__lines center__lines"
        height="50px"
        lines={[
          { color: 'rgba(51,51,51,0.2)', width: '600px' }
        ]}
      />
      <LoadingText
        backgroundColor="transparent"
        classes="block__lines center__lines"
        height="10px"
        lines={[
          { color: 'rgba(51,51,51,0.2)', width: '300px' }
        ]}
      />
      <div className="loading_post__hero"/>
      <LoadingText
        backgroundColor="transparent"
        classes="block__lines center__lines"
        height="10px"
        lines={[
          { color: 'rgba(51,51,51,0.2)', width: '1070px' },
          { color: 'rgba(51,51,51,0.2)', width: '1070px' },
          { color: 'rgba(51,51,51,0.2)', width: '1070px' },
          { color: 'rgba(51,51,51,0.2)', width: '1070px' },
          { color: 'rgba(51,51,51,0.2)', width: '1070px' },
          { color: 'rgba(51,51,51,0.2)', width: '1070px' }
        ]}
      />
      <LoadingText
        backgroundColor="transparent"
        classes="block__lines center__lines"
        height="10px"
        lines={[
          { color: 'rgba(51,51,51,0.2)', width: '1070px' },
          { color: 'rgba(51,51,51,0.2)', width: '1070px' },
          { color: 'rgba(51,51,51,0.2)', width: '1070px' },
          { color: 'rgba(51,51,51,0.2)', width: '1070px' },
          { color: 'rgba(51,51,51,0.2)', width: '1070px' },
          { color: 'rgba(51,51,51,0.2)', width: '1070px' },
          { color: 'rgba(51,51,51,0.2)', width: '1070px' },
          { color: 'rgba(51,51,51,0.2)', width: '1070px' },
          { color: 'rgba(51,51,51,0.2)', width: '1070px' }
        ]}
      />
    </div>
  );
};

export default LoadingPost;