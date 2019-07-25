import './Feature.css';

import React, { Component } from 'react';
import propTypes from 'prop-types';
import moment from 'moment';

import AnnotatedList from '../AnnotatedList';
import IconButton from '../IconButton';
import ViewFeature from '../ViewFeature';
import _Feature from '../../models/Feature';

interface FeatureProps {
  feature: _Feature;
  showActions: boolean;
  doDelete: (feature: _Feature) => void;
  doEdit: (feature: _Feature) => void;
}

interface FeatureState {
  feature: _Feature;
  showActions: boolean;
  viewing: boolean;
}

class Feature extends Component<FeatureProps, FeatureState> {
  constructor(props: FeatureProps) {
    super(props);

    this.state = {
      feature: props.feature,
      showActions: !!props.showActions,
      viewing: false
    };
  }

  private featureStyles: React.CSSProperties = {
    backgroundColor: '#FFF',
    padding: '1em'
  };

  private handleDelete = () => {
    if ('function' === typeof this.props.doDelete) {
      this.props.doDelete(this.state.feature);
    }
  }

  private handleEdit = () => {
    if ('function' === typeof this.props.doEdit) {
      this.props.doEdit(this.state.feature);
    }
  }

  public render() {
    return (
      <div className="feature__item" style={this.featureStyles}>
        <AnnotatedList 
          data={[
            { label: 'id', text: this.state.feature.id },
            { label: 'created on', text: moment(this.state.feature.createdAt).format('MM-DD-Y') },
            { label: 'expires on', text: moment(this.state.feature.expiration).format('MM-DD-Y') },
            { 
              label: 'state', 
              text: this.state.feature.state.published 
                ? 'featured' 
                : this.state.feature.state.archived 
                  ? 'archived' 
                  : 'draft' 
            }
          ]} 
        />
        {
          this.state.showActions
            ? <div className="feature__actions">
              <IconButton
                disabled={false} 
                solid={true} 
                icon="open"
                buttonTitle="Open feature" 
                styles={{
                  backgroundColor: 'rgb(147,166,176)'
                }}
                doClick={() => this.setState({ viewing: true })} 
              />
              <IconButton 
                disabled={false}
                solid={true} 
                icon="delete"
                buttonTitle="Delete feature" 
                styles={{
                  backgroundColor: 'rgb(198,208,213)'
                }} 
                doClick={this.handleDelete} 
              />
              <IconButton 
                disabled={false}
                solid={false}
                icon="edit"
                buttonTitle="Edit feature" 
                styles={{
                  borderColor: 'rgb(198,208,213)',
                  color: 'rgb(198,208,213)'
                }} 
                doClick={this.handleEdit} 
              />
            </div> 
            : null
        }
        {
          this.state.viewing
            ? <ViewFeature 
                onFeatureClose={() => this.setState({ viewing: false })}
                feature={this.state.feature} 
            /> 
            : null
        }
      </div>
    );
  }
}

export default Feature;