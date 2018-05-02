import "./LikeButton.css";

import React, { Component} from "react";
import { connect} from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";

import * as authActions from "../../actions/authActions";
import * as postActions from "../../actions/postActions";

import IconButton from "../../components/IconButton";
import { SignUpModal } from "../../components/Modal";

class LikeButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: props.post,
      signingUp: false,
      authorized: props.auth
    }
  }

  static propTypes = {
    auth: propTypes.oneOfType([propTypes.object, propTypes.bool]),
    authActions: propTypes.object,
    post: propTypes.object
  }

  render() {
    return (
      <React.Fragment>
        {
          this.state.signingUp ?
            <SignUpModal heading="Create an account to like this story."
              doClose={() => this.setState({ signingUp: false })} />
            : null
        }
        <div className="like_button">
          <IconButton icon="like" solid 
            styles={{
              backgroundColor: "#7DE2E7"
            }} 
            doClick={this.handleLike} />
        </div>
      </React.Fragment>
    )
  }

  handleLike = () => {
    if (!this.state.authorized)
      return this.setState({ signingUp: true });
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    postActions: bindActionCreators(postActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LikeButton);