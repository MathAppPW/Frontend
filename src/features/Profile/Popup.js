import React from "react";

const Popup = ({ title, children, onClose, width, height }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-container" style={{ width, height }}>
        <button className="popup-close" onClick={onClose}>✖</button>
        <h2>{title}</h2>
        <div className="popup-content">{children}</div>
      </div>
    </div>
  );
};

export default Popup;
