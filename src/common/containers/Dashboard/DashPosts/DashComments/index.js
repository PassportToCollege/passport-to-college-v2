import "./DashComments.css";

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";
import moment from "moment";
import _ from "lodash";

import PageMeta from "../../../../components/PageMeta";
import LoadingText from "../../../../components/LoadingText";
import Loader from "../../../../components/Loader";
import Button from "../../../../components/Button";
import { Table, TableData, TableHeader, TableRow } from "../../../../components/Table";

import { countLikes } from "../../../../utils";
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
    location: propTypes.object,
    match: propTypes.object,
    post: propTypes.object,
    postActions: propTypes.object
  }

  componentDidMount() {
    this.props.postActions.doPostGet(this.state.post);
    this.props.commentActions.doGetConversations(this.state.post);
  }
  
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.comments.gotConversations &&
      !_.isEqual(prevState.conversation, nextProps.comments.conversations)) {
      return {
        conversations: nextProps.comments.conversations
      };
    }

    return null;
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
          <Table classes={["table__default"]}
            headers={
              <TableRow>
                <TableHeader heading="user" />
                <TableHeader heading="comment" />
                <TableHeader heading="likes" />
                <TableHeader heading="replies" />
                <TableHeader heading="reports" />
                <TableHeader heading="posted on?" />
              </TableRow>
            }
            rows={this._renderTableDate()} />
        </main>
      </div>
    )
  }

  goBackToPost = () => {
    this.props.history.push(`/admin/dashboard/posts/e/${this.state.post}`);
  }

  _renderTableDate = () => {
    if (this.props.comments.gotConversations && this.state.conversations) {
      return this.state.conversations.map(conversation => {
        return (
          <TableRow key={conversation.id}>
            <TableData>
              <Link className="dash_comments__user"
                to={`/admin/dashboard/users/view/${conversation.user.uid}`}>
                {conversation.user.name.full}
              </Link>
            </TableData>
            <TableData>
              {conversation.message.text}
            </TableData>
            <TableData>
              {countLikes(conversation.likes)}
            </TableData>
            <TableData>
              {
                conversation.replies ?
                  <Link className="dash_comments__replies"
                    to={`${this.props.location.pathname}/replies`}>
                    {conversation.replies}
                  </Link> :
                  <span>0</span>
              }
            </TableData>
            <TableData>
              {/* TODO: add reports here */}
              0
            </TableData>
            <TableData>
              {moment.utc(moment(conversation.postedOn)).format("MM/DD/YYYY")}
            </TableData>
          </TableRow>
        )
      });
    }

    if (this.props.comments.failedToGetConversations) {
      return (
        <TableRow>
          <TableData span="6" classes={["table__center_data"]}>
            {this.props.comments.error.message}
          </TableData>
        </TableRow>
      )
    }

    return (
      <TableRow>
        <TableData span="6" classes={["table__center_data"]}>
          <Loader width="24px"
            styles={{
              display: "inline-block",
              verticalAlign: "middle",
              margin: "0 0 0 1em"
            }} />
        </TableData>
      </TableRow>
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