import './Gallery.css';

import React, { Component } from 'react';
import propTypes from 'prop-types';

import FlexContainer from '../FlexContainer';

class Gallery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: props.gallery.length ? props.gallery[0] : {}
    };
  }

  public static propTypes = {
    gallery: propTypes.arrayOf(propTypes.object)
  };

  public componentDidMount() {
    if (this.props.gallery.length) {
      this.setState({
        left: this.props.gallery.slice(0, Math.floor(this.props.gallery.length / 2)),
        right: this.props.gallery.slice(Math.floor(this.props.gallery.length / 2) + 1, this.props.gallery.length)
      });
    }
  }

  public render() {
    return (
      <FlexContainer classes={['gallery']}>
        <section>
          {
            this.state.left ? 
              this.state.left.map((item) => {
                return <img key={item.id} src={item.photo} alt="" />;
              }) :
              null
          }
        </section>
        <section>
          {
            this.state.right ?
              this.state.right.map((item) => {
                return <img key={item.id} src={item.photo} alt="" />;
              }) :
              null
          }
        </section>
      </FlexContainer>
    );
  }
}

export default Gallery;