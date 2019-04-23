import "./Table.css";

import React, { Component } from "react";
import propTypes from "prop-types";

import { makeClassString } from "../../utils";

export class TableHeader extends Component {
  static propTypes = {
    heading: propTypes.string,
    classes: propTypes.arrayOf(propTypes.string)
  }

  render() {
    return (
      <th className={makeClassString(this.props.classes)}>
        {this.props.heading}
      </th>
    )
  }
}

export class TableRow extends Component {
  static propTypes = {
    children: propTypes.any,
    classes: propTypes.arrayOf(propTypes.string)
  }

  render() {
    return (
      <tr className={makeClassString(this.props.classes)}>
        {this.props.children}
      </tr>
    )
  }
}

export class TableData extends Component {
  static propTypes = {
    children: propTypes.any,
    classes: propTypes.arrayOf(propTypes.string),
    span: propTypes.string
  }

  render() {
    return (
      <td className={makeClassString(this.props.classes)}
        colSpan={this.props.span}>
        {this.props.children}
      </td>
    )
  }
}

export class Table extends Component {
  static propTypes = {
    headers: propTypes.any,
    rows: propTypes.any,
    classes: propTypes.arrayOf(propTypes.string)
  }

  render() {
    return (
      <table className={`table ${makeClassString(this.props.classes)}`}
        cellSpacing="0">
        <thead>
          {this.props.headers}
        </thead>
        <tbody>
          {this.props.rows}
        </tbody>
      </table>
    )
  }
}