import "./Stories.css";

import React, { Component} from "react";
import { connect} from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";

import * as postCategoryActions from "../../actions/postCategoryActions";
import * as postsActions from "../../actions/postsActions";

import LinkDropdown from "../../components/LinkDropdown";
import StoryCard from "../../components/StoryCard";
import Loader from "../../components/Loader";

class Stories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      posts: [],
      categories: props.postCategories.categories
    }
  }

  componentWillMount() {
    this.props.updateLocation("stories");
    this.props.postsActions.doPostsPaginate(1);
    this.props.postCategoryActions.doCategoriesGet();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.posts.paginationDone)
      this.setState({ posts: this.state.posts.concat(nextProps.posts.posts) });
    
    if (nextProps.postCategories.gotCategories)
      this.setState({ categories: nextProps.postCategories.categories });
  }

  render() {
    return (
      <main className="stories">
        <section className="stories__header">
          {
            this.props.postCategories.gotCategories && this.state.categories ?
              <LinkDropdown name="Categories" data={this.createLinkDropdownData()} /> :
              null
          }
        </section>
        <section className="stories__stories">
          {
            this.state.posts.length ?
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
      to: this.props.match.url,
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
}

Stories.propTypes = {
  updateLocation: propTypes.func,
  postCategories: propTypes.object,
  postCategoryActions: propTypes.object,
  posts: propTypes.object,
  postsActions: propTypes.object,
  match: propTypes.object
};

const mapStateToProps = state => {
  return {
    posts: state.posts,
    postCategories: state.postCategories
  };
};

const mapDispatchToProps = dispatch => {
  return {
    postsActions: bindActionCreators(postsActions, dispatch),
    postCategoryActions: bindActionCreators(postCategoryActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stories);