import "./CommunityGuidlines.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import propTypes from "prop-types";

import PageMeta from "../../../components/PageMeta";
import ToTopContainer from "../../../components/ToTopContainer";
import PageTitle from "../../../components/PageTitle";
import List from "../../../components/List";
import ListItem from "../../../components/ListItem";

class CommunityGuidlines extends Component {
  static propTypes = {
    updateLocation: propTypes.func
  }
  
  componentDidMount() {
    this.props.updateLocation("community-guidlines on-white");
  }

  render() {
    return (
      <ToTopContainer classes="community_guidlines">
        <PageMeta route="COMMUNITY_GUIDLINES" />
        <PageTitle>Community Guidlines</PageTitle>
        <h3>your use of our blog network</h3>
        <p className="community_guidlines__p">
          By commenting on our blogs you are agreeing to abide by the following guidlines.
          Although we will do our utmost to avoid this, Passport to College reserves the right to delete, move or otherwise alter comments posted by users if they are deemed to violate these guidelines.
        </p>
        <p className="community_guidlines__p type__bold">We ask that you:</p>
        <List width="600px">
          <ListItem
            text="Keep comments to the subject matter of the post on which you are commenting." />
          <ListItem
            text="Don’t post anything that contains any material that is abusive, vulgar, obscene, hateful, fraudulent, unlawful, threatening, or harrassing towards any person whether a user on this blog or not." />
          <ListItem text="Don’t plagarize." />
          <ListItem text="Don’t defame others." />
          <ListItem text="Don’t use posts to promote products, service and/or self." />
          <ListItem
            text="Don’t use third-party content without permission unless you are permitted to do so by copyright law." />
          <ListItem
            text="Don’t post any material which may be discriminatory or cause offence on the grounds of an individual’s sex, race, religion or belief, ethnic or national origin, sexual orientation, age, marital status, disability or working status." />
          <ListItem
            text="Don’t impersonate anyone else, including, but not limited to, any Passport to College staff, scholar, or administrator, or suggest that you have an affiliation with a person or association if you do not." />
          
        </List>
      </ToTopContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    post: state.post
  };
};

export default connect(
  mapStateToProps,
  () => { return {} }
)(CommunityGuidlines);

