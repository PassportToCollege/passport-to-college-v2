import './CommentHeader.css';

import React from 'react';
import moment from 'moment';
import propTypes from 'prop-types';

import InitialsAvatar from '../InitialsAvatar';
import iComment from '../../imodels/iComment';

interface CommentHeaderProps {
  comment: iComment;
  ready: boolean;
}

const CommentHeader = (props: CommentHeaderProps): React.ReactNode => {
  const { comment } = props;

  return (
    <span className="comment_header">
      {
        comment.User.photo ?
          <img src={comment.User.photo || comment.User.photo} alt="commenter profile pic" /> :
          <InitialsAvatar 
            initials={`${comment.User.name.first[0]}${comment.User.name.last[0]}`} 
            styles={{
              width: '32px',
              height: '32px',
              fontSize: '1.25em',
              backgroundColor: '#FF6561'
            }}
          />
      }
      <span className="comment_header__text">
        <span className="comment_header__name">{comment.User.name.full()}</span>
        <span className="comment_header__posted_on">{moment(comment.postedOn).format('MMMM D, YYYY')}</span>
      </span>
    </span>
  );
};

export default CommentHeader;