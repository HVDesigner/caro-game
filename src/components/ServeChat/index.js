import React from "react";
// import moment from "moment";
import useSmoothScroll from "use-smooth-scroll";
import {
  useFirestore,
  useFirebaseApp,
  useFirestoreDocDataOnce,
  useDatabase,
} from "reactfire";
// import firebase from "firebase/app";
// import _ from "lodash";

// SVG
import ExitSVG from "./../../assets/Exit.svg";

// Context
import AppContext from "./../../context/";

function ServeChat() {
  const firebaseApp = useFirebaseApp();
  const { changeRoute, state } = React.useContext(AppContext);

  const [message, setMessage] = React.useState("");
  const [messageList, setMessageList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const scrollRef = React.useRef(null);
  const scrollTo = useSmoothScroll("y", scrollRef);

  const getRandomScrollTarget = (node) => node.scrollHeight;

  const scrollToMyRef = React.useCallback(() => {
    if (scrollRef) {
      scrollTo(getRandomScrollTarget(scrollRef.current));
    }
  }, [scrollTo]);

  React.useEffect(() => {
    firebaseApp
      .database()
      .ref("serve-chat")
      .limitToLast(20)
      .once("value")
      .then((res) => {
        const arr = [];

        res.forEach((value) => {
          arr.push({ key: value.key, ...value.val() });
        });

        setMessageList(arr);
        setLoading(false);
        scrollToMyRef();
      });

    return () =>
      firebaseApp
        .database()
        .ref("serve-chat")
        .limitToLast(20)
        .off("child_added");
  }, [firebaseApp, scrollToMyRef]);

  useDatabase()
    .ref("serve-chat")
    .limitToLast(20)
    .on("child_added", (snapshot) => {
      if (loading === false) {
        if (messageList.findIndex((value) => value.key === snapshot.key) < 0) {
          setMessageList([
            ...messageList,
            { key: snapshot.key, ...snapshot.val() },
          ]);
          scrollToMyRef();
        }
      }
    });

  const addChatText = () => {
    if (message) {
      scrollToMyRef();

      firebaseApp.database().ref("serve-chat").push({
        text: message,
        uid: state.user.uid,
        // createdAt: firebase.database.FieldValue.serverTimestamp(),
      });
      setMessage("");
    }
  };

  console.log("render");

  return (
    <div
      className="d-flex flex-column h-100vh w-100vw bg-brown-wood"
      style={{ maxHeight: "100vh" }}
    >
      <div className="flex-fill">
        <h3 className="text-center text-warning text-stroke-carotv mt-2 mb-0">
          Chat
        </h3>
      </div>
      <div
        className="flex-fill h-100 w-100 position-relative"
        style={{ maxHeight: "100%" }}
      >
        <div className="p-2 position-absolute h-100 w-100">
          <div
            className="p-2 d-flex flex-column h-100 w-100 brown-border rounded shadow overflow-auto"
            style={{
              backgroundColor: "#f9da7f",
              maxHeight: "100%",
              height: "100%",
            }}
            ref={scrollRef}
          >
            <React.Fragment>
              <div className="w-100 brown-border rounded bg-gold-wood wood-btn">
                <p className="text-center m-0">Xem thêm</p>
              </div>
              {messageList.map((value) => {
                return (
                  <div
                    className="d-flex w-100"
                    key={value.key}
                    style={{ borderBottom: "0.5px solid" }}
                  >
                    <User uid={value.uid} />
                    <div
                      className="d-flex mr-auto"
                      style={{
                        wordWrap: "normal",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {value.text}
                    </div>
                    {/* <small className="ml-2 text-right">
                    {value.createdAt
                      ? moment(value.createdAt.toDate()).fromNow()
                      : ""}
                  </small> */}
                  </div>
                );
              })}
            </React.Fragment>
          </div>
        </div>
      </div>
      <div className="p-2 d-flex flex-fill">
        <form
          className="w-100"
          onSubmit={(e) => {
            e.preventDefault();
            addChatText();
          }}
        >
          <input
            className="input-carotv-2 text-white text-left w-100"
            placeholder="Nhập tin nhắn..."
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
        </form>
        <div className="ml-2">
          <p
            className="m-0 text-warning text-stroke-carotv"
            onClick={() => {
              addChatText();
            }}
            style={{ cursor: "pointer" }}
          >
            Gửi
          </p>
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
          className="wood-btn mb-2"
        />
      </div>
    </div>
  );
}

export default ServeChat;

function User({ uid }) {
  const getUserRef = useFirestore().collection("users").doc(uid);

  const user = useFirestoreDocDataOnce(getUserRef);

  return (
    <p className="mb-0 mr-2" style={{ cursor: "pointer" }}>
      <strong>{user.name.value}:</strong>
    </p>
  );
}
