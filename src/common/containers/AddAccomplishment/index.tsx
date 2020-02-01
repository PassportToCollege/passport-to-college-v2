import './AddAccomplishment.css';

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { verifyImageDimensions } from '../../utils';
import Accomplishment from '../../models/Accomplishment';
import Post from '../../models/Post';
import NotificationsManager from '../../models/NotificationsManager';
import { 
  AddAccomplishmentProps as Props, 
  AddAccomplishmentState as State,
  mapDispatchToProps,
  mapStateToProps
} from './props';
import Strings from '../../constants/strings';
import Modal from '../../components/Modal';
import WYSIWYGEditor from '../../components/Editor';
import DropUploader from '../../components/DropUploader';
import InlineNotification from '../../components/Notification/inline';
import Input from '../../components/Input';
import Button from '../../components/Button';
import iNotification, { NotificationType } from '../../imodels/iNotification';
import { RawDraftContentState } from 'draft-js';

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
      accomplishment: new Accomplishment(newPost, props.student),
      notificationsManager: new NotificationsManager()
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
          this.state.notificationsManager.hasNotificationOfType(NotificationType.HeroError) ?
            <InlineNotification
              text={this.state.notificationsManager.getMessageOfNotificationOfType(NotificationType.HeroError)}
              // tslint:disable-next-line:max-line-length
              doClose={this.closeNotification}
            /> : null
        }
      </section>
    );
  }

  private renderTitleSection() {
    return (
      <section className="add_accomplishment__section">
        <h5 className="section_heading">
          {this.getSectionHeading(3, Strings.AddAccomplishment_SectionHeading_AccomplishmentTitle)}
        </h5>
        <Input
          inputType="text"
          inputName="title"
          inputPlaceholder="Insert awesome title here"
          whenBlur={this.handleInputChange}
          inputDefault=""
          inputDisabled={false}
        />
        {
          this.state.notificationsManager.hasOpenNotificationOfType(NotificationType.TitleError) ?
            <InlineNotification
              text={this.state.notificationsManager.getMessageOfNotificationOfType(NotificationType.TitleError)}
              doClose={this.closeNotification}
            /> : null
        }
      </section>
    );
  }

  private renderFullDetailsSection() {
    return (
      <section className="add_accomplishment__section">
        <h5 className="section_heading">
          {this.getSectionHeading(4, Strings.AddAccomplishment_SectionHeading_FullDetails)}
        </h5>
        <label>{Strings.AddAccomplishment_Info_FullDetails}</label>
        <WYSIWYGEditor
          content={this.state.accomplishment.content.editable}
          captureBlur={this.handleDetailsBlur}
          editorStyles={{
            maxWidth: '100%'
          }}
          controlStyles={{
            maxWidth: '100%'
          }}
        />
        {
          this.state.notificationsManager.hasOpenNotificationOfType(NotificationType.AccomplishmentDetailsError) ?
            <InlineNotification 
              // tslint:disable-next-line:max-line-length
              text={this.state.notificationsManager.getMessageOfNotificationOfType(NotificationType.AccomplishmentDetailsError)}
              doClose={this.closeNotification} 
            /> : null
        }
      </section>
    );
  }

  private handleDetailsBlur = (content: RawDraftContentState) =>
    this.setState({accomplishment: this.state.accomplishment.updateContent(content)})

  private handleInputChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === 'title') {
      this.setState({
        accomplishment: this.state.accomplishment.updateValue(name, value)
      });
    }
  }

  private handleHeroImageChange(e: HTMLInputElement | DataTransfer) {
    verifyImageDimensions(e)
      .then(({ image }) => {
        this.setState({ 
          hero: image,
          accomplishment: this.state.accomplishment.updateValue('hasHero', true)
        });
      })
      .catch((error: Error) => {
        const notification: iNotification = {
          type: NotificationType.HeroUploadError,
          message: error.message,
          isClosed: false
        };

        this.state.notificationsManager.add(notification);
      });
  }

  private handleAccomplishmentSave() {
    const { accomplishment } = this.state;
    const notification: iNotification = {
      type: NotificationType.Unknown,
      message: '',
      isClosed: false
    };

    if (!accomplishment.title.length) {
      notification.message = 'title is required';
      notification.type = NotificationType.TitleError;

      return this.state.notificationsManager.add(notification);
    }

    if (!Object.keys(accomplishment.content.text).length) {
      notification.message = 'full details required';
      notification.type = NotificationType.AccomplishmentDetailsError;

      return this.state.notificationsManager.add(notification);
    }

    if (accomplishment.hasHero && this.state.hero) {
      this.props.updatePostHeroImage(
        this.state.hero,
        accomplishment
      );
    }

    this.props.updatePostsCategory();
    this.props.createNewPost(accomplishment);
  }

  private closeNotification() {
    this.state.notificationsManager.close();
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
          {this.renderHeroSection()}
          {this.renderTitleSection()}
          {this.renderFullDetailsSection()}
          <section className="add_accomplishment__section">
            {
              this.state.notificationsManager.hasOpenNotificationOfType(NotificationType.TitleError) ?
                <InlineNotification
                  text={this.state.notificationsManager.getMessageOfNotificationOfType(NotificationType.TitleError)}
                  doClose={this.closeNotification}
                /> : null
            }
            {
              this.state.notificationsManager.hasOpenNotificationOfType(NotificationType.AccomplishmentDetailsError) ?
                <InlineNotification
                  // tslint:disable-next-line:max-line-length
                  text={this.state.notificationsManager.getMessageOfNotificationOfType(NotificationType.AccomplishmentDetailsError)}
                  doClose={this.closeNotification}
                /> : null
            }
            <Button
              type="button"
              disabled={false}
              solid={true}
              text="cancel"
              doClick={this.props.doClose}
              styles={{
                backgroundColor: 'rgb(128, 150, 162)',
                marginRight: '1em'
              }}
            />
            <Button
              disabled={false}
              type="button"
              solid={true}
              text="save accomplishment"
              doClick={this.handleAccomplishmentSave}
            />
          </section>
        </main>
      </Modal>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddAccomplishment);