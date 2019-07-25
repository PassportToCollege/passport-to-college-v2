import './ListItem.css';

import React from 'react';

interface ListItemProps {
  text: string;
  bullet: boolean;
  children: React.ReactChildren;
}

const ListItem = (props: ListItemProps): React.ReactNode => {
  const { text, bullet = true, children } = props;

  return (
    <li className="list_item" data-bullet={bullet}>
      {children || text}
    </li>
  );
};

export default ListItem;