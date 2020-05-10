import React from "react";
import MoreSVG from "./../../../assets/Rooms/more.svg";

function ChatComponent({ roomData, setShowMenu, ownType }) {
  const scrollBox = React.useRef(null);

  React.useEffect(() => {
    if (scrollBox) {
      scrollBox.current.scrollTop =
        scrollBox.current.scrollHeight - scrollBox.current.clientHeight;
    }
  }, [scrollBox, roomData.conversation]);

  return (
    <div className="d-flex flex-column h-100 position-absolute w-100">
      <div className="d-flex h-100">
        <div
          className="overflow-auto bg-white pl-2 pr-2 rounded brown-border flex-fill"
          style={{ minHeight: "48px" }}
          ref={scrollBox}
        >
          {roomData.conversation.map((value, key) => {
            return (
              <p key={key}>
                <strong className="mr-2 ">{value.name}:</strong>
                {value.text}
              </p>
            );
          })}
        </div>
        {ownType === "master" || ownType === "player" ? (
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
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default ChatComponent;
