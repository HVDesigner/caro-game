import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

function FooterComponent({ title }) {
  return (
    <div className="d-flex room-item-footer pl-2 pr-2 text-white bg-success">
      <span className="text-center mr-auto text-stroke-carotv">{title}</span>
      <span className="text-center text-stroke-carotv">
        <FontAwesomeIcon icon={faEye} className="text-white mr-2" />
        20
      </span>
    </div>
  );
}

export default FooterComponent;
