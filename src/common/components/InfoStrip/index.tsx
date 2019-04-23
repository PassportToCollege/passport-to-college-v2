import React from "react";
import propTypes from "prop-types";

const InfoStrip = ({ content, children, stripStyles }) => {
  const styles = Object.assign({
    width: "100%",
    backgroundColor: "#FFCB61",
    color: "white",
    fontSize: "2.175em",
    lineHeight: "1.175em",
    fontFamily: "Muli, san-serif",
    padding: "3em",
    textAlign: "center"
  }, stripStyles);

  return (
    <div className="info_strip" style={styles}>
      {
        content ?
          <p style={{
            maxWidth: "600px",
            margin: "0 auto"
          }}>{content}</p> : null
      }
      {children}
    </div>
  )
}

InfoStrip.propTypes = {
  content: propTypes.string,
  stripStyles: propTypes.object,
  children: propTypes.any
};

export default InfoStrip;