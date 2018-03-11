import "./SearchBar.css";

import React, { Component } from "react";
import propTypes from "prop-types";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/fontawesome-free-solid";

export default class SearchBar extends Component {

  render() {
    return (
      <div className="searchbar">
        <span className="searchbar__icon">
          <FontAwesomeIcon icon={faSearch} />
        </span>
        <input type="text" placeholder={this.props.placeholder || "Type search term here"} />
      </div>
    )
  }
}

SearchBar.propTypes = {
  placeholder: propTypes.string
}