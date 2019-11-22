import './InfoCard.css';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getPostHero, getProfilePicture } from '../../utils/firebase/functions';

import LinkButton, { LinkButtonProps } from '../LinkButton';
import Feature from '../../models/Feature';

export interface Background {
  color?: string;
  image?: string;
  overlay?: string;
}

interface InfoCardProps {
  background: Background;
  title: string;
  content: string;
  blank?: boolean;
  linkButton?: LinkButtonProps;
  uid?: string;
  isFeature?: boolean;
  isFounder?: boolean;
  university?: string;
  featureData?: Feature;
}

interface InfoCardState {
  backgroundImage: string;
}

class InfoCard extends Component<InfoCardProps, InfoCardState> {
  constructor(props: InfoCardProps) {
    super(props);

    this.state = {
      backgroundImage: props.background.image || ''
    };
  }

  public componentDidMount() {
    if (this.props.isFeature && 
      !this.props.background.image &&
      this.props.featureData) {
        getPostHero(this.props.featureData.id)
          .then((url) => {
            this.setState({ backgroundImage: url });
          })
          .catch((error) => {
            console.log(error);
          });
    }

    if (this.props.isFounder && 
      !this.props.background.image) {
      getProfilePicture(this.props.uid)
        .then((url) => {
            this.setState({
              backgroundImage: url
            });
          })
          .catch((error) => {
            console.log(error);
          });
    }
  }

  public render() {
    if (this.props.blank) {
      return (
        <div 
          className="info_card info_card__blank" 
          style={{
            backgroundColor: this.props.background.color
          }}
        />
      );
    }

    return (
      < div 
        className={
          `info_card${this.props.isFeature 
            ? ' info_card__feature' 
            : ''} ${this.props.isFounder 
              ? 'info_card__founder' 
              : ''
            }`
        }
        style={{
          backgroundColor: this.props.background.color,
          backgroundImage: `url("${this.props.background.image || this.state.backgroundImage}")`
        }}
      >
        {
          this.props.background.overlay 
            ? <div 
              className="info_card__overlay" 
              style={{ backgroundColor: this.props.background.overlay }}
            /> 
            : null
        }
        {
          !this.props.isFeature ?
            <span className="info_card__content">
              <h3>{this.props.title}</h3>
              <p>{this.props.content}</p>
            </span> :
            <Link 
              to={this.props.linkButton.target || '/'} 
              className="info_card__feature_content"
            >
              <p>{this.props.university}</p>
              <h3>{this.props.title}</h3>
            </Link>
        }
        {
          this.props.linkButton 
            ? <LinkButton 
              target={this.props.linkButton.target}
              text={this.props.linkButton.text} 
              classes={this.props.linkButton.classes} 
            /> 
            : null
        }
      </div>
    );
  }
}

export default InfoCard;