import './RadioList.css';

import React, { PureComponent } from 'react';
import Radio from '../Radio';

export interface RadioData {
  label: string;
  value: string;
}

interface RadioListProps {
  radios: RadioData[];
  checked: string;
  onRadioChange: (active: string) => void;
  reset: boolean;
}

interface RadioListState {
  active: string;
}

export default class RadioList extends PureComponent<RadioListProps, RadioListState> {
  public state = {
    active: this.props.checked || 'none'
  };

  public static getDerivedStateFromProps(nextProps: RadioListProps, prevState: RadioListState) {
    if (nextProps.reset && prevState.active !== 'none') {
      return {
        active: 'none'
      };
    }

    return null;
  }

  public getSnapshotBeforeUpdate(prevProps: RadioListProps, prevState: RadioListState) {
    if (prevState.active !== this.state.active) {
      return { changed: true };
    }

    return null;
  }

  public componentDidUpdate(prevProps: RadioListProps, prevState: RadioListState, snapshot: any) {
    if (snapshot && 'function' === typeof this.props.onRadioChange) {
      this.props.onRadioChange(this.state.active);
    }
  }

  public render() {
    return (
      <ul className="radio_list" role="tablist">
        {
          this.props.radios.map((radio) => {
            return (
              <li 
                key={radio.value} 
                role="tab"
                onClick={() => this.setState({ active: radio.value })}
              >
                <Radio active={this.state.active === radio.value} />
                <span>{radio.label}</span>
              </li>
            );
          })
        }
      </ul>
    );
  }
}