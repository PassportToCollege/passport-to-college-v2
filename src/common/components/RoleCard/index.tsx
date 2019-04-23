import "./RoleCard.css";

import React, { Component } from "react";
import { Link } from "react-router-dom";
import propTypes from "prop-types";

import { getProfilePicture } from "../../utils/firebase/functions";

class RoleCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      staff: props.staff,
      isStudent: !!props.staff.user
    };
  }

  static propTypes = {
    staff: propTypes.object,
    founder: propTypes.bool
  }

  static defaultProps = {
    founder: false
  }

  componentDidMount() {
    if (!this.state.picture) {
      const uid = this.state.isStudent ? this.state.staff.user.uid : this.state.staff.uid;
  
      getProfilePicture(uid)
        .then(url => {
          this.setState({
            picture: url
          });
        })
        .catch(error => {
          console.log(error);
        })
    }
  }

  render() {
    return (
      <div className={this.props.founder ? "role_card founder_card" : "role_card"}>
        {
          this.state.isStudent ?
            this.renderStudentStaff() :
            this.renderRoleCard()
        }
      </div>
    )
  }

  renderRoleCard = () => {
    return (
      <React.Fragment>
        <span className="role_card__image">
          {
            this.state.picture ?
              <img src={this.state.picture} alt="" /> :
              null
          }
        </span>
        <span className="role_card__info">
          <h5>{this.state.staff.name.full}</h5>
          <p>{this.state.staff.role}</p>
        </span>
      </React.Fragment>
    );
  }

  renderStudentStaff = () => {
    return (
      <React.Fragment>
        <span className="role_card__image">
          {
            this.state.picture ?
              <img src={this.state.picture} alt="" /> :
              null
          }
        </span>
        <Link to={`/scholars/view/scholar/${this.state.staff.uid}`} className="role_card__info">
          <h5>{this.state.staff.user.name.full}</h5>
          <p>{this.state.staff.user.role}</p>
        </Link>
      </React.Fragment>
    );
  }
}

export default RoleCard;