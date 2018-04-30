import "./LoadingPost.css";

import React from "react";
import propTypes from "prop-types";

import LoadingText from "../LoadingText";

const LoadingPost = ({ styles }) => {
  return (
    <div className="loading_post" style={styles}>
      <LoadingText options={{
        bg: "transparent",
        class: "block__lines center__lines",
        height: "50px",
        lines: [
          { color: "rgba(51,51,51,0.2)", width: "600px" }
        ]
      }}/>
      <LoadingText options={{
        bg: "transparent",
        class: "block__lines center__lines",
        height: "10px",
        lines: [
          { color: "rgba(51,51,51,0.2)", width: "300px" }
        ]
      }} />
      <div className="loading_post__hero"></div>
      <LoadingText options={{
        bg: "transparent",
        class: "block__lines center__lines",
        height: "10px",
        lines: [
          { color: "rgba(51,51,51,0.2)", width: "600px" },
          { color: "rgba(51,51,51,0.2)", width: "600px" },
          { color: "rgba(51,51,51,0.2)", width: "600px" },
          { color: "rgba(51,51,51,0.2)", width: "600px" },
          { color: "rgba(51,51,51,0.2)", width: "600px" },
          { color: "rgba(51,51,51,0.2)", width: "600px" }

        ]
      }} />
      <LoadingText options={{
        bg: "transparent",
        class: "block__lines center__lines",
        height: "10px",
        lines: [
          { color: "rgba(51,51,51,0.2)", width: "600px" },
          { color: "rgba(51,51,51,0.2)", width: "600px" },
          { color: "rgba(51,51,51,0.2)", width: "600px" },
          { color: "rgba(51,51,51,0.2)", width: "600px" },
          { color: "rgba(51,51,51,0.2)", width: "600px" },
          { color: "rgba(51,51,51,0.2)", width: "600px" },
          { color: "rgba(51,51,51,0.2)", width: "600px" },
          { color: "rgba(51,51,51,0.2)", width: "600px" },
          { color: "rgba(51,51,51,0.2)", width: "600px" }

        ]
      }} />
    </div>
  );
}

LoadingPost.propTypes = {
  styles: propTypes.object
};

export default LoadingPost;