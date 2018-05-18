import "./Editor.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faBold, faItalic, faUnderline, faRedoAlt, faUndoAlt } from "@fortawesome/fontawesome-free-solid";

import { getWordCount } from "../../utils";

import Button from "../Button";

class WYSIWYGEditor extends Component {
  constructor(props) {
    super(props);

    let content = [];
    let blocks = [];

    if ("object" === typeof props.content) {
      blocks = props.content.blocks;
      content = convertFromRaw(props.content);
    }

    this.state = {
      editorState: content.length ? EditorState.createWithContent(content) : EditorState.createEmpty(),
      isBold: false,
      isUnderline: false,
      isItalic: false,
      words: content.length ? getWordCount(blocks) : 0,
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
              <span className="editor__control" title="Bold" 
                data-active={this.state.isBold ? "yes" : null}
                onClick={this.toggleBold}>
                <FontAwesomeIcon icon={faBold} />
              </span>
              <span className="editor__control" title="Italic" 
                data-active={this.state.isItalic ? "yes" : null}
                onClick={this.toggleItalic}>
                <FontAwesomeIcon icon={faItalic} />
              </span>
              <span className="editor__control" title="Underline" 
                data-active={this.state.isUnderline ? "yes" : null}
                onClick={this.toggleUnderline}>
                <FontAwesomeIcon icon={faUnderline} />
              </span>
              <span className="editor__control" title="Undo">
                <FontAwesomeIcon icon={faUndoAlt} />
              </span>
              <span className="editor__control" title="Redo">
                <FontAwesomeIcon icon={faRedoAlt} />
              </span>
              {
                this.props.saveButton ?
                  <Button type="button" text={this.props.saveButtonText} solid doClick={this._handleSave}/>
                  :
                  null
              }
              <span className="editor__word_count">{this.state.words} { this.state.words === 1 ? "word" : "words" }</span>
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
      </div>
    )
  }

  onChange = editorState => {
    this.setState({ editorState });
    
    let content = convertToRaw(editorState.getCurrentContent());
    this.setState({ words: getWordCount(content.blocks) });
  }

  _handleSave = () => {
    this.props.handleSave(convertToRaw(this.state.editorState.getCurrentContent()));
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
  saveButton: false,
  saveButtonText: "Save"
};

WYSIWYGEditor.propTypes = {
  getContent: propTypes.func,
  saveButton: propTypes.bool,
  saveButtonText: propTypes.string,
  handleSave: propTypes.func,
  content: propTypes.object,
  limit: propTypes.number,
  readonly: propTypes.bool,
  editorStyles: propTypes.object,
  controlStyles: propTypes.object,
  captureBlur: propTypes.func,
  focus: propTypes.bool
};

export default WYSIWYGEditor;