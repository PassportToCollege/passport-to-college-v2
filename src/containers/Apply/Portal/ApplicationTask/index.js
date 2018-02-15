import "./ApplicationTask.css";

import React, { Component } from 'react';
import propTypes from 'prop-types';

class ApplicationTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      task: this.props.match.params.task
    };
  }

  componentWillMount() {
    this.props.setTask(this.state.task);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match && nextProps.match.params)
      this.setState({ task: nextProps.match.params.task });

    if (this.state.task !== nextProps.match.params.task)
      nextProps.setTask(nextProps.match.params.task);
  }

  render() {
    return (
      <div className="application_portal_task">
        {this.state.task}
      </div>
    )
  }
}

ApplicationTask.propTypes = {
  setTask: propTypes.func
};

export default ApplicationTask;