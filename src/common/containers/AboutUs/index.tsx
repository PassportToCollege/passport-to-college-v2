import './AboutUs.css';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { 
  AboutUsProps, 
  AboutUsState,
  mapStateToProps, 
  mapDispatchToProps 
} from './props';
import { about } from '../../constants/pages';
import { STORIES as storiesRoute } from '../../constants/routes';

import Header from '../../components/Header';
import TopicSection from '../../components/TopicSection';
import ToTopContainer from '../../components/ToTopContainer';
import IconBullet from '../../components/IconBullet';
import PageMeta from '../../components/PageMeta';
import FlexContainer from '../../components/FlexContainer';
import LinkButton from '../../components/LinkButton';
import InfoCard from '../../components/InfoCard';
import WYSIWYGEditor from '../../components/Editor';

const headerImage = require('../../assets/images/about_us__header.jpg');

class AboutUs extends Component<AboutUsProps, AboutUsState> {
  constructor(props: AboutUsProps) {
    super(props);
    this.state = {
      founder: props.founder,
      staff: props.staff
    };
  }

  public componentDidMount() {
    this.props.updateLocation('about');

    if (!this.state.founder) {
      this.props.doGetFounder();
    }

    if (!this.state.staff) {
      this.props.doGetStaff();
    }
  }

  public static getDerivedStateFromProps(nextProps: AboutUsProps, state: AboutUsState) {
    if (nextProps.gotFounder && !_.isEqual(state.founder, nextProps.founder)) {
      return { founder: nextProps.founder };
    }

    if (nextProps.gotStaff && !_.isEqual(state.staff, nextProps.staff)) {
      return { staff: nextProps.staff };
    }

    return null;
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
        <section className="about__staff">
          <FlexContainer classes={['about__staff_header']}>
            <h4>
              The people behind <br/>
              Passport to College
            </h4>
            <p>{about.staffIntro}</p>
          </FlexContainer>
          <FlexContainer classes={['about__staff_staff']}>
            {
              this.state.founder ?
                <React.Fragment>
                  <InfoCard 
                    isFounder={true}
                    background={{
                      color: 'rgba(58,58,58,0.65)'
                    }}
                    uid={this.state.founder.uid} 
                    title={this.state.founder.name.full}
                    content="Founder" 
                  />
                  <WYSIWYGEditor 
                    readonly={true}
                    content={this.state.founder.bio} 
                    editorStyles={{
                      border: 'none',
                      minHeight: 'auto'
                    }} />
                </React.Fragment>
                : null
            }
          </FlexContainer>
        </section>
        {/* <section>
          <FlexContainer>
            {
              this.state.staff ?
                this.state.staff.map(member => {
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

  public renderStoriesCTA = () => {
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
                <h3>more<br/> about us</h3>
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
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AboutUs);