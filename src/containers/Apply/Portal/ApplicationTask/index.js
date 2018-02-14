import "./ApplicationTask.css";

import React, { Component } from 'react';

class ApplicationTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      task: this.props.match.params.task
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match && nextProps.match.params)
      this.setState({ task: nextProps.match.params.task })
  }

  render() {
    return (
      <div className="application_portal_task">
        {this.state.task}
      </div>
    )
  }
}

export default ApplicationTask;