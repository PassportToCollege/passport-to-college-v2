import "./Stories.css";

import React, { Component} from "react";
import { connect} from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";

import * as postCategoryActions from "../../actions/postCategoryActions";
import * as postsActions from "../../actions/postsActions";

class Stories extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentWillMount() {
    this.props.updateLocation("stories");
  }

  render() {
    return (
      <main className="stories">
        
      </main>
    );
  }
}

Stories.propTypes = {
  updateLocation: propTypes.func,
  postCategories: propTypes.object,
  postCategoryActions: propTypes.object,
  posts: propTypes.object,
  postsActions: propTypes.object
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