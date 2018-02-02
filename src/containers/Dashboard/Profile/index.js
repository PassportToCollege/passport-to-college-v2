import "./Profile.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Cookies from "universal-cookie";

import * as avatarActions from "../../../actions/avatarActions";

import UserInfoItem from "../../../components/UserInfoItem";

const cookies = new Cookies();
const defAvatar = require("../../../assets/images/default-gravatar.png");

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gravatar: "",
      user: cookies.get("ssid"),
      editingHeaderInfo: false,
      editingAbout: false,
      editingRoles: false
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
              {this.createHeaderInfo()}
            </div>
          </div>
        </div>
        <div className="dashboard__container profile__body">
          <div className="profile__50">
            <div className="profile__edit_header">
              <h2>About</h2>
              <span className="profile__edit_button">edit</span>
            </div>
            {this.createAboutDataList()}
          </div>
          <div className="profile__50">
            <div className="profile__edit_header">
              <h2>Roles</h2>
              <span className="profile__edit_button">edit</span>
            </div>
            <UserInfoItem label = "staff?"
            data = {
              this.state.user.isStaff ?
              this.state.user.role :
              "you do not have a staff role" }/>
            <UserInfoItem label = "student?"
            data = {
              this.state.user.isStudent ?
              "you are a student" :
              "you are not a student" }/>
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

  createAboutDataList() {
    let { gender, address, phone, dob } = this.state.user;
    let dt = [
     { label: "gender", data: gender },
     { label: "country", data: address.country },
     { label: "phone", data: phone },
     { label: "dob", data: dob }
    ]

    return dt.map((v, i) => {
      return <UserInfoItem key={v.label} label={v.label} data={v.data} />
    });
  }

  createHeaderInfo = () => {
    if(this.state.editingHeaderInfo) {
      return (
        <span>
          <span className="profile__done_edit_button">done</span>
          <span className="profile__cancel_edit_button" onClick={() => this.setState({ editingHeaderInfo: false })}>cancel</span>
          <form>
            <div className="form__input_container profile__input">
              <label>name</label>
              <input type="text" name="name" defaultValue={this.state.user.name.full} />
            </div>
            <div className="form__input_container profile__input">
              <label>email</label>
              <input type="text" name="email" defaultValue={this.state.user.email} />
            </div>
          </form>
        </span>
      );
    }
    
    return (
      <span>
        <span className="profile__edit_button" onClick={() => this.setState({ editingHeaderInfo: true })}>edit</span>
        <h1 className="profile__name">{this.state.user.name.full}</h1>
        <p>{this.state.user.email}</p>
      </span>
    );
  }

  handleAvatarChange = (e) => {
    let newGravatar = e.target.files[0];

    this.props.avatarActions.doAvatarUpload(newGravatar);
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