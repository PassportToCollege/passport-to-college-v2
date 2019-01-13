import "./ContactUs.css";

import React, { Component } from "react";
import { Route } from "react-router-dom";
import propTypes from "prop-types";

import PageMeta from "../../components/PageMeta";
import ToTopContainer from "../../components/ToTopContainer";
import Nav from "./ContactUsNav";

import { CONTACT_US_MESSAGE } from "../../constants/routes";

import bg from "../../assets/images/contact.jpg";

class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  static propTypes = {
    updateLocation: propTypes.func,
    match: propTypes.object
  }

  componentDidMount() {
    this.props.updateLocation("contact_us on-white");
  }

  render() {
    return (
      <React.Fragment>
        <PageMeta route="CONTACT_US" />
        <ToTopContainer>
          <main id="contact_us">
            <header style={{
              backgroundImage: `url(${bg})`
            }}></header>
            <Nav />
            <Route exact path={this.props.match.url} render={this.renderMain}></Route>
            <Route path={CONTACT_US_MESSAGE.route} render={this.renderMain}></Route>
          </main>
        </ToTopContainer>
      </React.Fragment>
    )
  }

  renderMain = () => {
    return (
      <section>
        <h5>Let's do something great!</h5>
        <p>Passport to College connects with students from all over the world who are beating the odds.</p>
      </section>
    );
  }
}

export default ContactUs;