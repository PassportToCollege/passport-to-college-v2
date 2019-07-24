import './AnnotatedList.css';

import React from 'react';

export interface AnnotatedListItem {
  label: string;
  text: string;
}

interface AnnotatedListProps {
  data: AnnotatedListItem[];
}

const AnnotatedList = (props: AnnotatedListProps) => {
  const{ data } = props;
  
  return (
    <ul className="annotated_list">
      {
        data.map((item, index) => {
          return (
            <li key={index}>
              <span className="annotated_list__label">{item.label}</span>
              <span className="annotated_list__text">{item.text}</span>
            </li>
          );
        })
      }
    </ul>
  );
};

export default AnnotatedList;