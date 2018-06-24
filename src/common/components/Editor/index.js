import "./Editor.css";

import React, { Component } from "react";
import { Link } from "react-router-dom";
import propTypes from "prop-types";
import { 
  Editor, 
  EditorState, 
  RichUtils, 
  convertToRaw, 
  convertFromRaw, 
  convertFromHTML, 
  ContentState,
} from "draft-js";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faBold, faItalic, faUnderline, faRedoAlt, faUndoAlt } from "@fortawesome/fontawesome-free-solid";

import { getWordCount } from "../../utils";

import Button from "../Button";

class WYSIWYGEditor extends Component {
  constructor(props) {
    super(props);

    let content = [];
    let blocks = [];

    if ("object" === typeof props.content && props.content !== null) {
      blocks = props.content.blocks;
      content = convertFromRaw(props.content);
    } else if ("string" === typeof props.content && props.content.length) {
      const processedHtml = convertFromHTML(props.content);
      content = ContentState.createFromBlockArray(
        processedHtml.contentBlocks,
        processedHtml.entityMap
      );
    }

    this.state = {
      editorState: content.length ? 
        EditorState.moveFocusToEnd(EditorState.createWithContent(content)) : EditorState.createEmpty(),
      isBold: false,
      isUnderline: false,
      isItalic: false,
      words: props.wordCounter && content.length ? getWordCount(blocks) : 0,
      focus: props.focus
    };
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.content && nextProps.content.blocks) {
      const content = convertFromRaw(nextProps.content);
      return {
        editorState: EditorState.createWithContent(content)
      };
    }

    return null;
  }

  componentDidMount() {
    if (this.state.focus)
      this.focusEditor()
  }

  render() {
    return (
      <div className="editor__container">
        {
          this.props.readonly ?
            null
          :
            <div className="editor__controls" style={this.props.controlStyles}>
              <span className="editor__control" title="Ctrl+B" 
                data-active={this.state.isBold ? "yes" : null}
                onClick={this.toggleBold}>
                <FontAwesomeIcon icon={faBold} />
              </span>
              <span className="editor__control" title="Ctrl+I" 
                data-active={this.state.isItalic ? "yes" : null}
                onClick={this.toggleItalic}>
                <FontAwesomeIcon icon={faItalic} />
              </span>
              <span className="editor__control" title="Ctrl+U" 
                data-active={this.state.isUnderline ? "yes" : null}
                onClick={this.toggleUnderline}>
                <FontAwesomeIcon icon={faUnderline} />
              </span>
              <span className="editor__control" title="Ctrl+Z">
                <FontAwesomeIcon icon={faUndoAlt} />
              </span>
              <span className="editor__control" title="CTRL+Y">
                <FontAwesomeIcon icon={faRedoAlt} />
              </span>
              {
                this.props.saveButton ?
                  <Button type="button" text={this.props.saveButtonText} solid 
                    doClick={this._handleSave}/>
                  :
                  null
              }
              {
                this.props.cancelButton ?
                  <Button type="button" text={this.props.cancelButtonText} solid
                    styles={{
                      backgroundColor: "#aaa",
                      marginLeft: "1em"
                    }} 
                    doClick={this._handleCancel}/>
                  :
                  null
              }
              {
                this.props.wordCounter ?
                <span className="editor__word_count">{this.state.words} { this.state.words === 1 ? "word" : "words" }</span> : null

              }
            </div>
        }
        <div className="editor__editor" style={ this.props.editorStyles || null }
          onClick={this.focusEditor}>
          <Editor editorState={this.state.editorState} 
            onChange={this.onChange}
            onBlur={this.handleBlur}
            handleKeyCommand={this.handleKeyCommand}
            readOnly={this.props.readonly} 
            ref={ref => this.domEditor = ref} />
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
    )
  }

  onChange = editorState => {
    let orderedSet = editorState.getCurrentInlineStyle().toString();

    let content = convertToRaw(editorState.getCurrentContent());
    this.setState({ 
      words: getWordCount(content.blocks),
      editorState,
      isBold: orderedSet.indexOf("BOLD") > -1,
      isItalic: orderedSet.indexOf("ITALIC") > -1,
      isUnderline: orderedSet.indexOf("UNDERLINE") > -1
    });
  }

  _handleSave = () => {
    this.props.handleSave(convertToRaw(this.state.editorState.getCurrentContent()));
  }

  _handleCancel = (e) => {
    if ("function" === typeof this.props.handleCancel)
      this.props.handleCancel(e);
  }

  handleBlur = () => {
    if ("function" === typeof this.props.captureBlur)
      this.props.captureBlur(convertToRaw(this.state.editorState.getCurrentContent()));
  }

  toggleBold = () => {
    this.setState({ isBold: !this.state.isBold });

    const newState = RichUtils.toggleInlineStyle(this.state.editorState, "BOLD");
    this.onChange(newState);
  }

  toggleItalic = () => {
    this.setState({ isItalic: !this.state.isItalic });

    const newState = RichUtils.toggleInlineStyle(this.state.editorState, "ITALIC");
    this.onChange(newState);
  }

  toggleUnderline = () => {
    this.setState({ isUnderline: !this.state.isUnderline });

    const newState = RichUtils.toggleInlineStyle(this.state.editorState, "UNDERLINE");
    this.onChange(newState);
  }

  handleKeyCommand = (command, editorState) => {
    if (command === "bold")
      this.setState({ isBold: !this.state.isBold });
    
    if (command === "underline")
      this.setState({ isUnderline: !this.state.isUnderline });

    if (command === "italic")
      this.setState({ isItalic: !this.state.isItalic });

    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  focusEditor = () => {
    this.domEditor.focus();
  }
}

WYSIWYGEditor.defaultProps = {
  limit: 1000,
  focus: false,
  readonly: false,
  saveButton: false,
  saveButtonText: "Save",
  cancelButton: false,
  cancelButtonText: "Cancel",
  wordCounter: true,
  communityGuidlines: false
};

WYSIWYGEditor.propTypes = {
  getContent: propTypes.func,
  saveButton: propTypes.bool,
  saveButtonText: propTypes.string,
  handleSave: propTypes.func,
  cancelButton: propTypes.bool,
  cancelButtonText: propTypes.string,
  handleCancel: propTypes.func,
  content: propTypes.oneOfType([propTypes.object, propTypes.string]),
  limit: propTypes.number,
  readonly: propTypes.bool,
  editorStyles: propTypes.object,
  controlStyles: propTypes.object,
  captureBlur: propTypes.func,
  focus: propTypes.bool,
  wordCounter: propTypes.bool,
  communityGuidlines: propTypes.bool
};

export default WYSIWYGEditor;