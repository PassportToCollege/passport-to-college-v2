import "./Feature.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import moment from "moment";

import AnnotatedList from "../AnnotatedList";
import IconButton from "../IconButton";
import { ViewFeatureModal } from "../Modal";

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
          { label: "fid", text: this.state.feature.fid },
          { label: "created on", text: moment(this.state.feature.createdAt).format("MM-DD-Y") },
          { label: "expires on", text: moment(this.state.feature.expDate).format("MM-DD-Y") }
        ]} />
        {
          this.state.actions ?
            <div className="feature__actions">
              <IconButton solid icon="open" 
                styles={{
                  backgroundColor: "rgb(147,166,176)"
                }}
                doClick={() => this.setState({ viewing: true })} />
              <IconButton solid icon="delete" 
                styles={{
                  backgroundColor: "rgb(198,208,213)"
                }} 
                doClick={this.handleDelete} />
              <IconButton icon="edit" 
                styles={{
                  borderColor: "rgb(198,208,213)",
                  color: "rgb(198,208,213)"
                }} />
            </div> :
            null
        }
        {
          this.state.viewing ?
            <ViewFeatureModal doClose={() => this.setState({ viewing: false })}
              feature={this.state.feature} /> :
            null
        }
      </div>
    )
  }

  handleDelete = () => {
    if ("function" === typeof this.props.doDelete)
      this.props.doDelete(this.state.feature.fid);
  }
}

Feature.defaultProps = {
  actions: false
}

Feature.propTypes = {
  feature: propTypes.object,
  actions: propTypes.bool,
  doDelete: propTypes.func
};

export default Feature;