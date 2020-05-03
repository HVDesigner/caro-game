import React from "react";
import MoreSVG from "./../../../assets/Rooms/more.svg";

function ChatComponent({ gameStatus, setShowMenu }) {
  return (
    <div className="d-flex flex-column h-100 position-absolute w-100">
      <div className="d-flex h-100">
        <div
          className="overflow-auto bg-white pl-2 pr-2 rounded brown-border flex-fill"
          style={{ minHeight: "48px" }}
        >
          <div className="d-flex flex-column">
            <p>
              <strong className="mr-2 ">Hoang:</strong>123a33
            </p>
            <p>
              <strong className="mr-2 ">Linh:</strong>123a33
            </p>
            <p>
              <strong className="mr-2 ">Linh:</strong>123a33
            </p>
            <p>
              <strong className="mr-2 ">Linh:</strong>123a33
            </p>
            <p>
              <strong className="mr-2 ">Linh:</strong>123a33
            </p>
            <p>
              <strong className="mr-2 ">Linh:</strong>123a33
            </p>
            <p>
              <strong className="mr-2 ">Linh:</strong>123a33
            </p>
          </div>
        </div>
        <div>
          <img
            src={MoreSVG}
            alt="more"
            style={{ width: "1.5em" }}
            className="shadow wood-btn ml-2"
            onClick={() => {
              setShowMenu(true);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatComponent;
