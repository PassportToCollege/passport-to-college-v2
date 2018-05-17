import "./NavigationPosts.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter, NavLink } from "react-router-dom";
import propTypes from "prop-types";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faPlus, faFilter } from "@fortawesome/fontawesome-free-solid";

import * as routes from "../../constants/routes";
import * as postActions from "../../actions/postActions";

import Loader from "../../components/Loader";

class NavigationPosts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: props.show,
      working: false,
      hasError: false,
      error: "",
      notificationClosed: true
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = null;

    if (nextProps.post.isCreating) {
      newState = {};
      newState.working = true;
    }

    if (nextProps.post.postCreationFailed) {
      newState = newState || {};
      newState = Object.assign({}, newState, {
        hasError: true,
        error: nextProps.post.errpr.message,
        notificationClosed: false
      });
    }
    
    if (nextProps.post.hasCreated && prevState.working) {
      newState = newState || {};
      newState.working = false;
      nextProps.history.push(`/admin/dashboard/posts/e/${nextProps.post.id}`);
    }

    if (nextProps.show !== prevState.show) {
      newState = newState || {};
      newState.show = nextProps.show;
    }
    
    return newState;
  }

  render() {
    return (
      <nav className={`navigation_posts ${this.state.show ? "" : "hide"}`}>
        {
          this.state.working ?
            <Loader width="32px" /> :
            <span className="navigation_posts__add_post" title="Create post"
              onClick={this.handleCreatePostClick}>
              <FontAwesomeIcon icon={faPlus} />
            </span>
        }
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

  handleCreatePostClick = () => {
    this.props.postActions.doPostCreate();
  }
}

NavigationPosts.defaultProps = {
  show: true
}

NavigationPosts.propTypes = {
  addPost: propTypes.func,
  show: propTypes.bool,
  postActions: propTypes.object,
  post: propTypes.object,
  history: propTypes.object
}

const mapStateToProps = state => {
  return {
    post: state.post
  };
};

const mapDispatchToProps = dispatch => {
  return {
    postActions: bindActionCreators(postActions, dispatch)
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NavigationPosts)
);