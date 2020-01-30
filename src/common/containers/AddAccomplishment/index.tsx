import './AddAccomplishment.css';

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import propTypes from 'prop-types';

import { verifyImageDimensions } from '../../utils';
import { auth } from '../../utils/firebase';
import Accomplishment from '../../models/Accomplishment';
import Post from '../../models/Post';
import User from '../../models/User';
import { 
  AddAccomplishmentProps as Props, 
  AddAccomplishmentState as State
} from './props';
import Strings from '../../constants/strings';
import Modal from '../../components/Modal';
import WYSIWYGEditor from '../../components/Editor';
import DropUploader from '../../components/DropUploader';
import { InlineNotification } from '../../components/Notification';
import Input from '../../components/Input';
import Button from '../../components/Button';

class AddAccomplishment extends PureComponent<Props, State> {
  private readonly dropUploaderStyles: React.CSSProperties = {
    backgroundColor: 'white',
    backgroundImage: `url(${this.state.hero})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    padding: '4em'
  };

  private readonly dropAreaStyles: React.CSSProperties = {
    background: 'none',
    color: '#FFF',
    borderColor: '#FFF'
  };

  constructor(props: Props) {
    super(props);

    const newPost: Post = Post.getPostStub(props.student.uid);

    this.state = {
      student: props.student,
      accomplishment: new Accomplishment(newPost, props.student)
    };
  }

  private getSectionHeading = (count: number, heading: string) => `${count}. ${heading}`;

  private renderStudentSection() {
    return (
      <section className="add_accomplishment__section">
        <h5 className="section_heading">
          {this.getSectionHeading(1, Strings.AddAccomplishment_SectionHeading_Student)}
        </h5>
        <label>{Strings.AddAccomplishment_Label_UID}</label>
        <Input
          inputType="text"
          inputDisabled={true}
          inputDefault={this.state.student.uid}
          inputName=""
          inputPlaceholder=""
        />
        <label>{Strings.AddAccomplishment_Label_Fullname}</label>
        <Input
          inputType="text"
          inputDisabled={true}
          inputDefault={
            'string' === typeof this.state.student.User.name ?
              this.state.student.User.name :
              'function' === typeof this.state.student.User.name.full ?
                this.state.student.User.name.full() : ''
          }
          inputName=""
          inputPlaceholder=""
        />
      </section>
    );
  }

  private renderHeroSection() {
    return (

    );
  }

  public render() {
    return (
      <Modal 
        classes={['modal__add_accomplishment']}
        doClose={this.props.doClose}
      >
        <main className="add_accomplishment">
          <section className="add_accomplishment__section">
            <h6>{Strings.AddAccomplishment_Note}</h6>
            <p>{Strings.AddAccomplishment_Info}</p>
          </section>
          {this.renderStudentSection()}
          <section className="feature_student__section">
            <h5 className="section_heading">
              {this.getSectionHeading(2, Strings.AddAccomplishment_SectionHeading_HeroImage)}
            </h5>
            <label>{Strings.AddAccomplishment_Info_HeroImage}</label>
            <DropUploader
              overlay={true}
              label={<span><b>Choose a hero image</b> or drag it here</span>}
              uploaderStyles={this.dropUploaderStyles}
              handleImageChange={this.handleHeroImageChange} 
              dropAreaStyles={this.dropAreaStyles}
              labelStyles={{
                color: '#FFF'
              }} 
            />
            {
              this.state.hasHeroNotification && !this.state.heroNotificationClosed ?
                <InlineNotification text={this.state.heroNotification}
                  doClose={this.closeHeroNotification} /> : null
            }
          </section>
          <section className="add_accomplishment__section">
            <h5 className="section_heading">3. Accomplishment Title</h5>
            <Input inputType="text" inputName="title"
              inputPlaceholder="Insert awesome title here"
              whenBlur={this.handleInputChange} />
            {
              this.state.hasTitleNotification && !this.state.titleNotificationClosed ?
                <InlineNotification text={this.state.titleNotification}
                  doClose={this.closeTitleNotification} /> : null
            }
          </section>
          <section className="add_accomplishment__section">
            <h5 className="section_heading">4. Excerpt</h5>
            <label>Provide an excerpt of the accomplishment&apos;s full details. It is usually the first paragragh of the full details, or the first couple sentences. This is what readers will see as a preview on the <i>Stories</i> page. Try to keep your excerpt under 100 words.</label>
            <textarea name="excerpt" rows="5"
              onChange={this.handleInputChange}
              value={this.state.newAccomplishment.excerpt} />
            {
              this.state.hasExcerptNotification && !this.state.excerptNotificationClosed ?
                <InlineNotification text={this.state.excerptNotification}
                  doClose={this.closeExcerptNotification} /> : null
            }
          </section>
          <section className="add_accomplishment__section">
            <h5 className="section_heading">5. Full Details</h5>
            <label>Provide the full details about this student&apos;s accomplishment. This is what readers will see when the open the accomplishment.</label>
            <WYSIWYGEditor
              captureBlur={this.handleDetailsBlur}
              editorStyles={{
                maxWidth: '100%'
              }}
              controlStyles={{
                maxWidth: '100%'
              }} />
            {
              this.state.hasDetailsNotification && !this.state.detailsNotificationClosed ?
                <InlineNotification text={this.state.detailsNotification}
                  doClose={this.closeDetailsNotification} /> : null
            }
          </section>
          <section className="add_accomplishment__section">
            {
              this.state.hasTitleNotification && !this.state.titleNotificationClosed ?
                <InlineNotification text={this.state.titleNotification}
                  doClose={this.closeTitleNotification} /> : null
            }
            {
              this.state.hasExcerptNotification && !this.state.excerptNotificationClosed ?
                <InlineNotification text={this.state.excerptNotification}
                  doClose={this.closeExcerptNotification} /> : null
            }
            {
              this.state.hasDetailsNotification && !this.state.detailsNotificationClosed ?
                <InlineNotification text={this.state.detailsNotification}
                  doClose={this.closeDetailsNotification} /> : null
            }
            <Button type="button" solid={true}
              text="cancel" 
              doClick={this.props.doClose} 
              styles={{
                backgroundColor: 'rgb(128, 150, 162)',
                marginRight: '1em'
              }} />
            <Button type="button" solid={true} 
              text="save accomplishment" 
              doClick={this.handleAccomplishmentSave} />
          </section>
        </main>
      </Modal>
    );
  }

  public handleDetailsBlur = (content) => {
    this.setState({ newAccomplishment: {...this.state.newAccomplishment, 
        full: content} 
    });
  }

  public handleInputChange = (e) => {
    this.setState({
      newAccomplishment: {...this.state.newAccomplishment, 
        [e.target ? e.target.name : e.name]: e.target ? e.target.value : e.value}
    });
  }

  public handleHeroImageChange = (e) => {
    verifyImageDimensions(e)
      .then(({ image, url }) => {
        this.setState({ 
          hero: url,
          newAccomplishment: {...this.state.newAccomplishment, 
            hero: image} 
        });
      })
      .catch((error) => {
        this.setHeroNotification(error.message);
      });
  }

  public handleAccomplishmentSave = () => {
    const { newAccomplishment } = this.state;

    if (!newAccomplishment.title.length) {
      return this.setTitleNotification("title is required");
    }

    if (!newAccomplishment.excerpt.length) {
      return this.setExcerptNotification("excerpt required");
    }

    if (!Object.keys(newAccomplishment.full).length) {
      return this.setDetailsErrorNotification("full details required");
    }

    const accomplishment = new Accomplishment({
      title: newAccomplishment.title,
      author: auth.currentUser.uid,
      excerpt: newAccomplishment.excerpt,
      full: newAccomplishment.full
    }, this.state.student.uid);

    if (newAccomplishment.hero) {
      accomplishment.hasHero = true;

      this.props.postActions.doHeroUpload(
        newAccomplishment.hero,
        accomplishment.id
      );
    }

    this.props.postCategoryActions.doCategoryPostsUpdate('student_accomplishments');
    
    this.props.postActions.doPostCreate(accomplishment.data);
  }

  public setHeroNotification = (notification = '') => {
    this.setState({
      hasHeroNotification: true,
      heroNotificationClosed: false,
      heroNotification: notification
    });
  }

  public closeHeroNotification = () => {
    this.setState({
      hasHeroNotification: false,
      heroNotificationClosed: true,
      heroNotification: ''
    });
  }

  public setTitleNotification = (notification = '') => {
    this.setState({
      hasTitleNotification: true,
      titleNotificationClosed: false,
      titleNotification: notification
    });
  }

  public closeTitleNotification = () => {
    this.setState({
      hasTitleNotification: false,
      titleNotificationClosed: true,
      titleNotification: ''
    });
  }
  
  public setExcerptNotification = (notification = '') => {
    this.setState({
      hasExcerptNotification: true,
      excerptNotificationClosed: false,
      excerptNotification: notification
    });
  }

  public closeExcerptNotification = () => {
    this.setState({
      hasExcerptNotification: false,
      excerptNotificationClosed: true,
      excerptNotification: ''
    });
  }

  public setDetailsErrorNotification = (notification = '') => {
    this.setState({
      hasDetailsNotification: true,
      detailsNotificationClosed: false,
      detailsNotification: notification
    });
  }

  public closeDetailsNotification = () => {
    this.setState({
      hasDetailsNotification: false,
      detailsNotificationClosed: true,
      detailsNotification: null
    });
  }
}

AddAccomplishment.defaultProps = {
  edit: false
};

AddAccomplishment.propTypes = {
  post: propTypes.object,
  postActions: propTypes.object,
  postCategories: propTypes.object,
  postCategoryActions: propTypes.object,
  doClose: propTypes.func,
  student: propTypes.object
};

const mapStateToProps = (state) => {
  return {
    post: state.post,
    postCategories: state.postCategories
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    postActions: bindActionCreators(postActions, dispatch),
    postCategoryActions: bindActionCreators(postCategoryActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddAccomplishment);