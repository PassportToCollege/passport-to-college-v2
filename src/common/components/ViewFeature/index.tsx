import './ViewFeature.css';

import React, { Component } from 'react';
import { getPostHero } from '../../utils/firebase/functions';

import Modal from '../Modal';
import WYSIWYGEditor from '../Editor';
import Feature from '../../models/Feature';

interface ViewFeatureProps {
  feature: Feature;
  hero?: string;
  onFeatureClose: () => void;
}

interface ViewFeatureState {
  hero?: string;
}

export default class ViewFeature extends Component<ViewFeatureProps, ViewFeatureState> {
  private handleFeatureClose = () => {
    if ('function' === typeof this.props.onFeatureClose) {
      this.props.onFeatureClose();
    }
  }

  public state: ViewFeatureState = {
    hero: this.props.hero
  };

  public componentDidMount() {
    if (this.props.feature.hasHero && !this.props.hero) {
      getPostHero(this.props.feature.id)
        .then((url) => {
          this.setState({ hero: url });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  public render() {
    return (
      <Modal 
        classes={['modal__feature']} 
        doClose={this.handleFeatureClose}
      >
        <h2 className="type__boldest">{this.props.feature.title}</h2>
        {
          this.state.hero ?
            <img src={this.state.hero} alt="story hero" /> : null
        }
        <WYSIWYGEditor 
          readonly={true}
          content={this.props.feature.full}
          editorStyles={{
            border: 'none',
            margin: '0 auto',
            maxWidth: '100%',
            padding: '2em 3em'
          }} 
        />
      </Modal>
    );
  }
}