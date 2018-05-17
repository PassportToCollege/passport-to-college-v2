import React from "react";
import { Helmet } from "react-helmet";
import propTypes from "prop-types";

import * as routes from "../../constants/routes";

const PageMeta = ({ route, more, children }) => {
  return (
    <Helmet>
      {
        route ?
          <title>{`${routes[route].name} | Passport to College`}</title> : null
      }
      {more}
      {children}
    </Helmet>
  )
}

PageMeta.propTypes = {
  route: propTypes.string,
  more: propTypes.node,
  children: propTypes.node
};

export default PageMeta;
