import "./ContactUs.css";

import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import propTypes from "prop-types";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faPhone, faAt } from "@fortawesome/fontawesome-free-solid";
import {
  faFacebook, faTwitterSquare, faLinkedin
} from "@fortawesome/fontawesome-free-brands";

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
        <h4>Let's do something great!</h4>
        <p>Passport to College connects with students from all over the world who are beating the odds.</p>
        <div className="contact_us__phone_email">
          <section className="contact_us__phone">
            <span><FontAwesomeIcon icon={faPhone} /></span>
            <h5>Give us a call</h5>
            <p>1.408.761.2843</p>
          </section>
          <section className="contact_us__email">
            <span><FontAwesomeIcon icon={faAt} /></span>
            <h5>Send us an email</h5>
            <a href="mailto:passportcollege@gmail.com">
              passportcollege@gmail.com
            </a>
          </section>
        </div>
        <div className="contact_us__socials">
          <h5>Connect online</h5>
          <section>
            <Link to="/" className="contact_us__socials_facebook">
              <FontAwesomeIcon icon={faFacebook} />
            </Link>
            <Link to="/" className="contact_us__socials_twitter">
              <FontAwesomeIcon icon={faTwitterSquare} />
            </Link>
            <Link to="/" className="contact_us__socials_linkedin">
              <FontAwesomeIcon icon={faLinkedin} />
            </Link>
          </section>
        </div>
      </section>
    );
  }
}

export default ContactUs;