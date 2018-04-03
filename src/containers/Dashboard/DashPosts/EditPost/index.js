import "./EditPost.css";

import React, { Component} from "react";
import { connect} from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";

import * as postActions from "../../../../actions/postActions";

import Loader from "../../../../components/Loader";
import Notification from "../../../../components/Notification";
import WYSIWYGEditor from "../../../../components/Editor";
import DropUploader from "../../../../components/DropUploader";

class EditPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.post_id,
      post: props.post.post,
      hero: props.post.hero,
      postChanges: {},
      hasNotification: false,
      hasError: false,
      notificationClosed: true
    };
  }

  componentWillMount() {
    this.props.togglePostNav(false);

    const { post_id } = this.props.match.params;
    this.props.postActions.doPostGet(post_id);
    this.props.postActions.doHeroGet(post_id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.post.hasGotten)
      this.setState({ post: nextProps.post.post });

    if (nextProps.post.postGetFailed ||
      nextProps.post.postUpdateFailed) {
      this.setState({
        hasError: true,
        notification: nextProps.post.error.message,
        notificationClosed: false
      });
    }

    if (nextProps.post.postUpdated) {
      this.setState({
        hasNotification: true,
        notification: "Post updated successfully",
        notificationClosed: false
      });
    }

    if (nextProps.post.gotHero)
      this.setState({ hero: nextProps.post.hero });
  }

  render() {
    return (
      <div className="edit_post">
        <nav className="edit_post__nav">
          <h4>options</h4>
          <ul className="edit_post__nav_list">
            <li className="edit_post__save"
              onClick={this.updatePost}>save</li>
            <li className="edit_post__publish">publish</li>
            <li className="edit_post__unpublish">unpublish</li>
            <li className="edit_post__archive">archive</li>
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
              <DropUploader label={<span><b>Choose a hero image</b> or drag it here</span>}
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
                  color: "#333",
                  borderColor: "#333"
                }}/> : <Loader />
            }
            {
              this.props.post.heroGetFailed ?
                <DropUploader label={<span><b>Choose a hero image</b> or drag it here</span>}
                  handleAvatarChange={this.handleHeroImageChange} /> :
                null
            }
          </div>
          <div className="edit_post__editor">
            <WYSIWYGEditor saveButton editorStyles={{
              maxWidth: "100%"
            }}
            controlStyles={{
              maxWidth: "100%"
            }}/>
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

  updatePost = () => {
    this.props.postActions.doPostUpdate(this.state.id, this.state.postChanges, {
      refresh: true
    });
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
}

EditPost.propTypes = {
  post: propTypes.object,
  postActions: propTypes.object,
  match: propTypes.object,
  togglePostNav: propTypes.func
};

const mapStateToProps = state => {
  return {
    post: state.post
  };
};

const mapDispatchToProps = dispatch => {
  return {
    postActions: bindActionCreators(postActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditPost);