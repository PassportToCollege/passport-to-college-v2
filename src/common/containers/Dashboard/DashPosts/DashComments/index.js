import "./DashComments.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";

import PageMeta from "../../../../components/PageMeta";

import * as commentActions from "../../../../actions/commentActions";
import * as postActions from "../../../../actions/postActions";

class DashComments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: props.match.params.post_id
    }
  }

  static propTypes = {
    comments: propTypes.object,
    commentActions: propTypes.object,
    match: propTypes.object,
    post: propTypes.object,
    postActions: propTypes.object
  }

  componentDidMount() {
    this.props.postActions.doPostGet(this.state.post);
    this.props.commentActions.doGetComments(this.state.post, 1);
  }
  
  render() {
    return (
      <div className="dashboard__container dash_comments__container">
        {
          this.props.post.hasGotten ?
            <PageMeta more={
              <title>
                {this.props.post.post.title || this.state.post} | Comments | Dashboard | Passport to College
              </title>
            } /> :
            <PageMeta more={
              <title>
                {this.state.post} | Comments | Dashboard | Passport to College
              </title>
            } />
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    comments: state.comments,
    post: state.post
  };
};

const mapDispatchToProps = dispatch => {
  return {
    commentActions: bindActionCreators(commentActions, dispatch),
    postActions: bindActionCreators(postActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashComments);