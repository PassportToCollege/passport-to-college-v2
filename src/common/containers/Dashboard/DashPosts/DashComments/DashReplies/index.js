import "./DashReplies.css";

import React, { Component } from "react";
import { Link, Route } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";
import moment from "moment";
import _ from "lodash";

import PageMeta from "../../../../../components/PageMeta";
import Modal from "../../../../../components/Modal";
import LoadingText from "../../../../../components/LoadingText";
import Loader from "../../../../../components/Loader";
import Button from "../../../../../components/Button";
import IconButton from "../../../../../components/IconButton";
import { Table, TableData, TableHeader, TableRow } from "../../../../../components/Table";

import { countLikes } from "../../../../../utils";
import * as commentActions from "../../../../../actions/commentActions";

class DashReplies extends Component {
  constructor(props) {
    super(props);

    this.state = {
      conversation: props.match.params.conversation_id
    }
  }

  static propTypes = {
    comments: propTypes.object,
    commentActions: propTypes.object,
    history: propTypes.object,
    match: propTypes.object,
    location: propTypes.object
  }

  componentDidMount() {
    this.props.commentActions.doGetReplies(this.state.conversation, "all");
  }

  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.comments.gotReplies && nextProps.comments.replies[state.conversation] &&
      !_.isEqual(state.replies, nextProps.comments.replies[state.conversation])) {
      return {
        replies: nextProps.comments.replies[state.conversation]
      }
    }

    return null;
  }

  render() {
    return (
      <React.Fragment>
        <PageMeta more={
          <title>
            Replies | {this.state.conversation} | Dashboard | Passport to College
          </title>
        } />
        <Modal doClose={this.handleModalClose}
          classes={["modal__conversation_replies"]}>
          <h2>
            Replies {
              this.state.replies ?
                `(${this.state.replies.length})` :
                null
            }
          </h2>
          <h5>Conversation: {this.state.conversation}</h5>
          <main className="conversation_replies">
            <Table classes={["table__default"]}
              headers={
                <TableRow>
                  <TableHeader />
                  <TableHeader heading="user" />
                  <TableHeader heading="comment" />
                  <TableHeader heading="likes" />
                  <TableHeader heading="reports" />
                  <TableHeader heading="posted on?" />
                </TableRow>
              }
              rows={this._renderTableData()} />
          </main>
        </Modal>
      </React.Fragment>
    )
  }

  handleModalClose = () => {
    this.props.history.push(this.props.history.location.state.referrer);
  }

  _renderTableData = () => {
    if (this.props.comments.gotReplies && this.state.replies) {
      return this.state.replies.map(reply => {
        return (
          <TableRow key={reply.id}>
            <TableData>
              <IconButton type="button" icon="cog" solid
                doClick={
                  () => this.props.history.push(
                    `/admin/dashboard/post/${reply.post}/comments/${this.state.conversation}`,
                    { referrer:  this.props.location.pathname }
                  )
                } 
                buttonTitle="Manage this Reply" 
                styles={{
                  width: "24px",
                  height: "24px",
                  fontSize: "1em"
                }} />
            </TableData>
            <TableData>
              <Link className="dash_comments__user"
                to={`/admin/dashboard/users/view/${reply.user.uid}`}>
                {reply.user.name.full}
              </Link>
            </TableData>
            <TableData>
              {reply.message.text}
            </TableData>
            <TableData>
              {
                countLikes(reply.likes) ?
                  <Link className="dash_comments__likes"
                    to={{
                      pathname: `/admin/dashboard/post/${reply.post}/comments/${this.state.conversation}/likes`,
                      state: { referrer: this.props.location.pathname }
                    }} >
                    {countLikes(reply.likes)}
                  </Link> : countLikes(reply.likes)
              }
            </TableData>
            <TableData>
              {/* TODO: add reports here */}
              0
            </TableData>
            <TableData>
              {moment.utc(moment(reply.postedOn)).format("MM/DD/YYYY")}
            </TableData>
          </TableRow>
        )
      })
    }
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
)(DashReplies);