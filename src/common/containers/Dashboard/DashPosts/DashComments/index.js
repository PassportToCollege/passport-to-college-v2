import "./DashComments.css";

import React, { Component } from "react";
import { Link, Route } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";
import moment from "moment";
import _ from "lodash";

import ManageComment from "./ManageComment";
import CommentLikes from "./CommentLikes";
import DashReplies from "./DashReplies";
import PageMeta from "../../../../components/PageMeta";
import LoadingText from "../../../../components/LoadingText";
import Loader from "../../../../components/Loader";
import Button from "../../../../components/Button";
import IconButton from "../../../../components/IconButton";
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
    this.props.commentActions.doGetConversations(this.state.post, {
      getUserPicture: true
    });
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
                <TableHeader />
                <TableHeader heading="user" />
                <TableHeader heading="comment" />
                <TableHeader heading="likes" />
                <TableHeader heading="replies" />
                <TableHeader heading="reports" />
                <TableHeader heading="posted on?" />
              </TableRow>
            }
            rows={this._renderTableData()} />

            <Route exact
              path="/admin/dashboard/post/:post_id/comments/:conversation_id"
              render={props => {
                return <ManageComment {...props} conversations={this.state.conversations} />
              }} />
            
            <Route exact
              path="/admin/dashboard/post/:post_id/comments/:conversation_id/replies"
              render={props => {
                return <DashReplies {...props} post={this.state.post} />
              }} />

            <Route exact
              path="/admin/dashboard/post/:post_id/comments/:comment_id/likes"
              component={CommentLikes} />
        </main>
      </div>
    )
  }

  goBackToPost = () => {
    this.props.history.push(`/admin/dashboard/posts/e/${this.state.post}`);
  }

  _renderTableData = () => {
    if (this.props.comments.gotConversations && this.state.conversations) {
      return this.state.conversations.map(conversation => {
        return (
          <TableRow key={conversation.id}>
            <TableData>
              <IconButton type="button" icon="cog" solid
                doClick={
                  () => this.props.history.push(
                    `/admin/dashboard/post/${this.state.post}/comments/${conversation.id}`,
                    { referrer:  `/admin/dashboard/post/${this.state.post}/comments` }
                  )
                } 
                buttonTitle="Manage this Comment" 
                styles={{
                  width: "24px",
                  height: "24px",
                  fontSize: "1em"
                }} />
            </TableData>
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
              {
                countLikes(conversation.likes) ?
                  <Link className="dash_comments__likes"
                    to={{
                      pathname: `/admin/dashboard/post/${this.state.post}/comments/${conversation.id}/likes`,
                      state: {
                        referrer: this.props.location.pathname
                      }
                    }} >
                    {countLikes(conversation.likes)}
                  </Link> : countLikes(conversation.likes)
              }
            </TableData>
            <TableData>
              {
                conversation.replies ?
                  <Link className="dash_comments__replies"
                    to={{
                      pathname: `/admin/dashboard/post/${this.state.post}/comments/${conversation.id}/replies`,
                      state: {
                        referrer: this.props.location.pathname
                      }
                    }}>
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
          <TableData span="7" classes={["table__center_data"]}>
            {this.props.comments.error.message}
          </TableData>
        </TableRow>
      )
    }

    return (
      <TableRow>
        <TableData span="7" classes={["table__center_data"]}>
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