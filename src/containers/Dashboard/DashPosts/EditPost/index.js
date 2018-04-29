import "./EditPost.css";

import React, { Component} from "react";
import { connect} from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";
import moment from "moment";

import * as postActions from "../../../../actions/postActions";
import * as postCategoryActions from "../../../../actions/postCategoryActions";

import Notification from "../../../../components/Notification";
import WYSIWYGEditor from "../../../../components/Editor";
import DropUploader from "../../../../components/DropUploader";
import { AddPostCategory } from "../../../../components/Modal";
import Toggler from "../../../../components/Toggler";

class EditPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.post_id,
      post: props.post.post,
      hero: props.post.hero,
      categories: props.postCategories.categories,
      postChanges: {},
      categoriesChanges: {},
      hasNotification: false,
      hasError: false,
      notificationClosed: true,
      addingCategory: false
    };
  }

  componentDidMount() {
    this.props.togglePostNav(false);

    const { post_id } = this.props.match.params;
    this.props.postActions.doPostGet(post_id);
    this.props.postActions.doHeroGet(post_id);

    this.props.postCategoryActions.doCategoriesGet();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = null;

    if (nextProps.post.hasGotten) {
      newState = { 
        post: nextProps.post.post, 
        postChanges: Object.assign({}, prevState.postChanges, { 
          excerpt: nextProps.post.post.excerpt 
        }) 
      };
    }

    if (nextProps.post.postGetFailed ||
      nextProps.post.postUpdateFailed) {
      newState = {
        hasError: true,
        notification: nextProps.post.error.message,
        notificationClosed: false
      };
    }

    if (nextProps.post.hasUpdated) {
      newState = newState || {};
      newState = Object.assign({}, newState, {
        hasNotification: true,
        notification: "Post updated successfully",
        notificationClosed: false
      });
    }

    if (nextProps.post.gotHero) {
      newState = newState || Object.assign({}, newState, { 
        hero: nextProps.post.hero 
      });
    }
    
    if (nextProps.postCategories.gotCategories) {
      let categoriesObj = {};
      nextProps.postCategories.categories.map(category => {
        categoriesObj[category.slug] = category;
        return category;
      })

      newState = newState || {};
      newState = Object.assign({}, newState, { 
        categories: nextProps.postCategories.categories,
        categoriesChanges: categoriesObj
      });
    }
    
    if (nextProps.postCategories.hasAdded) {
      newState = newState || {};
      newState = Object.assign({}, newState, {
        addingCategory: false,
        hasNotification: true,
        notificationClosed: false,
        notification: "Category added successfully"
      });
    }

    return newState;
  }

  render() {
    return (
      <div className="edit_post" data-no-flow={this.state.addingCategory ? "active" : "inactive"}>
        {
          this.state.addingCategory ?
            <AddPostCategory doClose={() => this.setState({ addingCategory: false })}
              doSubmit={this.handleCategoryAdd} /> :
            null
        }
        <nav className="edit_post__nav">
          <h4>options</h4>
          <ul className="edit_post__nav_list">
            <li className="edit_post__save"
              onClick={this.updatePost}>save</li>
            {
              this.props.post.hasGotten && this.state.post 
              && this.state.post.state.draft ?
                <li className="edit_post__publish"
                  onClick={this.publishPost}>publish</li> :
                null
            }
            {
              this.props.post.hasGotten && this.state.post
                && this.state.post.state.published ?
                <li className="edit_post__unpublish"
                  onClick={this.unpublishPost}>unpublish</li> :
                null
            }
            {
              this.props.post.hasGotten && this.state.post 
              && this.state.post.state.archived ?
              <li className="edit_post__unarchive"
                onClick={this.unpublishPost}>unarchive</li> :
              null
            }
            {
              this.props.post.hasGotten && this.state.post
              && !this.state.post.state.archived ?
                <li className="edit_post__archive"
                  onClick={this.archivePost}>archive</li> :
                null
            }
            <li className="edit_post__delete"
              onClick={this.deletePost}>delete</li>
          </ul>
          <h4>category</h4>
          <ul className="edit_post__nav_list categories_list">
            <li className="edit_post__add_category"
              onClick={() => this.setState({ addingCategory: true })}>add category</li>
            {
              this.props.postCategories.gotCategories && this.state.categories 
              && this.props.post.hasGotten && this.state.post ?
                this.state.categories.map(category => {
                  return (
                    <li key={category.slug} 
                      className="edit_post__category">
                      <span>{category.name}</span>
                      <Toggler 
                        state={this.state.post.category && this.state.post.category[category.slug] ? "yes" : "no"} 
                        doClick={this.togglePostCategory}
                        options={{
                          clickArg: category.slug
                        }} />
                    </li>
                  )
                }) : null
            }
          </ul>
        </nav>
        <main className="edit_post__edit">
          <h1 className="edit_post__post_title" contentEditable
            suppressContentEditableWarning={true}
            onInput={this.handleTitleChange}>
            {
              this.props.post.hasGotten && this.state.post ?
                this.state.post.title ? this.state.post.title : "Type Your Post Title Here" :
                null
            }
          </h1>
          <p className="edit_post__author">
            {
              this.props.post.hasGotten && this.state.post ?
                `by ${this.state.post.author.name.full}` : null
            }
          </p>
          <div className="edit_post__hero_container">
            {
              this.props.post.gotHero && this.state.hero ? 
              <DropUploader overlay
                label={<span><b>Choose a hero image</b> or drag it here</span>}
                uploaderStyles={{
                  backgroundColor: "white",
                  backgroundImage: `url(${this.state.hero})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  padding: "4em"
                }}
                handleAvatarChange={this.handleHeroImageChange} 
                dropAreaStyles={{
                  background: "none",
                  color: "#FFF",
                  borderColor: "#FFF"
                }}
                labelStyles={{
                  color: "#FFF"
                }}/> : null
            }
            {
              this.props.post.heroGetFailed ?
                <DropUploader label={<span><b>Choose a hero image</b> or drag it here</span>}
                  handleAvatarChange={this.handleHeroImageChange} /> :
                null
            }
          </div>
          <div className="edit_post__excerpt">
            <label>Post excerpt</label>
            <span>This will appear in the blog homepage and landing page of the website.</span>
            <textarea name="excerpt" rows="5"
              value={this.state.postChanges.excerpt}
              onChange={this.handleExcerptChange}></textarea>
          </div>
          <div className="edit_post__editor">
            <label>Full post</label>
            <span>This will appear in the blog exactly as it looks here.</span>
            {
              this.props.post.hasGotten && this.state.post ?
                this.state.post.full ?
                  <WYSIWYGEditor saveButton
                    content={this.state.post.full} 
                    editorStyles={{
                      maxWidth: "1170px"
                    }}
                    controlStyles={{
                      maxWidth: "1170px"
                    }} 
                    handleSave={this.handleFullPostSave}/> :
                  <WYSIWYGEditor saveButton
                    editorStyles={{
                      maxWidth: "1170px"
                    }}
                    controlStyles={{
                      maxWidth: "1170px"
                    }} 
                    handleSave={this.handleFullPostSave}/> :
                null

            }
          </div>
          {
            (this.state.hasError || this.state.hasNotification) && !this.state.notificationClosed ?
              <Notification doClose={() => this.setState({ 
                notificationClosed: true,
                hasError: false,
                hasNotification: false,
                notification: ""
               })}
               text={this.state.notification} /> : null
          }
        </main>
      </div>
    )
  }

  handleTitleChange = e => {
    this.setState({ postChanges: Object.assign({}, this.state.postChanges, {
        title: e.target.innerText
      }) 
    });
  }

  handleExcerptChange = e => {
    this.setState({ postChanges: Object.assign({}, this.state.postChanges, {
        excerpt: e.target.value
      }) 
    });
  }

  handleFullPostSave = content => {
    this.setState({ 
      postChanges: Object.assign({}, this.state.postChanges, {
        full: content
      }),
      hasNotification: true,
      notification: "Saved to state. Save the post to save all changes",
      notificationClosed: false
    });
  }

  updatePost = () => {
    this.props.postActions.doPostUpdate(this.state.id, this.state.postChanges, {
      refresh: true
    });
  }

  publishPost = () => {
    this.props.postActions.doPostUpdate(this.state.id, {
      state: {
        published: true,
        archived: false,
        draft: false
      },
      publishedOn: new Date(moment.utc(moment()).toDate()).getTime()
    }, { refresh: true });
  }

  archivePost = () => {
    this.props.postActions.doPostUpdate(this.state.id, {
      state: {
        published: false,
        archived: true,
        draft: false
      },
      archivedOn: new Date(moment.utc(moment()).toDate()).getTime()
    }, { refresh: true });
  }

  unpublishPost = () => {
    this.props.postActions.doPostUpdate(this.state.id, {
      state: {
        published: false,
        archived: false,
        draft: true
      }
    }, { refresh: true });
  }

  handleHeroImageChange = e => {
    let newHero = e.files[0];
    let reader = new FileReader();

    reader.readAsDataURL(newHero);
    reader.onload = event => {
      let dataUrl = event.target.result;

      let image = new Image();
      image.src = dataUrl;
      image.onload = () => {
        const { width, height } = image;

        // ensure image is rectangular
        if (((width/height)*100) >= 133) {
          return this.props.postActions.doHeroUpload(newHero, this.state.id, {
            refresh: true
          });
        }

        this.setState({
          hasError: true,
          notificationClosed: false,
          notification: "Hero aspect ratio must be between 4:3 and 16:9"
        });
      };
    };
  }

  handleCategoryAdd = e => {
    this.props.postCategoryActions.doCategoryAdd(e.value, {
      refresh: true
    });
  }

  togglePostCategory = (category, state) => {
    let { postChanges, categoriesChanges } = this.state;
    let postUpdater = {};
    let categoriesUpdater = {};

    if (state === "no") {
      categoriesUpdater = {
        [category]: {
          posts: categoriesChanges[category].posts + 1
        }
      };
      postUpdater = Object.assign({}, postChanges, {
        category: {
          [category]: true
        }
      });
    } else {
      categoriesUpdater = {
        [category]: {
          posts: categoriesChanges[category].posts - 1
        }
      };
      postUpdater = Object.assign({}, postChanges, {
        category: {
          [category]: false
        }
      });
    }

    // update categories and post
    this.props.postCategoryActions.doCategoryUpdate(
      category,
      categoriesUpdater[category],
      { refresh: true } 
    );

    this.props.postActions.doPostUpdate(this.state.id, postUpdater, {
      refresh: true
    });
  }
}

EditPost.propTypes = {
  post: propTypes.object,
  postActions: propTypes.object,
  match: propTypes.object,
  togglePostNav: propTypes.func,
  postCategories: propTypes.object,
  postCategoryActions: propTypes.object
};

const mapStateToProps = state => {
  return {
    post: state.post,
    postCategories: state.postCategories
  };
};

const mapDispatchToProps = dispatch => {
  return {
    postActions: bindActionCreators(postActions, dispatch),
    postCategoryActions: bindActionCreators(postCategoryActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditPost);