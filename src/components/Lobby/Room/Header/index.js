import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCoins } from "@fortawesome/free-solid-svg-icons";

function HeaderComponent({ roomData }) {
  return (
    <div className="d-flex room-item-head text-white bg-success">
      <span className="text-stroke-carotv">
        <p className="mb-0 ml-2 mr-2">id: {roomData.rid}</p>
      </span>
      <span className="text-stroke-carotv d-flex align-items-center">
        <p className="mb-0 ml-2 mr-2">
          {roomData.rule === "6-win" ? "6 Quân Thắng" : "Chỉ 5 Quân"}
        </p>
      </span>
      {roomData.type === "room" ? (
        roomData.bet ? (
          <span className="text-stroke-carotv d-flex align-items-center">
            <FontAwesomeIcon icon={faCoins} className="text-warning ml-2" />
            <p className="mb-0 ml-2 mr-2">{roomData.bet}</p>
          </span>
        ) : (
          ""
        )
      ) : (
        ""
      )}
      <span className="text-stroke-carotv d-flex align-items-center">
        <FontAwesomeIcon icon={faClock} className="text-warning ml-2" />
        <p className="mb-0 ml-2 mr-2">{roomData.time}</p>
      </span>
    </div>
  );
}

export default HeaderComponent;
