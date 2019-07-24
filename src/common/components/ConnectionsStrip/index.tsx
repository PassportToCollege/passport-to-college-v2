import './ConnectionsStrip.css';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookSquare,
  faGoogle,
  faTwitterSquare,
  faGithubSquare,
  faLinkedin
} from '@fortawesome/fontawesome-free-brands';

import FlexContainer from '../FlexContainer';

interface ConnectionsStripProps {
  facebook: boolean;
  google: boolean;
  twitter: boolean;
  github: boolean;
  linkedin: boolean;
  whenConnectionClicked: (connection: ValidConnection) => void;
}

type ValidConnection = 'google' | 'facebook' | 'twitter' | 'github' | 'linkedin' | string | null;

const ConnectionsStrip = (props: ConnectionsStripProps): React.ReactNode => {
  const handleConnectionClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const connection = e.currentTarget.getAttribute('data-connection');

    if ('function' === typeof props.whenConnectionClicked) {
      props.whenConnectionClicked(connection);
    }
  };

  return (
    <FlexContainer 
      classes={['connections_strip']}
      styles={{ justifyContent: 'flex-start' }}
    >
      {
        props.google ?
          <span 
            className="connection__item connection__item_google"
            title="Link Google account" 
            data-connection="google"
            onClick={handleConnectionClick}
          >
            <FontAwesomeIcon icon={faGoogle} />
          </span> :
          null
      }
      {
        props.facebook ?
          <span 
            className="connection__item connection__item_facebook"
            title="Link Facebook account"  
            data-connection="facebook"
            onClick={handleConnectionClick}
          >
            <FontAwesomeIcon icon={faFacebookSquare} />
          </span> :
          null
      }
      {
        props.twitter ?
          <span 
            className="connection__item connection__item_twitter"
            title="Link Twitter account"  
            data-connection="twitter"
            onClick={handleConnectionClick}
          >
            <FontAwesomeIcon icon={faTwitterSquare} />
          </span> :
          null

      }
      {
        props.linkedin ?
          <span 
            className="connection__item connection__item_linkedin"
            title="Link LinkedIn account"  
            data-connection="linkedin"
            onClick={handleConnectionClick}
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </span> :
          null
      }
      {
        props.github ?
          <span 
            className="connection__item connection__item_github"
            title="Link Github account"  
            data-connection="github"
            onClick={handleConnectionClick}
          >
            <FontAwesomeIcon icon={faGithubSquare} />
          </span> :
          null
      }
    </FlexContainer>
  );
};

export default ConnectionsStrip;