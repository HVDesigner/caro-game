import React from "react";

function ChatComponent() {
  return (
    <React.Fragment>
      <div
        className="flex-fill overflow-auto h-100 bg-white pl-2 pr-2 rounded brown-border"
        style={{ minHeight: "48px" }}
      >
        <div style={{ height: "100%" }}>
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
          </div>
        </div>
      </div>
      <div className="p-1 rounded">
        <input
          className="input-carotv-2 text-white text-left w-100"
          placeholder="Nhập tin nhắn..."
          type="text"
        />
      </div>
    </React.Fragment>
  );
}

export default ChatComponent;
