import './UserInfoItem.css';

import React, { PureComponent } from 'react';

interface UserInfoItemProps {
  label: string;
  data: string | number;
}

export default class UserInfoItem extends PureComponent<UserInfoItemProps> {
  public render() {
    const { label, data } = this.props;
  
    return (
      <div className="user_info_item">
        <h3>{label}</h3>
        <p>{data}</p>
      </div>
    );
  }
}