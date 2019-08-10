import './SocialShare.css';

import React, { Component } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';

import Loader from '../Loader';
import Notification from '../Notification';
import IconButton from '../IconButton';
import Input from '../Input';
import Button from '../Button';
import Modal from '../Modal';

import Post from '../../models/Post';
import { isEmail } from '../../utils';

const EMAIL_API = process.env.RAZZLE_EMAIL_API;
const Console = console;

export interface SocialShareMedium {
  post?: Post;
  href?: string;
  title?: string;
}

interface SocialShareProps {
  mail: SocialShareMedium;
  facebook: SocialShareMedium;
  twitter: SocialShareMedium;
}

interface SocialShareState {
  emailing: boolean;
  name: string;
  emails: string;
  notificationClosed: boolean;
  hasNotification: boolean;
  message: string;
  loading: boolean;
}

export default class SocialShare extends Component<SocialShareProps, SocialShareState> {
  private shareFacebook = () => {
    window.FB.ui({
      method: 'share',
      display: 'popup',
      href: this.props.facebook.href
    }, () => { return; });
  }

  private shareTwitter = () => {
    window.open(`
      https://www.twitter.com/intent/tweet?text=${this.props.twitter.title}&url=${this.props.twitter.href}
    `);
  }

  private handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'name') {
      this.setState({ name: value });
    } else if (name === 'emails') {
      this.setState({ emails: value });
    }
  }

  public shareEmail = () => {
    this.setState({ emailing: true });
  }

  public doEmailShare = () => {
    this.setState({ loading: true });

    if (!isEmail(this.state.emails)) {
      return this.setState({
        hasNotification: true,
        notificationClosed: false,
        message: 'One or more of the email addresses you entered is invalid.',
        loading: false
      });
    }

    axios.post(`${EMAIL_API}/s/share-story/${this.props.mail.post!.id}`, {
      sharedBy: this.state.name,
      emails: this.state.emails
    })
      .then(() => {
        this.setState({
          emailing: false,
          loading: false,
          hasNotification: true,
          notificationClosed: false,
          message: 'You just shared this story with your friends.'
        });
      })
      .catch((error) => {
        Console.log(error);
      });
  }
  public state: SocialShareState = {
    emailing: false,
    name: '',
    emails: '',
    notificationClosed: true,
    hasNotification: false,
    message: '',
    loading: false
  };

  public render() {
    return (
      <React.Fragment>
        {
          this.state.emailing
            ? <Modal doClose={() => this.setState({ emailing: false })}>
              <h3>Share this story with your friends</h3>
              <Input 
                inputType="text"
                inputDisabled={false}
                inputName="name"
                inputDefault={this.state.name}
                inputPlaceholder="Your name" 
                whenChange={this.handleInputChange} 
              />
              <p>Add the email addresses below (separated by commas):</p>
              <Input
                inputType="text"
                inputDisabled={false} 
                inputName="emails"
                inputDefault={this.state.emails}
                inputPlaceholder="eg. johndoe@jd.com, janedoe@jd.com"
                whenChange={this.handleInputChange} 
              />
              <Button 
                type="button" 
                solid={true}
                disabled={false}
                doClick={() => this.setState({ emailing: false })}
                text="Cancel"
                styles={{
                  backgroundColor: 'rgba(51,51,51)',
                  marginRight: '1em'
                }} 
              />
              <Button 
                type="button" 
                solid={true}
                doClick={this.doEmailShare}
                text="Share"
                disabled={!this.state.name.length || !this.state.emails.length} 
              />
              {
              this.state.loading
                ? <Loader 
                  width="24px"
                  styles={{
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    margin: '0 0 0 1em'
                  }} 
                /> 
                : null
              }
            </Modal> 
            : null
        }
        {
          !this.state.notificationClosed && this.state.hasNotification
            ? <Notification 
              text={this.state.message} 
              doClose={() => this.setState({ 
                  hasNotification: false,
                  notificationClosed: true,
                  message: '' 
                })
              } 
            /> 
            : null
        }
        <div className="social_share">
          <h5 className="social_share__label">Share:</h5>
          {
            this.props.facebook 
              ? <IconButton 
                icon="facebook" 
                disabled={false}
                solid={true}
                buttonTitle="Share on Facebook"
                doClick={this.shareFacebook}
                styles={{
                  backgroundColor: '#3B5998',
                  margin: '0.85rem'
                }} 
              /> 
              : null
          }
          {
            this.props.twitter ?
              <IconButton 
                icon="twitter" 
                disabled={false}
                solid={true}
                buttonTitle="Share on Twitter"
                doClick={this.shareTwitter}
                styles={{
                  backgroundColor: '#1DA1F2',
                  margin: '0.85rem'
                }} 
              /> 
              : null
          }
          {
            this.props.mail ?
              <IconButton 
                icon="email" 
                disabled={true}
                solid={true}
                buttonTitle="Email to Friends"
                doClick={this.shareEmail}
                styles={{
                  backgroundColor: 'rgb(51,51,51)',
                  margin: '0.85rem'
                }} 
              /> 
              : null
          }
        </div>
      </React.Fragment>
    );
  }
}