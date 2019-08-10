import './Table.css';

import React, { Component } from 'react';
import { makeClassString } from '../../utils';

interface TableHeaderProps {
  heading: string;
  classes: string[];
}

interface TableRowProps {
  classes: string[];
  children: React.ReactChildren;
}

interface TableDataProps extends TableRowProps {
  span?: number;
}

interface TableProps {
  headers: React.ReactNode;
  rows: React.ReactNode;
  classes: string[];
}

export class TableHeader extends Component<TableHeaderProps> {
  public render() {
    return (
      <th className={makeClassString(this.props.classes)}>
        {this.props.heading}
      </th>
    );
  }
}

export class TableRow extends Component<TableRowProps> {
  public render() {
    return (
      <tr className={makeClassString(this.props.classes)}>
        {this.props.children}
      </tr>
    );
  }
}

export class TableData extends Component<TableDataProps> {
public render() {
    return (
      <td 
        className={makeClassString(this.props.classes)}
        colSpan={this.props.span}
      >
        {this.props.children}
      </td>
    );
  }
}

export class Table extends Component<TableProps> {
public render() {
    return (
      <table 
        className={`table ${makeClassString(this.props.classes)}`}
        cellSpacing="0"
      >
        <thead>
          {this.props.headers}
        </thead>
        <tbody>
          {this.props.rows}
        </tbody>
      </table>
    );
  }
}