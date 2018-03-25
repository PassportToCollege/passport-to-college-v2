import "./UserSection.css";

import React, { Component } from "react";
import propTypes from "prop-types";

import AnnotatedList from "../../../../components/AnnotatedList";
import LoadingText from "../../../../components/LoadingText";

class UserSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: props.userId,
      section: props.section,
      user: props.user.user
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.hasGottenUser) {
      this.setState({ user: nextProps.user.user });
    }
  }

  render() {
    return this._render(this.props.section);
  }

  _render = section => {
    switch (section) {
      case "personal":
        return (
          <section className="user__section personal__section">
            <div className="user__section_left">
              <div className="user__personal">
                {
                  this.props.user.hasGottenUser && this.state.user ?
                    <AnnotatedList data={[
                      { label: "full name", text: this.state.user.name.full },
                      { label: "dob", text: this.state.user.dob ? this.state.user.dob : "no dob" },
                      { label: "gender", text: this.state.user.gender ? this.state.user.gender : "no gender provided" }
                    ]} /> :
                    <LoadingText options={{
                      class: "block__lines",
                      bg: "transparent",
                      height: "10px",
                      lines: [
                        { color: "rgba(255,101,97,0.2)", width: "80%" },
                        { color: "rgba(255,101,97,0.4)", width: "70%" },
                        { color: "rgba(255,101,97,0.2)", width: "80%" },
                        { color: "rgba(255,101,97,0.4)", width: "90%" },
                        { color: "rgba(255,101,97,0.4)", width: "70%" },
                        { color: "rgba(255,101,97,0.2)", width: "80%" }
                      ]
                    }} />
                }
              </div>
            </div>
            <div className="user__section_right">
                <div className="user__contact">
                  <h2>Contact Information</h2>
                  {
                    this.props.user.hasGottenUser && this.state.user ?
                      <AnnotatedList data={[
                        { label: "email", text: this.state.user.email },
                        { label: "phone", text: this.state.user.phone ? this.state.user.phone : "no phone number" },
                        { label: "country", text: this.state.user.address ? this.state.user.address.country : "no country" }
                      ]} /> :
                      <LoadingText options={{
                        class: "block__lines",
                        bg: "transparent",
                        height: "10px",
                        lines: [
                          { color: "rgba(255,101,97,0.2)", width: "80%" },
                          { color: "rgba(255,101,97,0.4)", width: "70%" },
                          { color: "rgba(255,101,97,0.2)", width: "80%" },
                          { color: "rgba(255,101,97,0.4)", width: "90%" },
                          { color: "rgba(255,101,97,0.4)", width: "70%" },
                          { color: "rgba(255,101,97,0.2)", width: "80%" }
                        ]
                      }} />
                  }
                </div>
            </div>
          </section>
        )
      default:
        return (
          <p>{this.props.section}</p>
        )
    }
  }
}

UserSection.propTypes = {
  section: propTypes.string,
  userId: propTypes.string,
  user: propTypes.object
};

export default UserSection;