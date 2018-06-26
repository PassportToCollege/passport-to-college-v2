import "./Comment.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as commentActions from "../../actions/commentActions";

import Modal from "../../components/Modal";
import RadioList from "../../components/RadioList";
import MoreMenu from "../../components/MoreMenu";
import Responder from "../Responder";
import CommentHeader from "../../components/CommentHeader";
import WYSIWYGEditor from "../../components/Editor";
import LikeComment from "../LikeComment";
import Button from "../../components/Button";

import { isAuthorized, activeUser } from "../../utils";

class Comment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      replying: false,
      showMoreMenu: false,
      reporting: false
    }
  }

  static propTypes = {
    comment: propTypes.object,
    comments: propTypes.object,
    commentActions: propTypes.object,
    reply: propTypes.bool,
    viewAll: propTypes.bool,
    doViewAll: propTypes.func,
    hideAll: propTypes.bool,
    doHideAll: propTypes.func,
    onReplyClick: propTypes.func,
    onReply: propTypes.func,
    readonly: propTypes.bool
  }

  static defaultProps = {
    reply: false,
    readonly: false
  }

  render() {
    let menuItems = [];
    if (isAuthorized() && this.props.comment.user.uid === activeUser()) {
      menuItems.push({
        label: "Delete",
        doClick: this.handleCommentDelete
      });
    } else if (isAuthorized() && this.props.comment.user.uid !== activeUser()) {
      menuItems.push({
        label: "Report spam or abuse",
        doClick: this.handleReportClick
      })
    }

    return (
      <React.Fragment>
        {
          this.state.reporting ?
            <Modal doClose={() => this.setState({ reporting: false, reportingFor: null })}>
              <h3>Report this comment</h3>
              <RadioList
                onRadioChange={value => this.setState({ reportingFor: value })}
                radios={[
                  { label: "Commercial content or spam", value: "commercial-or-spam" },
                  { label: "Sexually explicit material", value: "sexual" },
                  { label: "Hate speech or graphic violence", value: "hate-or-violence" },
                  { label: "Harassment or bullying", value: "harassment-or-bullying" }
                ]} />
              <div className="modal__buttons">
                <Button type="button" text="cancel" solid
                  doClick={() => this.setState({ reporting: false, reportingFor: null }) } 
                  styles={{ backgroundColor: "#bbb" }}/>
                <Button type="button" text="report" solid
                  disabled={!this.state.reportingFor}
                  doClick={this.handleCommentReport} />
              </div>
            </Modal> : null

        }
        <div className={`comment ${this.props.reply ? "comment__reply" : ""}`}
          onMouseEnter={() => this.setState({ showMoreMenu: true })}
          onMouseLeave={() => this.setState({ showMoreMenu: false })}>
          <CommentHeader comment={this.props.comment} />
          <WYSIWYGEditor readonly content={this.props.comment.message.html} />
          <LikeComment comment={this.props.comment} readonly={this.props.readonly} />
          {
            !this.props.readonly ?
              <span className="comment__reply_button"
                onClick={this.handleReplyClick}>
                Reply
              </span> : null
          }
          {
            !this.props.readonly && !this.props.comment.isConversation && this.state.replying ?
              <Responder type="comment" active={this.state.replying}
                comment={this.props.comment}
                postId={this.props.comment.post}
                onResponse={this.handleReply}
                height="50" 
                doClose={this.listenResponderClose} /> : null
          }
          {
            !this.props.readonly && this.props.comment.isConversation && this.props.viewAll ?
              <span className="comment__view_all" onClick={this.handleViewAllClick}>
                {
                  this.props.comment.replies > 1 ?
                    <React.Fragment>
                      view all responses
                    </React.Fragment> :
                    <React.Fragment>
                      view response
                    </React.Fragment>
                }
              </span> : null
          }
          {
            !this.props.readonly && this.props.comment.isConversation && this.props.hideAll ?
            <span className="comment__hide_all" onClick={this.handleHideAllClick}>
                {
                  this.props.comment.replies > 1 ?
                    <React.Fragment>
                      hide all responses
                    </React.Fragment> :
                    <React.Fragment>
                      hide response
                    </React.Fragment>
                }
              </span> : null
          }
          {
            !this.props.readonly && this.state.showMoreMenu && isAuthorized() ?
              <div className="comment__more_menu_container">
                <MoreMenu menuItems={menuItems}/>
              </div> : null
          }
        </div>
      </React.Fragment>
    )
  }

  handleReplyClick = () => {
    if (this.props.comment.isConversation &&
      "function" === typeof this.props.onReplyClick) {
      return this.props.onReplyClick();
    }

    this.setState({ replying: !this.state.replying });
  }

  listenResponderClose = () => {
    if (this.state.replying)
      this.setState({ replying: false });
  }

  handleReply = reply => {
    this.setState({ replying: false });
    
    if ("function" === typeof this.props.onReply)
      this.props.onReply(reply);
  }

  handleViewAllClick = () => {
    if ("function" === typeof this.props.doViewAll)
      this.props.doViewAll();
  }

  handleHideAllClick = () => {
    if ("function" === typeof this.props.doHideAll)
      this.props.doHideAll();
  }

  handleReportClick = () => {
    this.setState({ reporting: true });
  }

  handleCommentReport = () => {
    const { reportingFor } = this.state;

    // TODO: report comment
    console.log(reportingFor);
    this.setState({ reporting: false, reportingFor: null });
  }

  handleCommentDelete = () => {
    this.props.commentActions.doDeleteComment(this.props.comment);
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
)(Comment);