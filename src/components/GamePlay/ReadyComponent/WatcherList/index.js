import React from "react";
import "./index.css";
import { Container, Row, Col } from "react-bootstrap";
import UserSVG from "./../../../../assets/Dashboard/user.svg";

import { FirebaseContext } from "./../../../../Firebase/";

function WatcherList({ watcher }) {
  const [listWatcher, setListWatcher] = React.useState([]);

  React.useEffect(() => {
    setListWatcher(Object.keys(watcher));
  }, [watcher]);

  return (
    <div>
      <p className="mb-1">Danh sách người xem:</p>
      <Container className="brown-border rounded pt-2 mb-2 watcher-list-box overflow-auto shadow">
        <Row>
          {listWatcher.map((value, key) => (
            <Col key={key} className="mb-2">
              <WatcherDetail uid={value} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default WatcherList;

function WatcherDetail({ uid }) {
  const firebase = React.useContext(FirebaseContext);
  const [name, setName] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");

  React.useEffect(() => {
    firebase
      .database()
      .ref(`users/${uid}`)
      .once("value")
      .then((snapshot) => {
        setName(snapshot.val().name.value);
        setImageUrl(snapshot.val().image_url);
      });
  }, [firebase, uid]);

  return (
    <div className="d-flex  watcher-detail">
      <img src={imageUrl ? imageUrl : UserSVG} alt="user" className="mr-2" />
      <p className="align-self-center text-white">{name}</p>
    </div>
  );
}
