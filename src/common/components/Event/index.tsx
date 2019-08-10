// TODO: Update this when events are working

import './Event.css';

import React, { Component } from 'react';

import { makeRGB } from '../../utils';

import Button, { BackButton } from '../Button';
import Modal from '../Modal';
import FlexContainer from '../FlexContainer';
import Gallery from '../Gallery';

class Event extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      layout: 'card'
    };
  }

  private renderExpanded = (): React.ReactNode => {
    return (
      <Modal 
        classes={['event__expanded']}
        doClose={() => this.setState({ layout: 'card' })}
      >
        <BackButton 
          text="back"
          doClick={() => this.setState({ layout: 'card' })} 
        />
        {this.getEventHeader(false)}
        {this.getExpandedEventContent()}
      </Modal>
    );
  }

  private getEventHeader = (content = true): React.ReactNode => {
    return (
      <header 
        style={{
          backgroundColor: '#333',
          backgroundImage: `url(${this.props.event.hero})`
        }}
      >
        {
          content ?
            <div 
              style={{
                backgroundColor: makeRGB(this.props.event.accent, 0.85)
              }}
            >
              <h4>{this.props.event.title}</h4>
              <h5>@ {this.props.event.where}</h5>
              <p>{this.props.event.when}</p>
            </div> :
            null
        }
      </header>
    );
  }

  private getExpandedEventContent = (): React.ReactNode => {
    return (
      <React.Fragment>
        <div className="event__expanded_content">
          <FlexContainer classes={['event__expanded_content_header']}>
            <h4>{this.props.event.title}</h4>
            <span>
              <h5>@ {this.props.event.where}</h5>
              <p>{this.props.event.when}</p>
            </span>
          </FlexContainer>
          <p className="event__expanded_details">{this.props.event.details || this.props.event.excerpt}</p>
        </div>
        <div className="event__expanded_gallery">
          {
            this.props.event.hasGallery ?
              <Gallery gallery={this.props.event.gallery} /> :
              <p className="type__center">Sorry, this event does not have a gallery.</p>
          }
        </div>
      </React.Fragment>
    );
  }

  public static getDerivedStateFromProps(nextProps: any, state: any) {
    if (nextProps.layout !== state.layout) {
      return { layout: nextProps.layout };
    }

    return null;
  }

  public render() {
    return (
      <div className="event">
        {
          this.state.layout === 'expanded' ?
            this.renderExpanded() : null
        }
        {this.getEventHeader()}
        <main>
          <p>{this.props.event.excerpt}</p>
          <Button
            type="button" 
            disabled={false}
            solid={true} 
            text="more"
            doClick={() => this.setState({ layout: 'expanded' })}
            styles={{
              backgroundColor: makeRGB(this.props.event.accent),
              borderColor: makeRGB(this.props.event.accent)
            }} 
          />
          <span 
            className="event__accent"
            style={{
              backgroundColor: makeRGB(this.props.event.accent, 0.75)
            }}
          />
        </main>
      </div>
    );
  }
}

export default Event;