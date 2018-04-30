import "./Story.css";

import React, { Component} from "react";
import { connect} from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as postActions from "../../actions/postActions";
import * as postsActions from "../../actions/postsActions";

import Loader from "../../components/Loader";
import WYSIWYGEditor from "../../components/Editor";
import PostCardGrid from "../../components/PostCardGrid";

class Story extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: props.post.post,
      hero: props.post.hero,
      id: props.match.params.post_id,
      more: props.posts.moreByCategory
    }
  }

  componentDidMount() {
    this.props.updateLocation("stories");

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

    if (!this.state.more && !this.props.posts.gettingMostRecentByCategory
    && this.props.post.hasGotten) {
      snapshot = snapshot || {};
      snapshot.getMore = true;
    }

    if (document.scrollingElement.scrollTop > 0) {
      snapshot = snapshot || {};
      snapshot.toTop = true;
    }

    return snapshot;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot && snapshot.postChanged) {
      this.props.postActions.doPostGet(this.state.id);
      this.props.postActions.doHeroGet(this.state.id);
    }

    if (snapshot && snapshot.getMore) {
      this.props.postsActions.doPostsGetMostRecentByCategory(this.state.post.category, {
        exclude: this.state.id
      });
    }

    if (snapshot && snapshot.toTop) {
      document.scrollingElement.scrollTo(0, 0);
    }
  }
  
  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = null;

    if (nextProps.post.hasGotten) {
      newState = {};
      newState.post = nextProps.post.post;
    }

    if (nextProps.post.gotHero) {
      newState = newState || {};
      newState.hero = nextProps.post.hero;
    }
    
    if (nextProps.posts.gotMostRecentByCategory) {
      newState = newState || {};
      newState.more = nextProps.posts.moreByCategory;
    }

    if (nextProps.match.params && nextProps.match.params.post_id 
      && (nextProps.match.params.post_id !== prevState.id)) {
      newState = newState || {};  
      newState.id = nextProps.match.params.post_id;
    }

    return newState;
  }

  render() {
    return (
      <main className="story">
        {
          this.props.post.hasGotten && this.state.post ?
            <section className="story__content">
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
                  fontSize: "1.15em",
                  maxWidth: "100%",
                  padding: "2em 3em"
                }} />
            </section> :
            <Loader />
        }
        <section className="story__more">
          <h2>more stories like this</h2>
          {
            this.state.more ?
            <PostCardGrid posts={this.state.more} /> : null
          }
        </section>
      </main>
    )
  }
}

Story.propTypes = {
  post: propTypes.object,
  postActions: propTypes.object,
  posts: propTypes.object,
  postsActions: propTypes.object,
  match: propTypes.object,
  updateLocation: propTypes.func
};

const mapStateToProps = state => {
  return {
    post: state.post,
    posts: state.posts
  };
};

const mapDispatchToProps = dispatch => {
  return {
    postActions: bindActionCreators(postActions, dispatch),
    postsActions: bindActionCreators(postsActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Story);