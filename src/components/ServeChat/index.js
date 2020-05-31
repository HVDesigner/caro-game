import React from "react";
import ExitSVG from "./../../assets/Exit.svg";
import AppContext from "./../../context/";

function ServeChat() {
  const { changeRoute } = React.useContext(AppContext);
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  return (
    <div
      className="d-flex flex-column h-100vh w-100vw bg-brown-wood"
      style={{ maxHeight: "100vh" }}
    >
      <div className="flex-fill">
        <h3 className="text-center">Chat</h3>
      </div>
      <div className="flex-fill p-2 h-100 w-100" style={{ maxHeight: "100%" }}>
        <div
          className="d-flex flex-column h-100 w-100 brown-border rounded shadow p-2 overflow-auto"
          style={{ backgroundColor: "#f9da7f", maxHeight: "100%" }}
        >
          {arr.map((value) => (
            <div className="d-flex flex-wrap w-100" key={value}>
              <p className="mb-0 mr-2">
                <strong>Name:</strong>
              </p>
              <p
                className="m-0 flex-fill w-100"
                style={{ wordWrap: "break-word" }}
              >
                Text1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
              </p>
              <p className="m-0">3 day ago</p>
            </div>
          ))}
        </div>
      </div>
      <div className="p-2 d-flex flex-fill">
        <input
          className="input-carotv-2 text-white text-left w-100"
          placeholder="Nhập tin nhắn..."
          type="text"
        />
        <div className="ml-2">
          <p className="m-0">Gửi</p>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <img
          style={{ width: "40%" }}
          src={ExitSVG}
          alt="exit"
          onClick={() => {
            changeRoute("dashboard");
          }}
          className="wood-btn"
        />
      </div>
    </div>
  );
}

export default ServeChat;
