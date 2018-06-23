import "./SocialShare.css";

import React, { Component } from "react";
import propTypes from "prop-types";

import IconButton from "../IconButton";
import Input from "../Input";
import Button from "../Button";
import Modal from "../Modal";

class SocialShare extends Component {
  state = {
    emailing: false,
    name: "",
    emails: ""
  }

  render() {
    return (
      <React.Fragment>
        {
          this.state.emailing ?
            <Modal doClose={() => this.setState({ emailing: false })}>
              <h3>Share this story with your friends</h3>
              <Input inputName="name"
                inputPlaceholder="Your name" 
                whenChange={this.handleInputChange} />
              <p>Add the email addresses below (separated by commas):</p>
              <Input inputName="emails"
                inputPlaceholder="eg. johndoe@jd.com, janedoe@jd.com"
                whenChange={this.handleInputChange} />
              <Button type="button" solid
                doClick={() => this.setState({ emailing: false })}
                text="Cancel"
                styles={{
                  backgroundColor: "rgba(51,51,51)",
                  marginRight: "1em"
                }} />
                <Button type="button" solid
                  doClick={this.shareEmail}
                  text="Share"
                  disabled={!this.state.name.length || !this.state.emails.length} />
            </Modal> : null
        }
        <div className="social_share">
          <h4 className="social_share__label">Share:</h4>
          {
            this.props.facebook ?
              <IconButton icon="facebook" solid
                buttonTitle="Share on Facebook"
                doClick={this.shareFacebook}
                styles={{
                  backgroundColor: "#3B5998",
                  margin: "0.85rem"
                }} /> : null
          }
          {
            this.props.twitter ?
              <IconButton icon="twitter" solid
                buttonTitle="Share on Twitter"
                doClick={this.shareTwitter}
                styles={{
                  backgroundColor: "#1DA1F2",
                  margin: "0.85rem"
                }} /> : null
          }
          {
            this.props.mail ?
              <IconButton icon="email" solid
                buttonTitle="Email to Friends"
                doClick={this.shareEmail}
                styles={{
                  backgroundColor: "rgb(51,51,51)",
                  margin: "0.85rem"
                }} /> : null
          }
        </div>
      </React.Fragment>
    );
  }

  shareFacebook = () => {
    window.FB.ui({
      method: "share",
      display: "popup",
      href: this.props.facebook.href
    }, () => {return});
  }

  shareTwitter = () => {
    window.open(`
      https://www.twitter.com/intent/tweet?text=${this.props.twitter.title}&url=${this.props.twitter.href}
    `);
  }

  handleInputChange = e => {
    this.setState({ [e.name]: e.value });
  }

  shareEmail = () => {
    this.setState({ emailing: true });
  }
}

SocialShare.defaultProps = {
  mail: false
}

SocialShare.propTypes = {
  facebook: propTypes.object,
  twitter: propTypes.object,
  mail: propTypes.bool
};

export default SocialShare;