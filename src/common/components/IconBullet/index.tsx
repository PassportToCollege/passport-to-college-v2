import './IconBullet.css';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPencilAlt,
  faGlobe,
  faUniversity,
  faSchool,
  faBriefcase,
  faUserGraduate
} from '@fortawesome/fontawesome-free-solid';

interface IconBulletProps {
  styles?: React.CSSProperties;
  icon: string;
  heading?: string;
  children?: React.ReactChildren | JSX.Element;
}

class IconBullet extends React.PureComponent<IconBulletProps> {
  public render() {
    const { styles, icon, heading, children } = this.props;
    const icons = {
      pen: faPencilAlt,
      globe: faGlobe,
      university: faUniversity,
      school: faSchool,
      briefcase: faBriefcase,
      graduate: faUserGraduate
    };

    return (
      <div className="icon_bullet" style={styles}>
        <i><FontAwesomeIcon icon={icons[icon]} /></i>
        <h5>{heading}</h5>
        {children}
      </div>
    );
  }
}

export default IconBullet;