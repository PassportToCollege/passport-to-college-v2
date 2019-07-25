import React from 'react';
import { Helmet } from 'react-helmet';
import propTypes from 'prop-types';

import * as routes from '../../constants/routes';

interface PageMetaProps {
  route: string;
  more: React.ReactChild;
  children: React.ReactChildren;
}

const PageMeta = (props: PageMetaProps): React.ReactNode => {
  const { route, more, children } = props;

  return (
    <Helmet>
      {
        route ?
          <title>{`${routes[route].name} | Passport to College`}</title> : null
      }
      {more}
      {children}
    </Helmet>
  );
};

export default PageMeta;
