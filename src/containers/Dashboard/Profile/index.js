import "./Profile.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Cookies from "universal-cookie";

import * as avatarActions from "../../../actions/avatarActions";
import * as userActions from "../../../actions/userActions";

import UserInfoItem from "../../../components/UserInfoItem";
import LoadingText from "../../../components/LoadingText";

const cookies = new Cookies();
const defAvatar = require("../../../assets/images/default-gravatar.png");

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gravatar: "",
      user: this.props.user,
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
            {this.createRolesList()}
          </div>
        </div>
      </div>
    )
  }

  componentWillMount() {
    let activeUser = cookies.get("ssid");
  
    this.props.updateLocation("dashboard profile");

    // get user avatar
    this.props.avatarActions.doAvatarGet(activeUser);

    // get user data
    this.props.userActions.doUserGet(activeUser);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.avatar.url && nextProps.avatar.url !== "")
      this.setState({ gravatar: nextProps.avatar.url });
    
    if(nextProps.avatar.url === "")
      this.setState({ gravatar: defAvatar });
    
    if(Object.keys(nextProps.user).length && !nextProps.user.isGetting)
      this.setState({ user: nextProps.user.user });
  }

  createAboutDataList() {
    if (Object.keys(this.props.user).length && this.props.user.isGetting) {
      return (
        <LoadingText options={{
          class: "profile__about_loading",
          bg: "transparent",
          height: "10px",
          lines: [
            { color: "rgba(51,51,51,0.4)", width: "50%" },
            { color: "rgba(51,51,51,0.2)", width: "80%" },
            { color: "rgba(51,51,51,0.4)", width: "50%" },
            { color: "rgba(51,51,51,0.2)", width: "80%" },
            { color: "rgba(51,51,51,0.4)", width: "50%" },
            { color: "rgba(51,51,51,0.2)", width: "80%" },
            { color: "rgba(51,51,51,0.4)", width: "50%" },
            { color: "rgba(51,51,51,0.2)", width: "80%" }
          ]
        }} />
      )
    } else if (Object.keys(this.props.user).length && !this.props.user.isGetting) {
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
  }

  createHeaderInfo = () => {
    if(Object.keys(this.props.user).length && this.props.user.isGetting) {
      return (
        <LoadingText options={{
          class: "profile__header_loading",
          bg: "transparent",
          height: "10px",
          lines: [
            { color: "#FF443F", width: "100%" },
            { color: "#FF443F", width: "50%" }
          ]
        }} />
      )
    } else if (Object.keys(this.props.user).length && !this.props.user.isGetting) {
      let user = this.state.user;

      if(this.state.editingHeaderInfo) {
        return (
          <span>
            <span className="profile__done_edit_button">done</span>
            <span className="profile__cancel_edit_button" onClick={() => this.setState({ editingHeaderInfo: false })}>cancel</span>
            <form>
              <div className="form__input_container profile__input">
                <label>name</label>
                <input type="text" name="name" defaultValue={user.name.full} />
              </div>
              <div className="form__input_container profile__input">
                <label>email</label>
                <input type="text" name="email" defaultValue={user.email} />
              </div>
            </form>
          </span>
        );
      }

      return (
        <span>
          <span className="profile__edit_button" onClick={() => this.setState({ editingHeaderInfo: true })}>edit</span>
          <h1 className="profile__name">{user.name.full}</h1>
          <p>{user.email}</p>
        </span>
      );
    }
  }

  createRolesList = () => {
    if (Object.keys(this.props.user).length && this.props.user.isGetting) {
      return (
        <LoadingText options={{
          class: "profile__about_loading",
          bg: "transparent",
          height: "10px",
          lines: [
            { color: "rgba(51,51,51,0.4)", width: "50%" },
            { color: "rgba(51,51,51,0.2)", width: "80%" },
            { color: "rgba(51,51,51,0.4)", width: "50%" },
            { color: "rgba(51,51,51,0.2)", width: "80%" }
          ]
        }} />
      )
    } else if (Object.keys(this.props.user).length && !this.props.user.isGetting) {
      return (
        <span>
          <UserInfoItem label="staff?"
            data={
              this.props.user.isStaff ?
                this.props.user.role :
                "you do not have a staff role"} />
          <UserInfoItem label="student?"
            data={
              this.props.user.isStudent ?
                "you are a student" :
                "you are not a student"} />
        </span>
      )
    }
  }

  handleAvatarChange = (e) => {
    let newGravatar = e.target.files[0];

    this.props.avatarActions.doAvatarUpload(newGravatar);
  }
}

Profile.propTypes = {
  avatarActions: propTypes.object,
  avatar: propTypes.object,
  user: propTypes.object,
  userActions: propTypes.object
};

const mapStateToProps = state => {
  return {
    avatar: state.avatar,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    avatarActions: bindActionCreators(avatarActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);