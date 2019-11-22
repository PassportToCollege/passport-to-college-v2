import React from 'react';
import { Helmet } from 'react-helmet';
import propTypes from 'prop-types';

import * as routes from '../../constants/routes';

interface PageMetaProps {
  route: string;
  more?: React.ReactChild;
  children?: React.ReactChildren;
}

class PageMeta extends React.PureComponent<PageMetaProps> {
  public render() {
    const { route, more, children } = this.props;

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
  }
}

export default PageMeta;
