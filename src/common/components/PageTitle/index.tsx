import './PageTitle.css';

import React from 'react';

interface PageTitleProps {
  titleStyles: React.CSSProperties;
  children: React.ReactNode;
}

const PageTitle = (props: PageTitleProps): React.ReactNode => {
  const { titleStyles, children } = props;

  return (
    <h1 className="page_title" style={titleStyles}>
      {children}
    </h1>
  );
};

export default PageTitle;