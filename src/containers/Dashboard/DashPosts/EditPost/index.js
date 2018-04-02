import "./EditPost.css";

import React, { Component} from "react";
import { connect} from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";

import * as postActions from "../../../../actions/postActions";

class EditPost extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentWillMount() {
    this.props.togglePostNav(false);
    
    const { post_id } = this.props.match.params;
    this.props.postAction.doPostGet(post_id);
  }

  render() {
    return (
      <div className="edit_post">

      </div>
    )
  }
}

EditPost.propTypes = {
  post: propTypes.object,
  postAction: propTypes.object,
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
    postAction: bindActionCreators(postActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditPost);