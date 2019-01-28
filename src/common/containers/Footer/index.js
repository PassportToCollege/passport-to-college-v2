import "./Footer.css";

import React from "react";
import { NavLink, Link } from "react-router-dom";
import propTypes from "prop-types";

import * as routes from "../../constants/routes";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitterSquare, faLinkedin, } from "@fortawesome/fontawesome-free-brands";
import Loader from "../../components/Loader";

import logo from "../../assets/images/logo__text__white_no_padding.png";

const footerNavItems = [
  routes.LANDING,
  routes.ABOUT_US,
  routes.SCHOLARS,
  routes.APPLY,
  routes.CONTACT_US
];

const Footer = ({ posts }) => {
  return (
    <footer className="footer">
      <main className="footer__main footer__container">
        <ul className="footer__nav" role="navigation">
          <img src={logo} alt="logo" />
          {
            footerNavItems.map(item => {
              return (
                <li key={item.route} className="footer__nav_item type__smaller">
                  <NavLink exact to={item.route}
                    activeClassName="active">{item.name}</NavLink>
                </li>
              )
            })
          }
        </ul>
        {
          posts.mostRecent && !posts.mostRecentGetFailed ?
            <section className="footer__posts">
              <h6>recent stories</h6>
              {
                posts.mostRecent.map(post => {
                  return (
                    <NavLink exact key={`footer_${post.id}`}
                      activeClassName="active" 
                      to={`/stories/read/${post.id}`}
                      className="footer__post_item">
                      <p>{post.title}</p>
                      <p className="type__caption">by {post.author.name.full}</p>
                    </NavLink>
                  )
                })
              }
            </section> :
            posts.mostRecentGetFailed &&
            posts.error.message === "no posts found" ?
              <section className="footer__posts">
                <h6>recent stories</h6>
                <span className="no__posts">
                  No stories available yet.
                </span>
              </section> : null
        }
        <section className="footer__contact">
          <h6>connect with us</h6>
          <div className="footer__contact_socials">
            <a href="https://www.facebook.com/aptitudeplusopportunity/" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="https://twitter.com/PasstoCollege" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTwitterSquare} />
            </a>
            <a href="https://www.linkedin.com/company-beta/8998407/" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>
          <a href="mailto:passportcollege@gmail.com">passportcollege@gmail.com</a>
        </section>
      </main>
      <section className="footer__copyright">
        <p className="footer__container type__smaller">
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