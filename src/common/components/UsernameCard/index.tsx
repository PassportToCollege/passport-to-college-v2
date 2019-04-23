import React from "react";
import propTypes from "prop-types";
import { Link } from "react-router-dom";

import InitialsAvatar from "../InitialsAvatar";

const UsernameCard = ({ user, styles }) => {
  const cardStyles = Object.assign({}, {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center"
  }, styles);

  return (
    <span className="username_card" style={cardStyles}>
      {
        user.profilePicture || user.photo ?
          <img src={user.profilePicture || user.photo}
            alt="user profile pic" 
            style={{
              marginRight: "1em"
            }}/> :
          <InitialsAvatar
            initials={`${user.name.first[0]}${user.name.last[0]}`}
            styles={{
              width: "32px",
              height: "32px",
              fontSize: "1.25em",
              backgroundColor: "#FF6561",
              marginRight: "0.75em"
            }} />
      }
      <span className="username_card__name">
        <Link to={`/admin/dashboard/users/view/${user.uid}`}
          style={{
          fontWeight: "bold",
          color: "#FF6561"
        }}>
          {user.name.full}
        </Link>
      </span>
    </span>
  )
}

UsernameCard.propTypes = {
  user: propTypes.object,
  styles: propTypes.object
};

export default UsernameCard;