import "./ViewScholar.css";

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";
import _ from "lodash";

import * as featuresActions from "../../../actions/featuresActions";
import * as postsActions from "../../../actions/postsActions";
import { shuffle } from "../../../utils";
import { Student } from "../../../utils/utilityClasses";

import ToTopContainer from "../../../components/ToTopContainer";
import PageMeta from "../../../components/PageMeta";
import ColoredStrip from "../../../components/ColoredStrip";
import WYSIWYGEditor from "../../../components/Editor";
import LabeledIconCard from "../../../components/LabeledIconCard";
import HoverCard from "../../../components/HoverCard";
import InvisibleFlexPadder from "../../../components/InvisibleFlexPadder";

class ViewScholar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: this.getCurrentStudent(props.students.students),
      students: props.students.gotCurrentStudents ? props.students.students : null
    }
  }

  static propTypes = {
    students: propTypes.object,
    match: propTypes.object,
    posts: propTypes.object,
    postsActions: propTypes.object,
    features: propTypes.object,
    featuresActions: propTypes.object
  }

  componentDidMount() {
    if (this.state.current) {
      this.props.postsActions.doGetAccomplishmentsByUser(this.state.current.uid, "published");
      this.props.featuresActions.doGetFeaturesByUser(this.state.current.uid, "published");
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.students.gotCurrentStudents &&
    !_.isEqual(nextProps.students.students, prevState.students)) {
      return {
        students: nextProps.students.students,
        current: nextProps.students.students.find(student => {
          return student.uid === nextProps.match.params.uid
        })
      }
    }

    if (nextProps.posts.gotAccomplishmentsByUser &&
    !_.isEqual(prevState.accomplishments, nextProps.posts.accomplishmentsByUser)) {
      return {
        accomplishments: nextProps.posts.accomplishmentsByUser
      };
    }

    if (nextProps.features.hasGotten &&
    !_.isEqual(nextProps.features.userFeatures, prevState.features)) {
      return {
        features: nextProps.features.userFeatures
      };
    }

    return null;
  }

  getSnapshotBeforeUpdate(props) {
    if (props.match.params.uid !== this.props.match.params.uid) {
      return {
        studentChanged: true
      };
    }

    if (props.students.gettingCurrentStudents && this.props.students.gotCurrentStudents) {
      return {
        gotStudents: true
      };
    }

    if (this.props.features.hasGotten && this.props.posts.gotAccomplishmentsByUser &&
    this.state.accomplishments && this.state.features) {
      return {
        gotFeatsAndAccomplishments: true
      };
    }

    return null;
  }

  componentDidUpdate(props, state, snapshot) {
    if (snapshot && snapshot.studentChanged) {
      if ("function" === typeof document.scrollingElement.scrollTo) {
        document.scrollingElement.scrollTo(0, 0);
      } else {
        document.scrollingElement.scrollTop = 0;
      }

      const current = this.props.students.students.find(student => {
        return student.uid === this.props.match.params.uid
      });

      this.props.postsActions.doGetAccomplishmentsByUser(current.uid, "published");
      this.props.featuresActions.doGetFeaturesByUser(current.uid, "published");

      this.setState({
        current
      });
    }

    if (snapshot && snapshot.gotStudents && this.state.current) {
      this.props.postsActions.doGetAccomplishmentsByUser(this.state.current.uid, "published");
      this.props.featuresActions.doGetFeaturesByUser(this.state.current.uid, "published");
    }

    if (snapshot && snapshot.gotFeatsAndAccomplishments) {
      const combined = [...this.state.accomplishments, ...this.state.features].sort((a, b) => {
        return a.createdAt - b.createdAt;
      });

      this.setState({
        combined,
        features: null,
        accomplishments: null
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        {
          this.props.students.gotCurrentStudents && this.state.current ?
            <PageMeta>
              <title>{this.state.current.user.name.full} | Scholars | Passport to College</title>
            </PageMeta> : null
        }
        <ToTopContainer classes="view_scholar">
          <section className="view_scholar__name">
            <span>
              {
                this.state.current ?
                  <h3 className="type__boldest">{this.state.current.user.name.full}</h3> : null
              }
            </span>
          </section>
          {this.getPictureBlock()}
          {this.getBioBlock()}
          {this.getFacts()}
          <ColoredStrip background="#11A5AC">
            <h3 className="type__uppercase type__center type__bold type__spacey type__color_white">
              {
              this.state.combined ||
              this.state.features ||
              this.state.accomplishments ?
                "features + accomplishments" :
                "more scholars"
              }
            </h3>
          </ColoredStrip>
          {this.getAccomplishmentsBlock()}
          {this.getMoreScholars()}
        </ToTopContainer>
      </React.Fragment>
    )
  }

  getCurrentStudent = students => {
    if (students) {
      return students.find(student => {
        return student.uid === this.props.match.params.uid;
      });
    }

    return null;
  }

  getPictureBlock = () => {
    return (
      <section className="view_scholar__profile">
        {
          this.state.current && this.state.current.user.hasProfilePicture ?
            <span>
              <img src={this.state.current.user.profilePicture} alt="" /> 
            </span> :
            this.state.current && !this.state.current.user.hasProfilePicture ?
              <span className="view_scholar__empty_picture"></span> :
              <span></span>
        }
        {
          this.state.current ?
            <span>
              <ColoredStrip background="#11A5AC">
                <p className="type__uppercase type__light type__smaller">
                  {new Student(this.state.current, this.state.current.user).classification}
                </p>
                <h5>{this.state.current.university}</h5>
              </ColoredStrip>
            </span> : 
            <span className="view_scholar__loading"></span>
        }
      </section>
    );
  }

  getBioBlock = () => {
    if (this.state.current) {
      return (
        <section className="view_scholar__bio">
          <WYSIWYGEditor readonly
            content={this.state.current.bio} 
            editorStyles={{
              border: "none",
              margin: "0 auto",
              padding: "0",
              minHeight: "auto",
              lineHeight: "1.25rem",
              color: "#333"
            }} />
        </section>
      )
    }

    return null;
  }

  getFacts = () => {
    if (this.state.current) {
      return (
        <section className="view_scholar__facts">
          <LabeledIconCard icon="school" 
            label="university">
            <h4 className="type__center">{this.state.current.university}</h4>
          </LabeledIconCard>
          <LabeledIconCard icon="book" 
            label="major">
            <h4 className="type__center">{this.state.current.major}</h4>
          </LabeledIconCard>
          <LabeledIconCard icon="globe" 
            label="country">
            <h4 className="type__center">{this.state.current.user.address.country}</h4>
          </LabeledIconCard>
          <LabeledIconCard icon="date" 
            label="enrolled">
            <h4 className="type__center">{this.state.current.enrollmentYear}</h4>
          </LabeledIconCard>
          <LabeledIconCard icon="date" 
            label="expected graduation">
            <h4 className="type__center">{this.state.current.graduationYear}</h4>
          </LabeledIconCard>
          <div className="view_scholar__facts_section_overflow"></div>
        </section>
      )
    }

    return null;
  }

  getAccomplishmentsBlock = () => {
    const { combined, features, accomplishments } = this.state;

    if (combined || features || accomplishments) {
      return (
        <section className="view_scholar__accomplishments">
          <div>
            {
              combined ?
                combined.map(post => {
                  return (
                    <LabeledIconCard key={post.id}
                      icon={post.isFeature ? "feature" : "accomplishment"}
                      label={post.isFeature ? "feature" : "accomplishment"}>
                      <h4 className="type__center">
                        <Link to={`/stories/read/${post.id}`}>{post.title}</Link>
                      </h4>
                    </LabeledIconCard>
                  )
                }) : null
            }
            {
              features ?
                features.map(post => {
                  return (
                    <LabeledIconCard key={post.id}
                      icon={post.isFeature ? "feature" : "accomplishment"}
                      label={post.isFeature ? "feature" : "accomplishment"}>
                      <h4 className="type__center">
                        <Link to={`/stories/read/${post.id}`}>{post.title}</Link>
                      </h4>
                    </LabeledIconCard>
                  )
                }) : null
            }
            {
              accomplishments ?
                accomplishments.map(post => {
                  return (
                    <LabeledIconCard key={post.id}
                      icon={post.isFeature ? "feature" : "accomplishment"}
                      label={post.isFeature ? "feature" : "accomplishment"}>
                      <h4 className="type__center">
                        <Link to={`/stories/read/${post.id}`}>{post.title}</Link>
                      </h4>
                    </LabeledIconCard>
                  )
                }) : null
            }
            {
              (combined && combined.length % 3 > 0) ||
              (features && features.length % 3 > 0) ||
              (accomplishments && accomplishments.length % 3 > 0) ?
                <InvisibleFlexPadder width="350px" height="350px" /> : null
            }
          </div>
        </section>
      );
    }

    return null;
  }

  getMoreScholars = () => {
    if (this.state.current && this.state.students) {
      const { combined, accomplishments, features } = this.state;
      const moreStudents = this.getSuggestedStudents();

      return (
        <section className="view_scholar__more_scholars">
          {
            combined || accomplishments || features ?
              <h3 className="type__uppercase type__center type__bold type__spacey">
                more scholars
              </h3> : null
              
          }
          <div className="more_scholars__container">
            {
              moreStudents.map(student => {
                return (
                  <HoverCard key={student.uid}
                    target={`/scholars/view/scholar/${student.uid}`}
                    background={student.user.hasProfilePicture ? student.user.profilePicture : null}
                    overlay="rgba(51,51,51,0.85)">
                    <p className="type__color_white type__caption">{student.university}</p>
                    <h4 className="type__color_white">{student.user.name.full}</h4>
                  </HoverCard>
                )
              })
            }
          </div>
        </section>
      );
    }

    return null;
  }

  getSuggestedStudents = () => {
    const { current, students } = this.state;

    let withoutCurrent = students.filter(student => {
      return student.uid !== current.uid;
    })

    if (withoutCurrent.length <= 3)
      return withoutCurrent;

    return shuffle(withoutCurrent).slice(0, 3);
  }
}

const mapStateToProps = state => {
  return {
    posts: state.posts,
    features: state.features
  };
};

const mapDispatchToProps = dispatch => {
  return {
    postsActions: bindActionCreators(postsActions, dispatch),
    featuresActions: bindActionCreators(featuresActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewScholar);

