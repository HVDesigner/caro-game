import React from "react";
import "./index.css";

// Components
import LoadingComponent from "./../../Loading/";
import Header from "./Header/";
import Footer from "./Footer/";
import Body from "./Body/";
import PasswordInput from "./PasswordInput/";

function Room({ roomId, data, type }) {
  const [loading, setLoading] = React.useState(true);

  const [showFooter, setShowFooter] = React.useState(false);

  const [masterUser, setMasterUser] = React.useState("");
  const [playerUser, setPlayerUser] = React.useState("");

  React.useEffect(() => {
    if (data.participants) {
      Object.keys(data.participants).forEach((element) => {
        if (data.participants[element].type === "master") {
          setMasterUser(element);
          setLoading(false);
        } else if (data.participants[element].type === "player") {
          setPlayerUser(element);
          setLoading(false);
        }
      });
    }
  }, [data.participants]);

  if (loading) return <LoadingComponent />;

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
        masterUser={masterUser}
        playerUser={playerUser}
        password={data.password}
      />

      <Footer title={data.title} />

      {showFooter ? <PasswordInput roomId={roomId} type={type} /> : ""}
    </div>
  );
}

export default Room;
