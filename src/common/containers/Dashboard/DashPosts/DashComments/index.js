import "./DashComments.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";

import PageMeta from "../../../../components/PageMeta";
import LoadingText from "../../../../components/LoadingText";
import Button from "../../../../components/Button";

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
    history: propTypes.object,
    match: propTypes.object,
    post: propTypes.object,
    postActions: propTypes.object
  }

  componentDidMount() {
    this.props.postActions.doPostGet(this.state.post);
    this.props.commentActions.doGetConversations(this.state.post);
  }
  
  render() {
    return (
      <div className="dashboard__container dash_comments__container">
        {
          this.props.post.hasGotten ?
            <PageMeta more={
              <title>
                {this.props.post.post.title || this.state.post} | Conversations | Dashboard | Passport to College
              </title>
            } /> :
            <PageMeta more={
              <title>
                {this.state.post} | Conversations | Dashboard | Passport to College
              </title>
            } />
        }
        <header>
          <h1>Conversations</h1>
          {
            this.props.post.hasGotten ?
              <span className="dash_comments__post_title">{this.props.post.post.title}</span> :
              <LoadingText options={{
                class: "block__lines",
                bg: "transparent",
                height: "10px",
                lines: [
                  { color: "rgba(255,101,97,0.2)", width: "300px" }
                ]
              }} />
          }
          <Button type="button" solid
            text="back to post"
            doClick={this.goBackToPost}
            styles={{
              position: "absolute",
              right: "2em",
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "#FFCB61"
            }} />
        </header>
        <main className="dash_comments">
        </main>
      </div>
    )
  }

  goBackToPost = () => {
    this.props.history.push(`/admin/dashboard/posts/e/${this.state.post}`);
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