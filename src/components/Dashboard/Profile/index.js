import "./Profile.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Cookies from "universal-cookie";

import * as avatarActions from "../../../actions/avatarActions";

const cookies = new Cookies();
const defAvatar = require("../../../assets/images/default-gravatar.png");

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gravatar: "",
      user: cookies.get("ssid")
    };
  }
  render() {
    return (
      <div className="profile__container">
        <div className="profile__header">
          <div className="dashboard__container profile__header_body">
            <div className="profile__avatar" style={{ backgroundImage: 'url(' + this.state.gravatar + ')' }}>
              <form action="/profile_image" method="post" encType="multipart/form-data">
                <input type="file" name="avatar" accept="image/*" 
                  ref={input => this.avatartInput = input}
                  onChange={this.handleAvatarChange}/>
              </form>
              <button className="button__avatar_upload" type="button" onClick={ () => this.avatartInput.click() }>
                Click here to select file.
              </button>
            </div>
            <div className="profile__header_info">
              <span className="profile__edit_button">edit</span>
              <h1 className="profile__name">{Object.values(this.state.user.name).join(" ")}</h1>
              <p>{this.state.user.email}</p>
            </div>
          </div>
        </div>
        <div className="dashboard__container profile__body">
          <div className="profile__50">
            <div className="profile__edit_header">
              <h2>About</h2>
              <span className="profile__edit_button">edit</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  componentWillMount() {
    this.props.updateLocation("dashboard profile");

    // get user avatar
    this.props.avatarActions.doAvatarGet();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.avatar.url && nextProps.avatar.url !== "")
      this.setState({ gravatar: nextProps.avatar.url });
    
    if(nextProps.avatar.url === "")
      this.setState({ gravatar: defAvatar });
  }

  handleAvatarChange = (e) => {
    console.log(e.target.files[0])
  }
}

Profile.propTypes = {
  avatarActions: propTypes.object,
  avatar: propTypes.object
};

const mapStateToProps = state => {
  return {
    avatar: state.avatar
  };
};

const mapDispatchToProps = dispatch => {
  return {
    avatarActions: bindActionCreators(avatarActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);