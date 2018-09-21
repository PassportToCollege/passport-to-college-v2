import "./Feature.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import moment from "moment";

import AnnotatedList from "../AnnotatedList";
import IconButton from "../IconButton";
import ViewFeature from "../ViewFeature";

class Feature extends Component {
  constructor(props) {
    super(props);

    this.state = {
      feature: props.feature,
      actions: !!props.actions,
      viewing: false
    }

    this.featureStyles = {
      backgroundColor: "#FFF",
      padding: "1em"
    }
  }

  render() {
    return (
      <div className="feature__item" style={this.featureStyles}>
        <AnnotatedList data={[
          { label: "id", text: this.state.feature.id },
          { label: "created on", text: moment(this.state.feature.createdAt).format("MM-DD-Y") },
          { label: "expires on", text: moment(this.state.feature.expiration).format("MM-DD-Y") },
          { 
            label: "state", 
            text: this.state.feature.state.published ? "featured" : this.state.feature.state.archived ? "archived" : "draft" 
          }
        ]} />
        {
          this.state.actions ?
            <div className="feature__actions">
              <IconButton solid icon="open"
                buttonTitle="Open feature" 
                styles={{
                  backgroundColor: "rgb(147,166,176)"
                }}
                doClick={() => this.setState({ viewing: true })} />
              <IconButton solid icon="delete"
                buttonTitle="Delete feature" 
                styles={{
                  backgroundColor: "rgb(198,208,213)"
                }} 
                doClick={this.handleDelete} />
              <IconButton icon="edit"
                buttonTitle="Edit feature" 
                styles={{
                  borderColor: "rgb(198,208,213)",
                  color: "rgb(198,208,213)"
                }} 
                doClick={this.handleEdit} />
            </div> :
            null
        }
        {
          this.state.viewing ?
            <ViewFeature 
              onFeatureClose={() => this.setState({ viewing: false })}
              feature={this.state.feature} /> :
            null
        }
      </div>
    )
  }

  handleDelete = () => {
    if ("function" === typeof this.props.doDelete)
      this.props.doDelete(this.state.feature);
  }

  handleEdit = () => {
    if ("function" === typeof this.props.doEdit)
      this.props.doEdit(this.state.feature);
  }
}

Feature.defaultProps = {
  actions: false
}

Feature.propTypes = {
  feature: propTypes.object,
  actions: propTypes.bool,
  doDelete: propTypes.func,
  doEdit: propTypes.func
};

export default Feature;