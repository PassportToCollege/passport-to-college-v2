import './List.css';

import React from 'react';

interface ListProps {
  width: string;
  children: React.ReactChildren;
}

const List = (props: ListProps): React.ReactNode => {
  const { width = '100%', children } = props;
  return (
    <ul 
      className="list"
      style={{
        maxWidth: width
      }}
    >
      {children}
    </ul>
  );
};

export default List;