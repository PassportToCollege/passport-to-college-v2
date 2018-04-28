import "./DisplayPosts.css";

import React, { Component} from "react";
import { connect} from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as postsActions from "../../../../actions/postsActions";

import PostCardList from "../../../../components/PostCardList";
import Loader from "../../../../components/Loader";

class DisplayPosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: props.posts.posts,
      section: props.section
    }
  }

  componentDidMount() {
    this.props.togglePostNav(true);
    this.props.postsActions.doPostsGet();
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
            <Loader />
        }
      </div>
    )
  }
}

DisplayPosts.propTypes = {
  posts: propTypes.object,
  postsActions: propTypes.object,
  togglePostNav: propTypes.func,
  section: propTypes.string
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