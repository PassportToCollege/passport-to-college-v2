import "./DisplayPosts.css";

import React, { Component} from "react";
import { connect} from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as postsActions from "../../../../actions/postsActions";

import PostCardList from "../../../../components/PostCardList";
import Loader from "../../../../components/Loader";

import EmptyStateRed from "../../../../assets/images/empty_state__red.png";

class DisplayPosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: props.posts.posts
    }
  }

  componentDidMount() {
    this.props.togglePostNav(true);
    
    if (this.props.location.state && this.props.location.state.current !== "all") {
      this.props.postsActions.doGetPostsByState(this.props.location.state.current);
    } else {
      this.props.postsActions.doPostsGet();
    }
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.posts.hasGotten)
      return { posts: nextProps.posts.posts };

    return null;
  }

  render() {
    return (
      <div className="dashboard_posts">
        {
          this.props.posts.hasGotten && this.state.posts.length ?
            <PostCardList posts={this.state.posts} /> :
            this.props.posts.postsGetFailed ? 
              <div className="no__posts">
                <img src={EmptyStateRed} alt="no posts" />
                <h4>No posts yet.</h4>
              </div> : <Loader />
        }
      </div>
    )
  }
}

DisplayPosts.propTypes = {
  posts: propTypes.object,
  postsActions: propTypes.object,
  togglePostNav: propTypes.func,
  section: propTypes.string,
  location: propTypes.object
};

const mapStateToProps = state => {
  return {
    posts: state.posts
  };
};

const mapDispatchToProps = dispatch => {
  return {
    postsActions: bindActionCreators(postsActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DisplayPosts);