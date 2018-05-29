import "./CommentSection.css";

import React, { Component} from "react";
import { connect} from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";
import _ from "lodash";

import * as commentActions from "../../actions/commentActions";

import Conversation from "../Conversation";

class CommentSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: props.post
    }
  }

  static propTypes = {
    post: propTypes.object,
    comments: propTypes.object,
    commentActions: propTypes.object
  }

  componentDidMount() {
    this.props.commentActions.doGetComments(this.state.post.id, 1);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = null;

    if (nextProps.comments.gotComments) {
      newState = {
        comments: nextProps.comments.comments
      };
    }

    if (nextProps.comments.failedToGetComments 
      && nextProps.comments.error.message === "no comments found") {
      newState = {
        comments: nextProps.comments.comments
      }
    }

    if (nextProps.post && !_.isEqual(nextProps.post, prevState.post)) {
      newState = newState || {};
      newState.post = nextProps.post;
    }

    return newState;
  }

  getSnapshotBeforeUpdate(prevProps) {
    let snapshot = null;

    if (prevProps.post.id !== this.props.post.id) {
      snapshot = {
        postChanged: true
      };
    }

    return snapshot;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot && snapshot.postChanged) {
      if (!this.props.comments.gettingComments)
        this.props.commentActions.doGetComments(this.state.post.id, 1);
    }
  }

  render() {
    return (
      <div className={`comment_section comment_section__${this.state.post.id}`}>
        {
          this.props.comments.gotComments && this.state.comments ?
            this.state.comments.map(comment => {
              return <Conversation key={comment.id} comment={comment} />
            }): this.props.comments.failedToGetComments && this.props.comments.error.message === "no comments found" ?
              <span className="comment_section__no_comments">Be the first to respond!</span> : null
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    comments: state.comments
  };
};

const mapDispatchToProps = dispatch => {
  return {
    commentActions: bindActionCreators(commentActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentSection);