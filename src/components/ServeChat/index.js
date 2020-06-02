import React from "react";
import moment from "moment";
import {
  useFirestore,
  useFirebaseApp,
  useFirestoreDocOnce,
  useFirestoreDocDataOnce,
} from "reactfire";
import firebase from "firebase/app";
import _ from "lodash";

// SVG
import ExitSVG from "./../../assets/Exit.svg";

// Context
import AppContext from "./../../context/";

function ServeChat() {
  const firebaseApp = useFirebaseApp();
  const { changeRoute, state } = React.useContext(AppContext);
  const [message, setMessage] = React.useState("");
  const [messageList, setMessageList] = React.useState([]);
  const scrollServeChat = React.useRef();

  React.useEffect(() => {
    const unsubscribe = firebaseApp
      .firestore()
      .collection("serve-chat")
      .orderBy("createdAt", "desc")
      .limit(20)
      .onSnapshot((res) => {
        if (res.size > messageList.length) {
          const arr = [];

          res.docChanges(true).forEach((value) => {
            arr.unshift({ key: value.doc.id, ...value.doc.data() });
          });

          setMessageList(arr);
        } else {
          res.docChanges(true).forEach((value) => {
            // console.log(value);
            if (
              value.type === "added" &&
              messageList.findIndex((mess) => mess.key === value.doc.id) < 0
            ) {
              setMessageList([
                ...messageList,
                { key: value.doc.id, ...value.doc.data() },
              ]);

              scrollToMyRef();
            }

            // if (
            //   value.type === "modified" &&
            //   arr.findIndex((mess) => mess.key === value.doc.id) >= 0
            // ) {
            //   const arr = [];

            //   for (let index = 0; index < arr.length; index++) {
            //     const element = arr[index];
            //     if (element.key === value.doc.id) {
            //       arr.push({ key: value.doc.id, ...value.doc.data() });
            //     } else {
            //       arr.push(element);
            //     }
            //   }

            //   setMessageList(arr);
            // }
          });
        }
      });

    return () => {
      unsubscribe();
    };
  }, [firebaseApp, messageList]);

  const scrollToMyRef = () => {
    const scroll =
      scrollServeChat.current.scrollHeight -
      scrollServeChat.current.clientHeight;

    scrollServeChat.current.scrollTo(0, scroll);
  };

  const addChatText = () => {
    if (message) {
      firebaseApp.firestore().collection("serve-chat").add({
        text: message,
        uid: state.user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setMessage("");
    }
  };

  console.log("render", messageList);

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
            style={{ backgroundColor: "#f9da7f", maxHeight: "100%" }}
            ref={scrollServeChat}
          >
            <div className="w-100">
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
                  <small className="ml-2 text-right">
                    {value.createdAt
                      ? moment(value.createdAt.toDate()).fromNow()
                      : ""}
                  </small>
                </div>
              );
            })}
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
