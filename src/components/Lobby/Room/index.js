import React from "react";
import "./index.css";

// Components
import Header from "./Header/";
import Footer from "./Footer/";
import Body from "./Body/";
import PasswordInput from "./PasswordInput/";

function Room({ roomData }) {
  const [showFooter, setShowFooter] = React.useState(false);

  return (
    <div className="room-item d-flex flex-column shadow mt-2">
      <Header roomData={roomData} />

      <Body
        roomData={roomData}
        setShowFooter={setShowFooter}
        showFooter={showFooter}
      />

      <Footer roomData={roomData} />

      {showFooter ? <PasswordInput roomData={roomData} /> : ""}
    </div>
  );
}

export default Room;
