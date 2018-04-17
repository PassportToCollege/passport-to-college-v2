import "./Story.css";

import React, { Component} from "react";
import { connect} from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as postActions from "../../actions/postActions";

import Loader from "../../components/Loader";
import WYSIWYGEditor from "../../components/Editor";

class Story extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: props.post.post,
      hero: props.post.hero,
      id: props.match.params.post_id
    }
  }

  componentWillMount() {
    const { id } = this.state;
    this.props.postActions.doPostGet(id);
    this.props.postActions.doHeroGet(id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.post.hasGotten)
      this.setState({ post: nextProps.post.post });

    if (nextProps.post.gotHero)
      this.setState({ hero: nextProps.post.hero });
    
    if (nextProps.match.params && nextProps.match.params.post_id 
      && (nextProps.match.params.post_id !== this.state.id)) {
      if (!this.props.post.isGetting)
        this.props.postActions.doPostGet(nextProps.match.params.post_id);
      
      if (!this.props.post.gettingHero)
        this.props.postActions.doHeroGet(nextProps.match.params.post_id);

      this.setState({ id: nextProps.match.params.post_id });
    }
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
      </main>
    )
  }
}

Story.propTypes = {
  post: propTypes.object,
  postActions: propTypes.object,
  match: propTypes.object
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
)(Story);