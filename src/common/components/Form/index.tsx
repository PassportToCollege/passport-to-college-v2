import React, { Component } from 'react';
import propTypes from 'prop-types';

import { makeClassString } from '../../utils';

interface FormProps {
  children: React.ReactChildren;
  doSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  classes: string[];
  reset: boolean;
}

interface FormSnapshot {
  resetForm: boolean;
}

export default class Form extends Component<FormProps> {
  private formRef: HTMLFormElement | null = null;

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if ('function' === typeof this.props.doSubmit) {
      this.props.doSubmit(e);
    }
  }

  public getSnapshotBeforeUpdate(props: FormProps): FormSnapshot | null {
    if (!props.reset && this.props.reset) {
      return { resetForm: true };
    }

    return null;
  }

  public componentDidUpdate(prevProps: FormProps, prevState: never, snapshot: FormSnapshot) {
    if (snapshot && snapshot.resetForm) {
      if (this.formRef) {
        this.formRef.reset();
      }
    }
  }

  public render() {
    return (
      <form 
        className={makeClassString(this.props.classes)}
        onSubmit={this.handleSubmit}
        ref={(form) => this.formRef = form}
      >
        {this.props.children}
      </form>
    );
  }
}