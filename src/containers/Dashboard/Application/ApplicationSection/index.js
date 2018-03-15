import "./ApplicationSection.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as avatarActions from "../../../../actions/avatarActions";

class ApplicationSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      applicationId: props.applicationId,
      section: props.section,
      application: props.application.application,
      profilePicture: props.avatar.url
    };
  }

  render() {
    return this._render(this.props.section);
  }

  _render = section => {
    switch (section) {

      case "information":
      default:
        return (
          <div className="application__section">
            {this.props.section}
          </div>
        )
    }
  }

  componentWillMount() {
    if (this.state.section === "information")
      this.props.avatarActions.doAvatarGet(this.state.applicationId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.section)
      this.setState({ section: nextProps.section });

    if (nextProps.application.hasGotten)
      this.setState({ application: nextProps.application.application });
    
    if (nextProps.avatar.hasGotten)
      this.setState({ profilePicture: nextProps.avatar.url });
  }
}

ApplicationSection.propTypes = {
  applicationId: propTypes.string,
  section: propTypes.string,
  application: propTypes.object,
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
)(ApplicationSection);