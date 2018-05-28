import "./CommentSection.css";

import React, { Component} from "react";
import { connect} from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";

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

  static getDerivedStateFromProps(nextProps) {
    let newState = null;

    if (nextProps.comments.gotComments) {
      newState = {
        comments: nextProps.comments.comments
      };
    }

    return newState;
  }

  render() {
    return (
      <div className={`comment_section comment_section__${this.state.post.id}`}>
        {
          this.props.comments.gotComments && this.state.comments ?
            this.state.comments.map(comment => {
              return <Conversation key={comment.id} comment={comment} />
            }) : null
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