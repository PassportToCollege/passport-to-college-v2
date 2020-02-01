import './AboutUs.css';

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { RawDraftContentState } from 'draft-js';

import { 
  AboutUsProps,
  mapStateToProps, 
  mapDispatchToProps 
} from './props';
import { about } from '../../../constants/pages';
import { STORIES as storiesRoute } from '../../../constants/routes';
import Strings from '../../../constants/strings';

import Header from '../../../components/Header';
import TopicSection from '../../../components/TopicSection';
import ToTopContainer from '../../../components/ToTopContainer';
import IconBullet from '../../../components/IconBullet';
import PageMeta from '../../../components/PageMeta';
import FlexContainer from '../../../components/FlexContainer';
import LinkButton from '../../../components/LinkButton';
import InfoCard from '../../../components/InfoCard';
import WYSIWYGEditor from '../../../components/Editor';

const headerImage = require('../../assets/images/about_us__header.jpg');

class AboutUs extends PureComponent<AboutUsProps> {
 private renderWhatWeDoSection(): React.ReactNode {
    return (
      <section className="about__wwd">
        <FlexContainer>
          {
            about.wwd.map((item, i) => {
              return (
                <IconBullet
                  key={`${item.icon}_${i}`}
                  heading={item.heading}
                  icon={item.icon}
                >
                  <p>{item.info}</p>
                </IconBullet>
              );
            })
          }
        </FlexContainer>
      </section>
    );
  }

  private renderStaffSection(): React.ReactNode {
    let title = '';
    let content: string | RawDraftContentState = '';
    if (this.props.founder) {
      if ('string' === typeof this.props.founder.name) {
          title = this.props.founder.name;
      } else if (this.props.founder.name.full) {
        title = this.props.founder.name.full();
      }

      if (this.props.founder.bio) {
        content = 'string' === typeof this.props.founder.bio ?
          this.props.founder.bio : this.props.founder.bio.editable;
      }
    }

    return (
      <section className="about__staff">
        <FlexContainer classes={['about__staff_header']}>
          <h4>{Strings.AboutUs_Intro}</h4>
          <p>{about.staffIntro}</p>
        </FlexContainer>
        <FlexContainer classes={['about__staff_staff']}>
          {
            this.props.founder ?
              <React.Fragment>
                <InfoCard
                  isFounder={true}
                  background={{
                    color: 'rgba(58,58,58,0.65)'
                  }}
                  uid={this.props.founder.uid}
                  title={title}
                  content="Founder"
                />
                <WYSIWYGEditor
                  readonly={true}
                  content={content}
                  editorStyles={{
                    border: 'none',
                    minHeight: 'auto'
                  }} 
                />
              </React.Fragment>
              : null
          }
        </FlexContainer>
      </section>
    );
  }

  private renderStoriesCTA = () => {
    if (about.showStoriesCTA) {
      return (
        <section className="about__staff_stories_cta">
          <div
            className="stories_cta__bg"
            style={{
              backgroundImage: `url(${about.storiesCTABg})`
            }}
          />
          <div className="stories_cta__content">
            <div>
              <span>
                <h3>{Strings.AboutUs_StoriesCTA}</h3>
                <LinkButton
                  default={true}
                  text="stories"
                  target={storiesRoute.route}
                />
              </span>
            </div>
          </div>
        </section>
      );
    }

    return null;
  }

  public componentDidMount() {
    this.props.updateLocation('about');

    if (!this.props.founder) {
      this.props.doGetFounder();
    }

    if (!this.props.staff) {
      this.props.doGetStaff();
    }
  }

  public render() {
    return (
      <React.Fragment>
        <PageMeta route="ABOUT_US" />
        <ToTopContainer>
          <Header 
            scrollElement="about_main"
            background={headerImage} 
          />
          {this.renderMain()}
        </ToTopContainer>
      </React.Fragment>
    );
  }

  public renderMain = () => {
    return (
      <main id="about_main">
        <TopicSection 
          heading="about us"
          content={
            <p>{about.intro}</p>
          } 
          sectionStyles={{
            width: '1140px',
            maxWidth: '100%',
            margin: '0 auto'
          }} 
        />
        {this.renderWhatWeDoSection()}
        {this.renderStaffSection()}
        {/* <section>
          <FlexContainer>
            {
              this.props.staff ?
                this.props.staff.map(member => {
                  if (member.user) {
                    return <RoleCard key={member.user.uid} staff={member} />
                  }

                  return <RoleCard key={member.uid} staff={member} />
                }) : null
            }
          </FlexContainer>
        </section> */}
        {this.renderStoriesCTA()}
      </main>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AboutUs);