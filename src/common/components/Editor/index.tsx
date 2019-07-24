import './Editor.css';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import { 
  Editor, 
  EditorState, 
  RichUtils, 
  convertToRaw, 
  convertFromRaw, 
  convertFromHTML, 
  ContentState,
  RawDraftContentBlock,
  RawDraftContentState,
  DraftHandleValue,
} from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic, faUnderline, faRedoAlt, faUndoAlt } from '@fortawesome/fontawesome-free-solid';

import { getWordCount } from '../../utils';

import Button from '../Button';
import { IsRawDraftContentState } from '../../imodels';

export interface EditorSaveButton {
  text: string;
  handleSave: (content: RawDraftContentState) => void;
}

export interface EditorCancelButton {
  text: string;
  handleCancel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

interface WYSIWYGEditorProps {
  save?: EditorSaveButton;
  cancel?: EditorCancelButton;
  content: RawDraftContentState | string;
  limit: number;
  readonly: boolean;
  focus: boolean;
  wordCounter: boolean;
  communityGuidlines: boolean;
  editorStyles: React.CSSProperties;
  controlStyles: React.CSSProperties;
  captureBlur: (content: RawDraftContentState) => void;
  getContent: () => void;
}

interface WYSIWYGEditorState {
  editorState: EditorState;
  isBold: boolean;
  isUnderline: boolean;
  isItalic: boolean;
  words: number;
  focus: boolean;
}

class WYSIWYGEditor extends Component<WYSIWYGEditorProps, WYSIWYGEditorState> {
  constructor(props: WYSIWYGEditorProps) {
    super(props);

    let content: ContentState = new ContentState();
    let blocks: RawDraftContentBlock[] = [];
    
    if (IsRawDraftContentState(props.content)) {
      blocks = props.content.blocks;
      content = convertFromRaw(props.content);
    } else if ('string' === typeof props.content && props.content.length) {
      const processedHtml = convertFromHTML(props.content);

      content = ContentState.createFromBlockArray(
        processedHtml.contentBlocks,
        processedHtml.entityMap
      );
    }

    this.state = {
      editorState: content.hasText() 
        ? EditorState.moveFocusToEnd(EditorState.createWithContent(content)) 
        : EditorState.createEmpty(),
      isBold: false,
      isUnderline: false,
      isItalic: false,
      words: props.wordCounter && content.hasText() 
        ? getWordCount(blocks) 
        : 0,
      focus: props.focus
    };
  }

  private domEditor: Editor | null = null;

  private onChange = (editorState: EditorState) => {
    const orderedSet = editorState.getCurrentInlineStyle().toString();

    const content = convertToRaw(editorState.getCurrentContent());
    this.setState({
      words: getWordCount(content.blocks),
      editorState,
      isBold: orderedSet.indexOf('BOLD') > -1,
      isItalic: orderedSet.indexOf('ITALIC') > -1,
      isUnderline: orderedSet.indexOf('UNDERLINE') > -1
    });
  }

  private _handleSave = () => {
    if (this.props.save) {
      const content = convertToRaw(this.state.editorState.getCurrentContent());
      this.props.save.handleSave(content);
    }
  }

  private _handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (this.props.cancel) {
      this.props.cancel.handleCancel(e);
    }
  }

  private handleBlur = () => {
    if ('function' === typeof this.props.captureBlur) {
      const content = convertToRaw(this.state.editorState.getCurrentContent());
      this.props.captureBlur(content);
    }
  }

  private toggleBold = () => {
    this.setState({ isBold: !this.state.isBold });

    const newState = RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD');
    this.onChange(newState);
  }

  private toggleItalic = () => {
    this.setState({ isItalic: !this.state.isItalic });

    const newState = RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC');
    this.onChange(newState);
  }

  private toggleUnderline = () => {
    this.setState({ isUnderline: !this.state.isUnderline });

    const newState = RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE');
    this.onChange(newState);
  }

  private handleKeyCommand = (command: string, editorState: EditorState): DraftHandleValue => {
    if (command === 'bold') {
      this.setState({ isBold: !this.state.isBold });
    }

    if (command === 'underline') {
      this.setState({ isUnderline: !this.state.isUnderline });
    }

    if (command === 'italic') {
      this.setState({ isItalic: !this.state.isItalic });
    }

    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  private focusEditor = () => {
    if (this.domEditor) {
      this.domEditor.focus();
    }
  }

  public static getDerivedStateFromProps(nextProps: WYSIWYGEditorProps) {
    if (nextProps.content && (nextProps.content as RawDraftContentState).blocks) {
      const content = convertFromRaw(nextProps.content as RawDraftContentState);
      
      return {
        editorState: EditorState.createWithContent(content)
      };
    }

    return null;
  }

  public componentDidMount() {
    if (this.state.focus) {
      this.focusEditor();
    }
  }

  public render() {
    return (
      <div className="editor__container">
        {
          this.props.readonly ?
            null
          :
            <div 
              className="editor__controls" 
              style={this.props.controlStyles}
            >
              <span 
                className="editor__control" 
                title="Ctrl+B" 
                data-active={this.state.isBold ? 'yes' : null}
                onClick={this.toggleBold}
              >
                <FontAwesomeIcon icon={faBold} />
              </span>
              <span 
                className="editor__control" 
                title="Ctrl+I" 
                data-active={this.state.isItalic ? 'yes' : null}
                onClick={this.toggleItalic}
              >
                <FontAwesomeIcon icon={faItalic} />
              </span>
              <span 
                className="editor__control" 
                title="Ctrl+U" 
                data-active={this.state.isUnderline ? 'yes' : null}
                onClick={this.toggleUnderline}
              >
                <FontAwesomeIcon icon={faUnderline} />
              </span>
              <span className="editor__control" title="Ctrl+Z">
                <FontAwesomeIcon icon={faUndoAlt} />
              </span>
              <span className="editor__control" title="CTRL+Y">
                <FontAwesomeIcon icon={faRedoAlt} />
              </span>
              {
                this.props.save
                  ? <Button 
                    type="button"
                    disabled={false} 
                    text={this.props.save.text} 
                    solid={true} 
                    doClick={this._handleSave}
                  />
                  : null
              }
              {
                this.props.cancel
                  ? <Button 
                    type="button" 
                    text={this.props.cancel.text} 
                    disabled={false}
                    solid={true}
                    styles={{
                      backgroundColor: '#aaa',
                      marginLeft: '1em'
                    }} 
                    doClick={this._handleCancel}
                  />
                  : null
              }
              {
                this.props.wordCounter
                ? <span className="editor__word_count">
                    {this.state.words} {this.state.words === 1 ? 'word' : 'words'}
                  </span> 
                : null
              }
            </div>
        }
        <div 
          className="editor__editor" 
          style={this.props.editorStyles}
          onClick={this.focusEditor}
        >
          <Editor 
            editorState={this.state.editorState} 
            onChange={this.onChange}
            onBlur={this.handleBlur}
            handleKeyCommand={this.handleKeyCommand}
            readOnly={this.props.readonly} 
            ref={(ref) => this.domEditor = ref} 
          />
        </div>
        {
            this.props.communityGuidlines ?
              <section className="editor__guidlines">
                <Link to="/stories/community-guidlines">
                  View Our Community Guidlines
                </Link>
              </section> : null
          }
      </div>
    );
  }
}

export default WYSIWYGEditor;