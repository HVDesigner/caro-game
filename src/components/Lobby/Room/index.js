import React from "react";
import "./index.css";

// Components
import Header from "./Header/";
import Footer from "./Footer/";
import Body from "./Body/";
import PasswordInput from "./PasswordInput/";

function Room({ roomId, data, type }) {
  const [showFooter, setShowFooter] = React.useState(false);

  return (
    <div className="room-item d-flex flex-column shadow mt-2">
      <Header
        roomId={roomId}
        rule={data.rule}
        type={data.type}
        bet={data.bet}
        time={data.time}
      />

      <Body
        setShowFooter={setShowFooter}
        showFooter={showFooter}
        masterUser={data.participants ? data.participants.master : ""}
        playerUser={data.participants ? data.participants.player : ""}
        password={data.password}
      />

      <Footer title={data.title} />

      {showFooter ? <PasswordInput roomId={roomId} type={type} /> : ""}
    </div>
  );
}

export default Room;
