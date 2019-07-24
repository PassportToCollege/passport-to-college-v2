import './AccomplishmentsList.css';

import React from 'react';

import Accomplishment from '../Accomplishment';
import iAccomplishment from '../../imodels/iAccomplishment';

interface AccomplishmentsListProps {
  accomplishments: iAccomplishment[];
  showActions: boolean;
  listStyles: React.CSSProperties;
  doDelete: (accomplishment: iAccomplishment) => void;
  doEdit: (accomplishment: iAccomplishment) => void;
}

const AccomplishmentsList = (props: AccomplishmentsListProps) => {
  const { accomplishments, showActions, listStyles, doDelete, doEdit } = props;

  return (
      <div 
        className="accomplishments_list" 
        style={listStyles}
      >
        {
          Object.keys(accomplishments).map((key) => {
            return (
              <Accomplishment 
                key={key} 
                showActions={showActions} 
                accomplishment={accomplishments[key]} 
                doDelete={doDelete}
                doEdit={doEdit} 
              />
            );
          })
        }
      </div>
    );
};

export default AccomplishmentsList;