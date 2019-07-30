import './TestList.css';

import React, { PureComponent } from 'react';

import { iStringTestPair } from '../../imodels/iObjectTypes';
import { getTestKey } from '../../utils';

import Test from '../Test';

interface TestListProps {
  tests: iStringTestPair;
  handleDelete: (testKey: string) => void;
  disabled: boolean;
}

export default class TestList extends PureComponent<TestListProps> {
  private deleteTest = (testKey: string) => {
      this.props.handleDelete(testKey);
  }

  private renderTests = () => {
    return Object.keys(this.props.tests).map((testId: string) => {
      return (
        <Test 
          key={getTestKey(this.props.tests[testId])} 
          test={this.props.tests[testId]}
          handleDelete={this.deleteTest}
          disabled={this.props.disabled} 
        />
      );
    });
  }

  public render() {
    return (
      <div className="test_list">
        {this.renderTests()}
      </div>
    );
  }
}