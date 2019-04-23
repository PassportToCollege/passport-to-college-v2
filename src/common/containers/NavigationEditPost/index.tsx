import "./NavigationEditPost.css";

import React, { Component } from "react";
import { Link } from "react-router-dom";
import propTypes from "prop-types";

import Toggler from "../../components/Toggler";

class NavigationEditPost extends Component {
  render() {
    return (
      <nav className="edit_post__nav">
        <p>options</p>
        <ul className="edit_post__nav_list">
          <li className="edit_post__save"
            onClick={this.savePost}>save</li>
          {
            this.props.post && this.props.post.state.draft ?
              <li className="edit_post__publish"
                onClick={this.publishPost}>publish</li> :
              null
          }
          {
            this.props.post && this.props.post.state.published ?
              <li className="edit_post__unpublish"
                onClick={this.unpublishPost}>unpublish</li> :
              null
          }
          {
            this.props.post && this.props.post.state.archived ?
              <li className="edit_post__unarchive"
                onClick={this.unarchivePost}>unarchive</li> :
              null
          }
          {
            this.props.post && !this.props.post.state.archived ?
              <li className="edit_post__archive"
                onClick={this.archivePost}>archive</li> :
              null
          }
          <li className="edit_post__delete"
            onClick={this.deletePost}>delete</li>
        </ul>
        <p>category</p>
        <ul className="edit_post__nav_list categories_list">
          <li className="edit_post__add_category"
            onClick={this.props.addingCategory}>add category</li>
          {
            this.props.categories && this.props.post ?
              this.props.categories.map(category => {
                return (
                  <li key={category.slug}
                    className="edit_post__category">
                    <span>{category.name}</span>
                    <Toggler
                      state={this.props.post && this.props.post.category && this.props.post.category[category.slug] ? "yes" : "no"}
                      doClick={this.changeCategory}
                      options={{
                        clickArg: category.slug
                      }} />
                  </li>
                )
              }) : null
          }
        </ul>
        <p>settings</p>
        <ul className="edit_post__nav_list settings_list">
          <li className="edit_post__comments">
            <Link to={`/admin/dashboard/post/${this.props.post ? this.props.post.id : ""}/comments`}>
              comments
            </Link>
          </li>
        </ul>
      </nav>
    )
  }

  savePost = () => this.props.updatePost("save")
  publishPost = () => this.props.updatePost("publish")
  unpublishPost = () => this.props.updatePost("unpublish")
  archivePost = () => this.props.updatePost("archive")
  unarchivePost = () => this.props.updatePost("unarchive")

  changeCategory = (category, state) => {
    this.props.togglePostCategory(category, state);
  }
}

NavigationEditPost.propTypes = {
  post: propTypes.object,
  categories: propTypes.array,
  addingCategory: propTypes.func,
  togglePostCategory: propTypes.func,
  updatePost: propTypes.func
}

export default NavigationEditPost;