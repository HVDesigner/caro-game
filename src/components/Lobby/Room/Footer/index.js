import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

function FooterComponent({ roomData }) {
  return (
    <div className="d-flex room-item-footer pl-2 pr-2 text-white bg-success">
      <span className="text-center mr-auto text-stroke-carotv">
        {roomData.title}
      </span>
      <span className="text-center text-stroke-carotv">
        <FontAwesomeIcon icon={faEye} className="text-white mr-2" />0
      </span>
    </div>
  );
}

export default FooterComponent;
