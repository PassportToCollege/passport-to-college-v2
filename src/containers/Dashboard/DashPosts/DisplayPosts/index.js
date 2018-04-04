import "./DisplayPosts.css";

import React, { Component} from "react";
import { connect} from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as postsActions from "../../../../actions/postsActions";

class DisplayPosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: props.posts.posts
    }
  }

  componentWillMount() {
    this.props.togglePostNav(true);
    this.props.postsActions.doPostsGet();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.posts.hasGotten)
      this.setState({ posts: nextProps.posts.posts });
  }

  render() {
    return (
      <div className="posts">

      </div>
    )
  }
}

DisplayPosts.propTypes = {
  posts: propTypes.object,
  postsActions: propTypes.object,
  togglePostNav: propTypes.func
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