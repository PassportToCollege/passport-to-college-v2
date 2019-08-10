import './RoleCard.css';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { getProfilePicture } from '../../utils/firebase/functions';
import User from '../../models/User';

interface RoleCardProps {
  staff: User;
  founder?: boolean;
}

interface RoleCardState {
  staff: User;
  isStudent: boolean;
  picture?: string;
}

export default class RoleCard extends Component<RoleCardProps, RoleCardState> {
  constructor(props: RoleCardProps) {
    super(props);

    this.state = {
      staff: props.staff,
      isStudent: props.staff.isStudent
    };
  }

  private renderRoleCard = () => {
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

  private renderStudentStaff = () => {
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
          <h5>{this.state.staff.name.full()}</h5>
          <p>{this.state.staff.role}</p>
        </Link>
      </React.Fragment>
    );
  }

  public componentDidMount() {
    if (!this.state.picture) {  
      getProfilePicture(this.state.staff.uid)
        .then((url: string) => {
          this.setState({
            picture: url
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  public render() {
    return (
      <div className={this.props.founder ? 'role_card founder_card' : 'role_card'}>
        {
          this.state.isStudent ?
            this.renderStudentStaff() :
            this.renderRoleCard()
        }
      </div>
    );
  }
}