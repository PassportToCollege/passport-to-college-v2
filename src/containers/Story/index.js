import "./Story.css";

import React, { Component} from "react";
import { connect} from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as postActions from "../../actions/postActions";

class Story extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: props.post
    }
  }

  componentWillMount() {
    const { post_id } = this.props.match.params;
    this.props.postActions.doPostGet(post_id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.post.hasGotten)
      this.setState({ post: nextProps.post.post });
  }

  render() {
    return (
      <main className="story">
      
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