import './ReviewBlock.css';

import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

interface ReviewBlockItem {
  name: string;
  value: string | number;
}

interface ReviewBlockProps {
  items?: ReviewBlockItem[];
  heading?: string;
  editLink?: string;
  hasAvatar?: boolean;
  avatarUrl?: string;
  canEdit?: boolean;
  renderFromFunction?: boolean;
  renderReviewBlock?: () => void;
}

export default class ReviewBlock extends PureComponent<ReviewBlockProps> {
  public render() {
    return (
      <div className="review_block">
        {
          this.props.heading ?
            <div className="review_block__header">
              <h2>{this.props.heading}</h2>
              {
                this.props.canEdit ?
                  <Link to={this.props.editLink || ''}>edit</Link>
                  :
                  null
              }
            </div> :
            null
        }
        <div className="review_block__main">
          {
            this.props.items && this.props.items.length > 0
              ? this.props.items.map((item) => {
                return (
                  <div key={item.name} className="review_block__item">
                    <span className="review_block__name type__bold">{item.name}</span>
                    <span className="review_block__value">{item.value}</span>
                  </div>
                );
              })
            : null
          }
          {
            this.props.renderFromFunction && 'function' === typeof this.props.renderReviewBlock ?
              this.props.renderReviewBlock()
            :
              null
          }
          {
            this.props.hasAvatar ?
              
              <div className="avatar__container" style={{ backgroundImage: `url(${this.props.avatarUrl})` }}/>
            :
              null
          }
        </div>
      </div>
    );
  }
}