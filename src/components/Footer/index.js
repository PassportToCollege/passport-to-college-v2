import "./Footer.css";

import React from "react";
import { NavLink, Link } from "react-router-dom";
import propTypes from "prop-types";

import * as routes from "../../constants/routes";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitterSquare, faLinkedin } from "@fortawesome/fontawesome-free-brands";
import Loader from "../Loader";

import logo from "../../assets/images/logo__text__white.png";

const footerNavItems = [
  routes.LANDING,
  routes.ABOUT_US,
  routes.SCHOLARS,
  routes.APPLY,
  routes.CONTACT_US
]

const Footer = ({ posts }) => {
  return (
    <footer className="footer">
      <main className="footer__main footer__container">
        <ul className="footer__nav" role="navigation">
          <img src={logo} alt="logo" />
          {
            footerNavItems.map(item => {
              return (
                <li key={item.route} className="footer__nav_item">
                  <NavLink exact to={item.route}
                    activeClassName="active">{item.name}</NavLink>
                </li>
              )
            })
          }
        </ul>
        <section className="footer__posts">
          <h3>recent stories</h3>
          {
            posts.hasGotten ?
              posts.posts.map(post => {
                return (
                  <Link key={post.id} to="/" className="footer__post_item">
                    <h4>{post.title}</h4>
                    <h5>by {post.author.name.full}</h5>
                  </Link>
                )
              }) : <Loader />
          }
        </section>
        <section className="footer__contact">
          <h3>connect with us</h3>
          <div className="footer__contact_socials">
            <Link to="/">
              <FontAwesomeIcon icon={faFacebook} />
            </Link>
            <Link to="/">
              <FontAwesomeIcon icon={faTwitterSquare} />
            </Link>
            <Link to="/">
              <FontAwesomeIcon icon={faLinkedin} />
            </Link>
          </div>
          <Link to="/">passportcollege@gmail.com</Link>
        </section>
      </main>
      <section className="footer__copyright">
        <p className="footer__container">
          &copy; Copyright {new Date().getFullYear()} Passport to College - All Rights Reserved
        </p>
      </section>
    </footer>
  )
}

Footer.propTypes = {
  posts: propTypes.object
};

export default Footer;