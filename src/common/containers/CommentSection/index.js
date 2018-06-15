import "./CommentSection.css";

import React, { Component} from "react";
import { connect} from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";
import _ from "lodash";

import * as commentActions from "../../actions/commentActions";

import Loader from "../../components/Loader";
import Conversation from "../Conversation";

class CommentSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: props.post,
      comments: []
    }
  }

  static propTypes = {
    post: propTypes.object,
    comments: propTypes.object,
    commentActions: propTypes.object,
    newComment: propTypes.string,
    all: propTypes.bool
  }

  componentDidMount() {
    this.props.commentActions.doGetComments(this.state.post.id, 1);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = null;

    if (nextProps.comments.gotComments) {
      if (!prevState.comments.length) {
        newState = {
          comments: nextProps.comments.comments
        };
      }

      if (prevState.comments.length > 0 && 
        prevState.comments.length < nextProps.comments.comments.length) {
        newState = {
          comments: prevState.comments.concat(nextProps.comments.comments.slice(prevState.comments.length))
        }
      }
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

    if (nextProps.newComment !== prevState.newComment) {
      newState = newState || {};
      newState.newComment = nextProps.newComment;
    }

    if (nextProps.comments.gotComment) {
      if (prevState.comments && !_.isEqual(prevState.comments[0], nextProps.comments.comment)) {
        newState = newState || {};
        newState.comments = prevState.comments;
        newState.comments.unshift(nextProps.comments.comment);
      } else if (!prevState.comments) {
        newState = newState || {};
        newState.comments = [nextProps.comments.comment];
      }
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

    if (prevProps.newComment !== this.props.newComment) {
      snapshot = {
        commentAdded: true
      };
    }

    if (!prevProps.all && this.props.all) {
      snapshot = {
        getAll: true
      };
    }

    return snapshot;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot && snapshot.postChanged) {
      if (!this.props.comments.gettingComments)
        this.props.commentActions.doGetComments(this.state.post.id, 1);
    }

    if (snapshot && snapshot.commentAdded) {
      if (!this.props.commentActions.gettingComment)
        this.props.commentActions.doGetComment(this.state.newComment);
    }

    if (snapshot && snapshot.getAll) {
      if (!this.props.comments.gettingComments) {
        this.props.commentActions.doGetComments(this.state.post.id, 2);
      }
    }
  }

  render() {
    return (
      <div className={`comment_section comment_section__${this.state.post.id}`}>
        {
          this.state.comments && this.state.comments.length ?
            this.state.comments.map(comment => {
              return <Conversation key={comment.id} comment={comment} />
            }): this.props.comments.failedToGetComments && this.props.comments.error.message === "no comments found" ?
              <span className="comment_section__no_comments">Be the first to respond!</span> : null
        }
        {
          this.props.comments.gettingComments ?
            <Loader width="32px" styles={{
              margin: "1em auto"
            }} /> : null
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