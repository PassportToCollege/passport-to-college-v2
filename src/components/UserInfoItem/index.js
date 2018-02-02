import "./UserInfoItem.css";

import React from "react";
import propTypes from "prop-types";

const UserInfoItem = props => {
  const { label, data } = props;

  return (
    <div className="user_info_item">
      <h3>{label}</h3>
      <p>{data}</p>
    </div>
  )

}

UserInfoItem.propTypes = {
  label: propTypes.string,
  data: propTypes.oneOfType([
    propTypes.string,
    propTypes.number
  ])
};

export default UserInfoItem;