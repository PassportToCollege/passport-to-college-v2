import './FeatureList.css';

import React from 'react';
import propTypes from 'prop-types';

import _Feature from '../../models/Feature';
import Feature from '../Feature';

interface FeatureListProps {
  features: _Feature[];
  showActions: boolean;
  doDelete: (feature: _Feature) => void;
  doEdit: (feature: _Feature) => void;
}

const FeatureList = (props: FeatureListProps): React.ReactNode => {
  const { features, showActions, doDelete, doEdit } = props;

  return (
    <div className="feature_list">
      {
        features.map((feature, i) => {
          return (
            <Feature 
              key={i} 
              showActions={showActions}
              feature={feature} 
              doDelete={doDelete} 
              doEdit={doEdit} 
            />
          );
        })
      }
    </div>
  );
};

export default FeatureList;