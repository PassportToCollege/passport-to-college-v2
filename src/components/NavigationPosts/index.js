import "./NavigationPosts.css";

import React from "react";
import { withRouter, NavLink, Link } from "react-router-dom";
import propTypes from "prop-types";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faPlus, faFilter } from "@fortawesome/fontawesome-free-solid";

import * as routes from "../../constants/routes";

const NavigationPosts = () => {
  return (
    <nav className="navigation_posts">
      <Link className="navigation_posts__add_post" title={routes.DASH_POSTS_NEW.name} 
        to={routes.DASH_POSTS_NEW.route}>
        <FontAwesomeIcon icon={faPlus} />
      </Link>
      <ul className="navigation_posts__links">
        {
          routes.DASH_POSTS_SECTIONS.map(section => {
            return (
              <li key={section.route}>
                <NavLink exact to={section.route}
                  activeClassName="active">
                  {section.name.toLowerCase()}
                </NavLink>
              </li>
            )
          })
        }
      </ul>
      <NavLink className="navigation_posts__categories" title={routes.POST_CATEGORIES.name}
        to={routes.POST_CATEGORIES.route}
        activeClassName="active">
        <FontAwesomeIcon icon={faFilter} />
      </NavLink>
    </nav>
  )
}

NavigationPosts.propTypes = {
  addPost: propTypes.func
}

export default withRouter(NavigationPosts);