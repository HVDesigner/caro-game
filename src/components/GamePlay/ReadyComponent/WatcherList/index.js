import React from "react";
import "./index.css";
import { Container, Row, Col } from "react-bootstrap";
import UserSVG from "./../../../../assets/Dashboard/user.svg";
import { useFirebaseApp } from "reactfire";

function WatcherList({ roomData }) {
  const [listWatcher, setListWatcher] = React.useState([]);

  React.useEffect(() => {
    if (roomData.participants.watcher) {
      setListWatcher(roomData.participants.watcher);
    } else {
      setListWatcher([]);
    }
  }, [roomData.participants.watcher]);

  return (
    <div>
      <p className="mb-1 text-white text-stroke-carotv">Danh sách người xem:</p>
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
  const firebaseApp = useFirebaseApp();
  const [userData, setUserData] = React.useState({
    name: "",
    imageUrl: "",
  });

  React.useEffect(() => {
    firebaseApp
      .firestore()
      .collection(`users`)
      .doc(uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setUserData({
            name: doc.data().name.value,
            imageUrl: doc.data().image_url,
          });
        } else {
          setUserData({
            name: "",
            imageUrl: "",
          });
        }
      });
  }, [firebaseApp, uid]);

  return (
    <div className="d-flex watcher-detail">
      <img
        src={userData.imageUrl ? userData.imageUrl : UserSVG}
        alt="user"
        className={
          userData.imageUrl ? `rounded-circle brown-border shadow mr-2` : `mr-2`
        }
      />
      <p className="align-self-center text-white">{userData.name}</p>
    </div>
  );
}
