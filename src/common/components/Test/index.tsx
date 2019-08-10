import './Test.css';

import React, { PureComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/fontawesome-free-solid';

import { getTestKey } from '../../utils';
import iTest from '../../imodels/iTest';

interface TestProps {
  test: iTest;
  handleDelete: (testKey: string) => void;
  disabled: boolean;
}

export default class Test extends PureComponent<TestProps> {
  private deleteTest = () => {
    this.props.handleDelete(getTestKey(this.props.test));
  }

  public render() {
    const { test } = this.props;

    return (
      <div className="test">
        <div className="test__board_exam">
          <span className="test__board">{test.board}</span>
          <span className="test__exam">{test.examination}</span>
        </div>
        <h3 className="test__subject">{test.subject} ({test.grade})</h3>
        <div className="test__country_year">
          <span className="test__country">{test.country}</span>
          <span className="test__year">{test.year}</span>
        </div>
        {
          !this.props.disabled ?
            <div className="test__delete" onClick={this.deleteTest}>
              <FontAwesomeIcon icon={faTrash} />
            </div>
          :
            null
        }
      </div>
    );
  }
}