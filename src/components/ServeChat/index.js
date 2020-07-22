import React from "react";
import useSmoothScroll from "use-smooth-scroll";
import {
  useFirestore,
  useFirebaseApp,
  useFirestoreDocDataOnce,
  useFirestoreDocData,
  useDatabase,
} from "reactfire";

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

  const serverChatCount = useFirestore()
    .collection("server-chat-property")
    .doc("count");

  const countTotalMessage = useFirestoreDocData(serverChatCount);

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

  const loadMore = () => {
    firebaseApp
      .database()
      .ref("serve-chat")
      .orderByKey()
      .endAt(messageList[0].key)
      .limitToLast(20)
      .once("value")
      .then((snapshot) => {
        const arr = [];

        snapshot.forEach((value) => {
          if (value.key !== messageList[0].key) {
            arr.push({ key: value.key, ...value.val() });
          }
        });

        setMessageList([...arr, ...messageList]);
      })
      .catch((err) => {});
  };

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
            {loading ? (
              <p className="text-center m-0">Loading...</p>
            ) : (
              <React.Fragment>
                {countTotalMessage.message > messageList.length ? (
                  <div
                    className="w-100 brown-border rounded bg-gold-wood wood-btn"
                    onClick={() => {
                      loadMore();
                    }}
                  >
                    <p className="text-center m-0">Xem thêm</p>
                  </div>
                ) : (
                  ""
                )}
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
                    </div>
                  );
                })}
              </React.Fragment>
            )}
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
      <div className="d-flex justify-content-center p-2">
        <div
          className="wood-btn flex-fill bg-gold-wood p-1 rounded brown-border mr-1"
          onClick={() => {
            changeRoute("dashboard");
          }}
        >
          <p className="m-0 text-center">TRANG CHỦ</p>
        </div>
        <div
          className="wood-btn flex-fill bg-gold-wood p-1 rounded brown-border ml-1"
          onClick={() => {
            changeRoute("lobby");
          }}
        >
          <p className="m-0 text-center">PHÒNG CHƠI</p>
        </div>
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
      <strong>{user.name ? user.name.value : ""}:</strong>
    </p>
  );
}
