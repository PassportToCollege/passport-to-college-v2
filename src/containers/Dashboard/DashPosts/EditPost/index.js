import "./EditPost.css";

import React, { Component} from "react";
import { connect} from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";

import * as postActions from "../../../../actions/postActions";

class EditPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: props.post.post,
      postChanges: {}
    };
  }

  componentWillMount() {
    this.props.togglePostNav(false);

    const { post_id } = this.props.match.params;
    this.props.postAction.doPostGet(post_id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.post.hasGotten)
      this.setState({ post: nextProps.post.post });
  }

  render() {
    return (
      <div className="edit_post">
        <nav className="edit_post__nav">
          <h4>options</h4>
          <ul className="edit_post__nav_list">
            <li className="edit_post__save">save</li>
            <li className="edit_post__publish">publish</li>
            <li className="edit_post__unpublish">unpublish</li>
            <li className="edit_post__archive">archive</li>
          </ul>
        </nav>
        <main className="edit_post__edit">
          <h1 className="edit_post__post_title" contentEditable
            suppressContentEditableWarning={true}
            onInput={this.handleTitleChange}>
            {
              this.props.post.hasGotten && this.state.post ?
                this.state.post.title ? this.state.post.title : "Post Title Here" :
                null
            }
          </h1>
        </main>
      </div>
    )
  }

  handleTitleChange = e => {
    this.setState({ postChanges: Object.assign({}, this.state.postChanges, {
        title: e.target.innerText
      }) 
    });
  }
}

EditPost.propTypes = {
  post: propTypes.object,
  postAction: propTypes.object,
  match: propTypes.object,
  togglePostNav: propTypes.func
};

const mapStateToProps = state => {
  return {
    post: state.post
  };
};

const mapDispatchToProps = dispatch => {
  return {
    postAction: bindActionCreators(postActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditPost);