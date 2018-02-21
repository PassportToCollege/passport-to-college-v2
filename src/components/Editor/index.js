import "./Editor.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, ContentState } from "draft-js";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faBold, faItalic, faUnderline, faRedoAlt, faUndoAlt } from "@fortawesome/fontawesome-free-solid";

import Button from "../Button";

class WYSIWYGEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      isBold: false,
      isUnderline: false,
      isItalic: false
    };
  }

  componentWillMount() {
    this.setState({ editorState: EditorState.moveFocusToEnd(this.state.editorState) });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.content && nextProps.content.blocks) {
      const content = convertFromRaw(nextProps.content);
      this.setState({ editorState: EditorState.createWithContent(content) })
    }
  }

  render() {
    return (
      <div className="editor__container">
        <div className="editor__controls">
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
              <Button type="button" text="Save" solid doClick={this._handleSave}/>
              :
              null
          }
        </div>
        <div className="editor__editor">
          <Editor editorState={this.state.editorState} 
            onChange={this.onChange}
            handleKeyCommand={this.handleKeyCommand} />
        </div>
      </div>
    )
  }

  onChange = editorState => {
    this.setState({ editorState });
  }

  _handleSave = () => {
    this.props.handleSave(convertToRaw(this.state.editorState.getCurrentContent()));
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
}

WYSIWYGEditor.propTypes = {
  getContent: propTypes.func,
  saveButton: propTypes.bool,
  handleSave: propTypes.func,
  content: propTypes.object
};

export default WYSIWYGEditor;