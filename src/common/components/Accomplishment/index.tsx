import './Accomplishment.css';

import React from 'react';
import moment from 'moment';

import IconButton from '../IconButton';
import iAccomplishment from '../../imodels/iAccomplishment';

interface AccomplishmentProps {
  accomplishment: iAccomplishment;
  showActions: boolean;
  doDelete: (accomplishment: iAccomplishment) => void;
  doEdit: (accomplishment: iAccomplishment) => void;
}

const Accomplishment = (props: AccomplishmentProps) => {
  const { accomplishment, showActions, doDelete, doEdit } = props;
  const handleDelete = () => {
    if ('function' === typeof doDelete) {
      doDelete(accomplishment);
    }
  };

  const handleEdit = () => {
    if ('function' === typeof doEdit) {
      doEdit(accomplishment);
    }
  };

  return (
    <div className="accomplishment">
      <section className="accomplishment__meta">
        {
          accomplishment.state.published ?
            <p className="type__caption accomplishment__published">published</p> :
            null
        }
        {
          accomplishment.state.draft ?
            <p className="type__caption accomplishment__draft">draft</p> :
            null
        }
        <h5>{accomplishment.title}</h5>
        <p className="type__caption">
          {moment.utc(moment(accomplishment.createdAt)).format('MMM D, YYYY')}
        </p>
      </section>
      <section className="accomplishment__excerpt">
        <p>{accomplishment.excerpt}</p>
      </section>
      {
        showActions ?
          <section className="accomplishment__actions">
            <IconButton 
              solid={true}
              disabled={false}
              icon="delete" 
              styles={{
                backgroundColor: 'rgba(128, 150, 162, 0.85)'
              }} 
              doClick={handleDelete} 
            />
            <IconButton 
              icon="edit"
              solid={false}
              disabled={false}
              styles={{
                borderColor: 'rgba(128, 150, 162, 0.85)',
                color: 'rgba(128, 150, 162, 0.85)'
              }} 
              doClick={handleEdit} 
            />
          </section> :
          null
      }
    </div>
  );
};

export default Accomplishment;