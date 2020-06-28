import React from "react";
import MoreSVG from "./../../../assets/Rooms/more.svg";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFirestoreDocData, useFirestore, SuspenseWithPerf } from "reactfire";

function ChatComponent({ roomData, setShowMenu, ownType, setShowUserList }) {
  const scrollBox = React.useRef(null);

  React.useEffect(() => {
    if (scrollBox.current) {
      scrollBox.current.scrollTop =
        scrollBox.current.scrollHeight - scrollBox.current.clientHeight;
    }
  });

  const countUserInRoom = () => {
    let total = 0;

    if (roomData.participants.watcher) {
      total = roomData.participants.watcher.length + total;
    }

    if (roomData.participants.player) {
      total = total + 1;
    }

    if (roomData.participants.master) {
      total = total + 1;
    }

    return total;
  };

  return (
    <div className="d-flex h-100" style={{ minHeight: "48px" }}>
      <div
        className="overflow-auto pl-2 pr-2 rounded brown-border flex-fill"
        style={{
          minHeight: "48px",
          backgroundColor: "#fff3d0",
          maxHeight: "100%",
        }}
        ref={scrollBox}
      >
        {roomData.conversation.map((value, key) => {
          return (
            <p
              className={
                value.type === "tie-message"
                  ? "text-danger font-weight-bold"
                  : ""
              }
              key={key}
            >
              <SuspenseWithPerf
                fallback={
                  <strong className="mr-2 text-dark">loading...</strong>
                }
                traceId={"load-user-name"}
              >
                <Name uid={value.uid} />
              </SuspenseWithPerf>
              {value.text}
            </p>
          );
        })}
      </div>
      <div className="d-flex flex-column ml-2">
        <img
          src={MoreSVG}
          alt="more"
          style={{ maxWidth: "1.5em", maxHeight: "1.5em" }}
          className="shadow wood-btn mb-1"
          onClick={() => {
            setShowMenu(true);
          }}
        />
        <div
          className="d-flex align-items-center"
          onClick={() => {
            setShowUserList(true);
          }}
          style={{ cursor: "pointer" }}
        >
          <FontAwesomeIcon icon={faEye} className="text-warning mr-1" />
          <span className="text-stroke-carotv text-white">
            {countUserInRoom()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ChatComponent;

function Name({ uid }) {
  const userRef = useFirestore().collection("users").doc(uid);
  const user = useFirestoreDocData(userRef);

  return <strong className="mr-2 text-dark">{user.name.value}:</strong>;
}
