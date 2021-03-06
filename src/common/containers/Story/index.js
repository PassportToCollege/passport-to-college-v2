import "./Story.css";

import React, { Component} from "react";
import { connect} from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import propTypes from "prop-types";
import _ from "lodash";

import * as postActions from "../../actions/postActions";
import * as postsActions from "../../actions/postsActions";
import * as commentActions from "../../actions/commentActions";

import PageMeta from "../../components/PageMeta";
import LoadingPost from "../../components/LoadingPost";
import WYSIWYGEditor from "../../components/Editor";
import PostCardGrid from "../../components/PostCardGrid";
import BorderTopContainer from "../../components/BorderTopContainer";
import LikeButton from "../LikeButton";
import SocialShare from "../../components/SocialShare";
import Responder from "../Responder";
import CommentSection from "../CommentSection";

const showComments = false;

class Story extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: props.post.post,
      hero: props.post.hero,
      id: props.match.params.post_id,
      more: props.posts.moreByCategory || [],
      newResponse: "",
      allConversations: false
    }
  }

  static propTypes = {
    post: propTypes.object,
    postActions: propTypes.object,
    posts: propTypes.object,
    postsActions: propTypes.object,
    comments: propTypes.object,
    commentActions: propTypes.object,
    match: propTypes.object,
    updateLocation: propTypes.func
  };

  componentDidMount() {
    this.props.updateLocation("stories on-white");

    const { id } = this.state;
    this.props.postActions.doPostGet(id);
    this.props.postActions.doHeroGet(id);
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    let snapshot = null;

    if (this.state.id !== prevState.id) {
      snapshot = {};
      snapshot.postChanged = true;
    }

    if (!this.state.more.length && !this.props.posts.gettingMostRecentByCategory
    && this.props.post.hasGotten) {
      snapshot = snapshot || {};
      snapshot.getMore = true;
    }

    if (document.scrollingElement.scrollTop > 0) {
      snapshot = snapshot || {};

      if (snapshot.postChanged)
        snapshot.toTop = true;
    }

    return snapshot;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot && snapshot.postChanged) {
      this.props.postActions.doPostGet(this.state.id);
      this.props.postActions.doHeroGet(this.state.id);
      this.props.postsActions.doPostsGetMostRecentByCategory(this.state.post.category, {
        exclude: this.state.id
      });
    }

    if (snapshot && snapshot.getMore) {
      this.props.postsActions.doPostsGetMostRecentByCategory(this.props.post.post.category, {
        exclude: this.state.id
      });
    }

    if (snapshot && snapshot.toTop) {
      if ("function" === typeof document.scrollingElement.scrollTo) {
        document.scrollingElement.scrollTo(0, 0);
      } else {
        document.scrollingElement.scrollTop = 0;
      }
    }
  }
  
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.post.hasGotten && !_.isEqual(prevState.post, nextProps.post.post)) {
      return {
        post: nextProps.post.post
      };
    }

    if (nextProps.post.updatedLocalConversationsCount && 
      !_.isEqual(prevState.post, nextProps.post.post)) {
      return {
        post: nextProps.post.post
      };
    }

    if (nextProps.post.gotHero && (prevState.hero !== nextProps.post.hero)) {
      return {
        hero: nextProps.post.hero
      };
    }
    
    if (nextProps.posts.gotMostRecentByCategory && 
      !_.isEqual(prevState.more, nextProps.posts.moreByCategory)) {
      return {
        more: nextProps.posts.moreByCategory
      };
    }

    if (nextProps.match.params && nextProps.match.params.post_id 
      && (nextProps.match.params.post_id !== prevState.id)) {
      return {
        id: nextProps.match.params.post_id
      };
    }

    return null;
  }

  render() {
    return (
      <main className="story">
        {
          this.props.post.hasGotten && this.state.post ?
            <section className="story__content">
              <PageMeta>
                <title>{this.state.post.title} | Stories | Passport to College</title>
                <meta property="og:url" content={`${process.env.RAZZLE_URL}/${this.props.match.url}`} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`${this.state.post.title} | Stories | Passport to College`} />
                <meta property="og:description" content={this.state.post.excerpt} />
                <meta property="og:image" content={this.state.hero} />
              </PageMeta>
              <h1 className="story__title">{this.state.post.title}</h1>
              <span className="story__author">by {this.state.post.author.name.full}</span>
              {
                this.state.hero ?
                  <img className="story__hero"
                    src={this.state.hero} alt="story hero" /> : null
              }
              <WYSIWYGEditor readonly
                content={this.state.post.full}
                editorStyles={{
                  border: "none",
                  margin: "0 auto",
                  lineHeight: "1.5em",
                  fontSize: "1.5em",
                  maxWidth: "100%",
                  padding: "2em 3em"
                }} />
              {
                this.state.post.category ?
                  <BorderTopContainer classes="story__category">
                    {
                      Object.keys(this.state.post.category).map(category => {
                        if (this.state.post.category[category]) {
                          return (
                            <Link key={category}
                              to={`/stories/cat/${category}`}>
                              {category.split("-").join(" ")}
                            </Link>
                          )
                        }

                        return null
                      })
                    }
                  </BorderTopContainer> : null
              }
              <BorderTopContainer classes="story__appreciate">
                <LikeButton post={this.state.post} postId={this.state.id} />
                <SocialShare 
                  mail={{
                    post: this.state.post
                  }}
                  facebook={{
                    href: `${process.env.RAZZLE_URL}/${this.props.match.url}`
                  }}
                  twitter={{
                    href: `${process.env.RAZZLE_URL}/${this.props.match.url}`,
                    title: `${this.state.post.title} - Passport to College`
                  }} />
              </BorderTopContainer>
            </section> :
            <LoadingPost />
        }
        <BorderTopContainer classes="story__more">
          {
            this.props.posts.gotMostRecentByCategory && this.state.more.length ?
            <PostCardGrid posts={this.state.more} /> : null
          }
        </BorderTopContainer>
        {
          showComments ? 
          <section className="story__responses">
            <h4> 
              Conversations 
              {
                this.props.post.hasGotten && this.state.post && this.state.post.conversations ? 
                  ` (${this.props.post.post.conversations})` : ""
              } 
            </h4>
            {
              this.props.post.hasGotten && this.state.post ?
                <Responder  postId={this.state.id}
                  post={this.state.post} 
                  onResponse={this.handleResponse} /> : null
            }
            {
              this.props.post.hasGotten && this.state.post ?
                <CommentSection post={this.state.post} 
                  newComment={this.state.newResponse} 
                  all={this.state.allConversations} /> :
                null
            }
            {
              this.props.post.hasGotten && this.state.post && this.props.comments.gotComments &&
              this.props.comments.comments.length < this.state.post.conversations ?
                <span className="story__response_view_all"
                  onClick={() => this.setState({ allConversations: true })}>
                  view all conversations
                </span> : null
            }
          </section> :
          null
        }
      </main>
    )
  }

  handleResponse = (commentId, isReply) => {
    if (!isReply) {
      this.setState({ 
        newResponse: commentId,
        post: Object.assign({}, this.state.post, {
          conversations: this.state.post.conversations + 1
        }) 
      });
    }
  }
}

const mapStateToProps = state => {
  return {
    post: state.post,
    posts: state.posts,
    comments: state.comments
  };
};

const mapDispatchToProps = dispatch => {
  return {
    postActions: bindActionCreators(postActions, dispatch),
    postsActions: bindActionCreators(postsActions, dispatch),
    commentActions: bindActionCreators(commentActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Story);