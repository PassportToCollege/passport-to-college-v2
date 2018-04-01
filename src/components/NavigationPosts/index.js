import "./NavigationPosts.css";

import React from "react";
import { withRouter, NavLink } from "react-router-dom";
import propTypes from "prop-types";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/fontawesome-free-solid";

import * as routes from "../../constants/routes";

const NavigationPosts = ({ addPost }) => {
  const handleAddPostClick = () => {
    if ("function" === typeof addPost)
      addPost();
  }

  return (
    <nav className="navigation_posts">
      <span className="navigation_posts__add_post" title="Add post" 
        onClick={handleAddPostClick}>
        <FontAwesomeIcon icon={faPlus} />
      </span>
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
    </nav>
  )
}

NavigationPosts.propTypes = {
  addPost: propTypes.func
}

export default withRouter(NavigationPosts);