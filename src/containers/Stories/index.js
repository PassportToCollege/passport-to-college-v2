import "./Stories.css";

import React, { Component} from "react";
import { connect} from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";
import _ from "lodash";

import * as postCategoryActions from "../../actions/postCategoryActions";
import * as postsActions from "../../actions/postsActions";
import * as statsActions from "../../actions/statsActions";

import LinkDropdown from "../../components/LinkDropdown";
import StoryCard from "../../components/StoryCard";
import Loader from "../../components/Loader";

class Stories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      posts: [],
      categories: props.postCategories.categories,
      stats: props.stats.stats,
      category: props.match.params.category || "all",
      isStory: false
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { posts, categories, stats, page } = prevState;
    let newState = prevState;

    if (nextProps.posts.paginationDone && page > 1 &&
      !_.isEqual(posts, nextProps.posts.posts)) {
        newState.posts.concat(nextProps.posts.posts);
      } else {
        newState.posts = nextProps.posts.posts;
      }

    if (nextProps.postCategories.gotCategories &&
      !_.isEqual(categories, nextProps.postCategories.categories))
      newState.categories = nextProps.postCategories.categories;
    
    if (nextProps.stats.hasGotten &&
      !_.isEqual(stats, nextProps.stats.stats))
      newState.stats = nextProps.stats.stats;
    
    if (nextProps.match.params.category)
      newState.category = nextProps.match.params.category;
    
    if (_.isEqual(newState, prevState))
      return null;

    return newState;
  }

  componentDidMount() {
    window.addEventListener("scroll", this.fetchPostsOnScroll);

    this.props.updateLocation("stories");
    this.props.postsActions.doPostsPaginate(1, this.state.category);
    this.props.postCategoryActions.doCategoriesGet();
    this.props.statsActions.doStatsGet();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.fetchPostsOnScroll);
  }

  render() {
    return (
      <main className="stories" ref={main => this.storiesContainer = main}>
        <section className="stories__header">
          {
            this.props.postCategories.gotCategories && this.state.categories ?
              <LinkDropdown name="Categories" data={this.createLinkDropdownData()}  doClick={this.handleCategoryChange} /> :
              null
          }
        </section>
        <section className="stories__stories">
          {
            this.state.category !== "all" ?
              <h1 className="stories__category_heading">
                Stories from <i>&apos;{this.state.category}&apos;</i>
              </h1> : null
          }
          {
            this.state.posts ?
              this.state.posts.map(post => {
                return <StoryCard key={post.id} post={post} />
              }) : null
          }
          {
            this.props.posts.paginatingPosts ?
              <Loader /> : null
          }
        </section>
      </main>
    );
  }

  createLinkDropdownData = () => {
    let data = [{
      to: "/stories",
      label: "All"
    }];
    this.state.categories.map(category => {
      return data.push({
        to: `/stories/cat/${category.slug}`,
        label: category.name
      });
    });

    return data;
  };

  fetchPostsOnScroll = () => {
    if (this.storiesContainer) {
      const bounding = this.storiesContainer.getBoundingClientRect();
      const { bottom } = bounding;
      const wih = window.innerHeight;
  
      if (!this.props.posts.paginatingPosts) {
        if ((bottom < wih) && (this.state.page * 25 < this.state.stats.posts.published)) {
          this.props.postsActions.doPostsPaginate(this.state.page + 1, this.state.category);
          this.setState({ page: this.state.page + 1 });
        }
      }
    }

    return null;
  };

  handleCategoryChange = e => {
    const category = e.target.getAttribute("data-label").toLowerCase().split(" ").join("-");

    this.props.postsActions.doPostsPaginate(1, category);
  }
}

Stories.propTypes = {
  updateLocation: propTypes.func,
  postCategories: propTypes.object,
  postCategoryActions: propTypes.object,
  posts: propTypes.object,
  postsActions: propTypes.object,
  match: propTypes.object,
  stats: propTypes.object,
  statsActions: propTypes.object
};

const mapStateToProps = state => {
  return {
    posts: state.posts,
    postCategories: state.postCategories,
    stats: state.stats
  };
};

const mapDispatchToProps = dispatch => {
  return {
    postsActions: bindActionCreators(postsActions, dispatch),
    postCategoryActions: bindActionCreators(postCategoryActions, dispatch),
    statsActions: bindActionCreators(statsActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stories);